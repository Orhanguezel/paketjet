import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/core/env";
import { getAuthUserId, handleRouteError, repoInvalidateDashboardCache } from "@/modules/_shared";
import { createCheckoutForm, retrieveCheckoutForm } from "../wallet/iyzico";
import { createPayTRToken, encodePayTRBasket, verifyPayTRCallback } from "../wallet/paytr";
import {
  repoCompleteCreditPackagePayment,
  repoCreateCreditPackagePayment,
  repoFailCreditPackagePayment,
} from "./payment.repository";
import { purchaseCreditPackageSchema } from "./validation";

function buyerParts(fullName?: string | null) {
  const parts = (fullName ?? "PaketJet Kullanıcı").trim().split(" ");
  return { firstName: parts[0] ?? "PaketJet", lastName: parts.slice(1).join(" ") || "Kullanıcı" };
}

function normalizeIp(req: FastifyRequest) {
  const raw = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? req.ip ?? "127.0.0.1";
  return raw === "::1" || raw === "::ffff:127.0.0.1" ? "127.0.0.1" : raw;
}

export async function purchaseCreditPackage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const body = purchaseCreditPackageSchema.parse(req.body);
    const result = await repoCreateCreditPackagePayment(userId, body.package_key, body.provider);
    if (!result.ok) return reply.code(result.code === "user_not_found" ? 404 : 400).send({ error: { message: result.code } });

    const amount = Number(result.purchase.price);
    const amountStr = amount.toFixed(2);
    const { firstName, lastName } = buyerParts(result.user.full_name);
    const buyerIp = normalizeIp(req);

    if (body.provider === "paytr") {
      const paytr = await createPayTRToken({
        merchant_oid: result.purchase.payment_ref,
        email: result.user.email,
        payment_amount: Math.round(amount * 100),
        user_ip: buyerIp,
        user_basket: encodePayTRBasket([[`${result.pack.credits} İlan Alma Hakkı`, amountStr, 1]]),
        user_name: `${firstName} ${lastName}`,
        user_address: "Türkiye",
        user_phone: result.user.phone || "05550000000",
        merchant_ok_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?status=success&amount=${encodeURIComponent(amountStr)}`,
        merchant_fail_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?status=fail`,
        merchant_notify_url: `${env.PUBLIC_URL}/api/ilan-alma-hakki/satin-al/paytr-callback`,
        currency: "TL",
      });
      return reply.send({ provider: "paytr", token: paytr.token, iframeUrl: paytr.iframe_url, conversationId: result.purchase.payment_ref, amount });
    }

    const iyzico = await createCheckoutForm({
      locale: "tr", conversationId: result.purchase.payment_ref, price: amountStr, paidPrice: amountStr,
      currency: "TRY", basketId: `credits-${result.purchase.id}`, paymentGroup: "PRODUCT",
      callbackUrl: `${env.PUBLIC_URL}/api/ilan-alma-hakki/satin-al/callback`, enabledInstallments: [1],
      buyer: { id: userId, name: firstName, surname: lastName, email: result.user.email, identityNumber: "11111111111", registrationAddress: "Türkiye", city: "Istanbul", country: "Turkey", ip: buyerIp },
      shippingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      billingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      basketItems: [{ id: result.purchase.id, name: `${result.pack.credits} İlan Alma Hakkı`, category1: "Dijital", itemType: "VIRTUAL", price: amountStr }],
    });

    if (iyzico.status !== "success" || !iyzico.checkoutFormContent) {
      await repoFailCreditPackagePayment(result.purchase.payment_ref);
      return reply.code(502).send({ error: { message: "iyzico_init_failed", details: iyzico.errorMessage } });
    }
    return reply.send({ provider: "iyzico", checkoutFormContent: iyzico.checkoutFormContent, token: iyzico.token, conversationId: result.purchase.payment_ref, amount });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_alma_hakki_satin_al");
  }
}

export async function creditPackageIyzicoCallback(req: FastifyRequest, reply: FastifyReply) {
  const successBase = `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc`;
  try {
    const body = req.body as Record<string, string>;
    if (!body?.token || !body?.conversationId) return reply.redirect(`${successBase}?status=fail&reason=no_token`);
    const detail = await retrieveCheckoutForm(body.token, body.conversationId);
    const paid = detail.status === "success" && detail.paymentStatus === "SUCCESS" && (detail.fraudStatus ?? 0) === 1;
    if (!paid) {
      await repoFailCreditPackagePayment(body.conversationId);
      return reply.redirect(`${successBase}?status=fail&reason=verification_failed`);
    }
    const completed = await repoCompleteCreditPackagePayment(body.conversationId);
    if (completed.ok) await repoInvalidateDashboardCache([completed.purchase.user_id]);
    return reply.redirect(`${successBase}?status=success`);
  } catch (e) {
    req.log.error(e, "credit_package_iyzico_callback");
    return reply.redirect(`${successBase}?status=fail&reason=server_error`);
  }
}

export async function creditPackagePaytrCallback(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body as Record<string, string>;
    if (!verifyPayTRCallback(body)) return reply.send("PAYTR: hash mismatch");
    if (body.status === "success") {
      const completed = await repoCompleteCreditPackagePayment(body.merchant_oid);
      if (completed.ok) await repoInvalidateDashboardCache([completed.purchase.user_id]);
    } else {
      await repoFailCreditPackagePayment(body.merchant_oid);
    }
    return reply.send("OK");
  } catch (e) {
    req.log.error(e, "credit_package_paytr_callback");
    return reply.send("ERROR");
  }
}
