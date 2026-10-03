// src/modules/purchases/payment.controller.ts
// Kart odemesi baslatma (Shopier). Oturum repository'de acilir, odeme sayfasi servis katmaninda olusur.
import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthUserId, handleRouteError } from "@/modules/_shared";
import { requirePaymentProvider } from "./payment-policy";
import { repoCreateCreditPackagePayment, repoCreateIlanPayment } from "./payment.repository";
import { startShopierCheckout } from "./shopier.service";
import { initiateIlanPaymentSchema, purchaseCreditPackageSchema } from "./validation";

function normalizeIp(req: FastifyRequest) {
  const raw = req.ip ?? "127.0.0.1";
  return raw === "::1" || raw === "::ffff:127.0.0.1" ? "127.0.0.1" : raw;
}

/** POST /ilan-alma-hakki/satin-al */
export async function purchaseCreditPackage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const body = purchaseCreditPackageSchema.parse(req.body);
    const provider = requirePaymentProvider(body.provider);
    const result = await repoCreateCreditPackagePayment(userId, body.package_key, provider);
    if (!result.ok) return reply.code(result.code === "user_not_found" ? 404 : 400).send({ error: { message: result.code } });
    const ref = result.purchase.payment_ref;
    const amount = Number(result.purchase.price);
    const redirectUrl = await startShopierCheckout({ ref, kind: "credits", amount, title: `${result.pack.credits} İlan Alma Hakkı` }, req.log);
    return reply.send({ provider, redirectUrl, conversationId: ref, amount });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_alma_hakki_satin_al");
  }
}

/** POST /ilanlar/:id/satin-al/odeme */
export async function initiateIlanPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const body = initiateIlanPaymentSchema.parse(req.body);
    const provider = requirePaymentProvider(body.provider);
    const result = await repoCreateIlanPayment(id, userId, provider, body, normalizeIp(req));
    if (!result.ok) return reply.code(result.code === "user_not_found" ? 404 : 400).send({ error: { message: result.code } });
    const ref = result.payment.payment_ref;
    const redirectUrl = await startShopierCheckout({ ref, kind: "listing", amount: result.price, title: "İlan iletişim erişimi" }, req.log);
    return reply.send({ provider, redirectUrl, conversationId: ref, amount: result.price });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_tekil_odeme_baslat");
  }
}
