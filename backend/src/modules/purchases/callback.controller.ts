import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/core/env";
import { repoInvalidateDashboardCache, repoInvalidateIlanCache } from "../_shared";
import { retrieveCheckoutForm } from "../wallet/iyzico";
import { verifyPayTRCallback } from "../wallet/paytr";
import { repoCompleteCreditPackagePayment, repoCompleteIlanPayment, repoFailCreditPackagePayment, repoFailIlanPayment } from "./payment.repository";
import { repoMarkPayment, repoPaymentByRef, repoPaymentByToken, repoPaymentBasket, type PaymentProof } from "./session.repository";

type Kind = "credits" | "listing";
async function complete(ref: string, kind: Kind, proof: PaymentProof) {
  const result = kind === "credits" ? await repoCompleteCreditPackagePayment(ref, proof) : await repoCompleteIlanPayment(ref, proof);
  const session = await repoPaymentByRef(ref);
  if (result.ok && session) {
    await repoInvalidateDashboardCache([session.user_id]);
    if (session.ilan_id) await repoInvalidateIlanCache(session.ilan_id);
  }
  return result;
}
async function fail(ref: string, kind: Kind) {
  await (kind === "credits" ? repoFailCreditPackagePayment(ref) : repoFailIlanPayment(ref));
  await repoMarkPayment(ref, "failed", "provider_declined");
}
async function iyzicoCallback(req: FastifyRequest, reply: FastifyReply, kind: Kind) {
  const base = `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc`;
  let ref = "";
  try {
    const body = req.body as Record<string, unknown>;
    if (typeof body?.token !== "string") return reply.code(400).send({error: {message: "invalid_callback"}});
    const session = await repoPaymentByToken(body.token);
    if (!session || session.provider !== "iyzico" || session.kind !== kind) return reply.code(400).send({error: {message: "unknown_payment"}});
    ref = session.payment_ref;
    const detail = await retrieveCheckoutForm(body.token, ref);
    const expectedBasket = await repoPaymentBasket(ref, kind);
    if (detail.basketId !== expectedBasket || detail.currency !== "TRY" || Number(detail.price) !== Number(session.amount) || Number(detail.paidPrice) !== Number(session.amount)) {
      await repoMarkPayment(ref, "review", "receipt_mismatch");
    } else if (detail.status === "success" && detail.paymentStatus === "SUCCESS" && detail.fraudStatus === 1 && detail.paymentId) {
      await complete(ref, kind, {provider: "iyzico", amount: Number(detail.paidPrice), currency: detail.currency, paymentId: detail.paymentId, transactionIds: detail.itemTransactions?.map(x => x.paymentTransactionId)});
    } else if (detail.status === "success" && detail.paymentStatus === "SUCCESS") {
      await repoMarkPayment(ref, "review", "fraud_review");
    } else {
      await fail(ref, kind);
    }
    return reply.redirect(`${base}?ref=${encodeURIComponent(ref)}`);
  } catch (error) {
    req.log.error(error, "payment_callback_failed");
    return reply.redirect(`${base}?ref=${encodeURIComponent(ref)}`);
  }
}
async function paytrCallback(req: FastifyRequest, reply: FastifyReply, kind: Kind) {
  try {
    const body = req.body as Record<string, string>;
    if (!verifyPayTRCallback(body)) return reply.code(400).send("INVALID");
    const session = await repoPaymentByRef(body.merchant_oid);
    if (!session || session.provider !== "paytr" || session.kind !== kind) return reply.code(400).send("UNKNOWN");
    if (body.status === "success") {
      const result = await complete(session.payment_ref, kind, {provider: "paytr", amount: Number(body.total_amount) / 100, currency: "TRY", paymentId: body.merchant_oid});
      if (!result.ok && result.code === "verification_failed") return reply.code(400).send("MISMATCH");
    } else await fail(session.payment_ref, kind);
    return reply.type("text/plain").send("OK");
  } catch (error) {
    req.log.error(error, "paytr_callback_failed");
    return reply.code(500).send("ERROR");
  }
}
export const creditPackageIyzicoCallback = (req: FastifyRequest, reply: FastifyReply) => iyzicoCallback(req, reply, "credits");
export const ilanPaymentIyzicoCallback = (req: FastifyRequest, reply: FastifyReply) => iyzicoCallback(req, reply, "listing");
export const creditPackagePaytrCallback = (req: FastifyRequest, reply: FastifyReply) => paytrCallback(req, reply, "credits");
export const ilanPaymentPaytrCallback = (req: FastifyRequest, reply: FastifyReply) => paytrCallback(req, reply, "listing");
