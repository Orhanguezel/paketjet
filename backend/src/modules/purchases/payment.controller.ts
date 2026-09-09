import { requirePaymentProvider } from "./payment-policy";
import { repoSavePaymentToken,repoMarkPayment } from "./session.repository";
export { creditPackageIyzicoCallback, creditPackagePaytrCallback, ilanPaymentIyzicoCallback, ilanPaymentPaytrCallback } from "./callback.controller";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/core/env";
import { getAuthUserId, handleRouteError, repoInvalidateDashboardCache } from "@/modules/_shared";
import { createCheckoutForm, retrieveCheckoutForm } from "../wallet/iyzico";
import { createPayTRToken, encodePayTRBasket, verifyPayTRCallback } from "../wallet/paytr";
import {
  repoCompleteCreditPackagePayment,
  repoCompleteIlanPayment,
  repoCreateCreditPackagePayment,
  repoCreateIlanPayment,
  repoFailCreditPackagePayment,
  repoFailIlanPayment,
} from "./payment.repository";
import { initiateIlanPaymentSchema, purchaseCreditPackageSchema } from "./validation";

function buyerParts(fullName?: string | null) {
  const parts = (fullName ?? "PaketJet Kullanıcı").trim().split(" ");
  return { firstName: parts[0] ?? "PaketJet", lastName: parts.slice(1).join(" ") || "Kullanıcı" };
}

function normalizeIp(req: FastifyRequest) {
  const raw = req.ip ?? "127.0.0.1";
  return raw === "::1" || raw === "::ffff:127.0.0.1" ? "127.0.0.1" : raw;
}

export async function purchaseCreditPackage(req: FastifyRequest, reply: FastifyReply) {
  let paymentRef:string|undefined;
  try {
    const userId = getAuthUserId(req);
    const body = purchaseCreditPackageSchema.parse(req.body);
    const provider = requirePaymentProvider(body.provider);
    const result = await repoCreateCreditPackagePayment(userId, body.package_key, provider);
    if (!result.ok) return reply.code(result.code === "user_not_found" ? 404 : 400).send({ error: { message: result.code } });

    paymentRef=result.purchase.payment_ref;
    const amount = Number(result.purchase.price);
    const amountStr = amount.toFixed(2);
    const { firstName, lastName } = buyerParts(result.user.full_name);
    const buyerIp = normalizeIp(req);

    if (provider === "paytr") {
      const paytr = await createPayTRToken({
        merchant_oid: result.purchase.payment_ref,
        email: result.user.email,
        payment_amount: Math.round(amount * 100),
        user_ip: buyerIp,
        user_basket: encodePayTRBasket([[`${result.pack.credits} İlan Alma Hakkı`, amountStr, 1]]),
        user_name: `${firstName} ${lastName}`,
        user_address: "Türkiye",
        user_phone: result.user.phone || "05550000000",
        merchant_ok_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=${encodeURIComponent(result.purchase.payment_ref)}`,
        merchant_fail_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=${encodeURIComponent(result.purchase.payment_ref)}`,
        merchant_notify_url: `${env.PUBLIC_URL}/api/ilan-alma-hakki/satin-al/paytr-callback`,
        currency: "TL",
      });
      await repoSavePaymentToken(result.purchase.payment_ref,paytr.token);
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

    if (iyzico.status !== "success" || !iyzico.checkoutFormContent || !iyzico.token) {
      await repoFailCreditPackagePayment(result.purchase.payment_ref);
      return reply.code(502).send({ error: { message: "iyzico_init_failed" } });
    }
    await repoSavePaymentToken(result.purchase.payment_ref, iyzico.token);
    return reply.send({ provider: "iyzico", checkoutFormContent: iyzico.checkoutFormContent, token: iyzico.token, conversationId: result.purchase.payment_ref, amount });
  } catch (e) {
    if(paymentRef)await repoMarkPayment(paymentRef,'review','provider_init_uncertain');
    return handleRouteError(reply, req, e, "ilan_alma_hakki_satin_al");
  }
}

export async function initiateIlanPayment(req: FastifyRequest, reply: FastifyReply) {
  let paymentRef:string|undefined;
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const body = initiateIlanPaymentSchema.parse(req.body);
    const buyerIp = normalizeIp(req);
    const provider = requirePaymentProvider(body.provider);
    const result = await repoCreateIlanPayment(id, userId, provider, body, buyerIp);
    if (!result.ok) return reply.code(result.code === "user_not_found" ? 404 : 400).send({ error: { message: result.code } });

    paymentRef=result.payment.payment_ref;
    const amountStr = result.price.toFixed(2);
    const { firstName, lastName } = buyerParts(result.user.full_name);
    if (provider === "paytr") {
      const paytr = await createPayTRToken({
        merchant_oid: result.payment.payment_ref,
        email: result.user.email,
        payment_amount: Math.round(result.price * 100),
        user_ip: buyerIp,
        user_basket: encodePayTRBasket([["İlan iletişim erişimi", amountStr, 1]]),
        user_name: `${firstName} ${lastName}`,
        user_address: "Türkiye",
        user_phone: result.user.phone || "05550000000",
        merchant_ok_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=${encodeURIComponent(result.payment.payment_ref)}`,
        merchant_fail_url: `${env.FRONTEND_URL}/panel/ilan-alma-hakki/odeme-sonuc?ref=${encodeURIComponent(result.payment.payment_ref)}`,
        merchant_notify_url: `${env.PUBLIC_URL}/api/ilanlar/satin-al/paytr-callback`,
        currency: "TL",
      });
      await repoSavePaymentToken(result.payment.payment_ref,paytr.token);
      return reply.send({ provider: "paytr", token: paytr.token, iframeUrl: paytr.iframe_url, conversationId: result.payment.payment_ref, amount: result.price });
    }

    const iyzico = await createCheckoutForm({
      locale: "tr", conversationId: result.payment.payment_ref, price: amountStr, paidPrice: amountStr,
      currency: "TRY", basketId: `ilan-${result.payment.id}`, paymentGroup: "PRODUCT",
      callbackUrl: `${env.PUBLIC_URL}/api/ilanlar/satin-al/callback`, enabledInstallments: [1],
      buyer: { id: userId, name: firstName, surname: lastName, email: result.user.email, identityNumber: "11111111111", registrationAddress: "Türkiye", city: "Istanbul", country: "Turkey", ip: buyerIp },
      shippingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      billingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      basketItems: [{ id: result.payment.id, name: "İlan iletişim erişimi", category1: "Dijital", itemType: "VIRTUAL", price: amountStr }],
    });

    if (iyzico.status !== "success" || !iyzico.checkoutFormContent || !iyzico.token) {
      await repoFailIlanPayment(result.payment.payment_ref);
      return reply.code(502).send({ error: { message: "iyzico_init_failed" } });
    }
    await repoSavePaymentToken(result.payment.payment_ref, iyzico.token);
    return reply.send({ provider: "iyzico", checkoutFormContent: iyzico.checkoutFormContent, token: iyzico.token, conversationId: result.payment.payment_ref, amount: result.price });
  } catch (e) {
    if(paymentRef)await repoMarkPayment(paymentRef,'review','provider_init_uncertain');
    return handleRouteError(reply, req, e, "ilan_tekil_odeme_baslat");
  }
}
