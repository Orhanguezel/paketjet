// src/modules/purchases/shopier.controller.ts
// Shopier webhook + kullanicinin "odemeyi kontrol et" istegi. DB sorgusu yok.
import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound } from "@/modules/_shared";
import { ShopierApiError, productIdsFromOrderEvent, verifyShopierSignature } from "./shopier";
import { reconcileShopierPayment, settleShopierOrder } from "./shopier.service";

export type RawBodyRequest = FastifyRequest & { rawBody?: Buffer };

/** POST /payments/shopier/webhook — Shopier 5 sn icinde 200 bekler; hatada 9 kez yeniden dener. */
export async function shopierWebhook(req: RawBodyRequest, reply: FastifyReply) {
  const event = String(req.headers["shopier-event"] ?? "");
  const signature = req.headers["shopier-signature"];
  if (!req.rawBody || !verifyShopierSignature(req.rawBody, typeof signature === "string" ? signature : undefined)) {
    req.log.warn({ event: "shopier_webhook_rejected", shopierEvent: event }, "shopier_webhook_rejected");
    return reply.code(401).send({ error: { message: "invalid_signature" } });
  }
  if (event !== "order.created") return reply.send({ ok: true, ignored: event });
  const parsed = productIdsFromOrderEvent(req.body);
  if (!parsed) return reply.send({ ok: true, ignored: "no_order" });
  try {
    const results = await settleShopierOrder(parsed.orderId, req.log);
    req.log.info({ event: "shopier_webhook_processed", orderId: parsed.orderId, results }, "shopier_webhook_processed");
    return reply.send({ ok: true });
  } catch (err) {
    if (err instanceof ShopierApiError && err.status === 404) {
      req.log.warn({ event: "shopier_webhook_unknown_order", orderId: parsed.orderId }, "shopier_webhook_unknown_order");
      return reply.send({ ok: true, ignored: "unknown_order" });
    }
    // 5xx: Shopier yeniden dener. Islem idempotent oldugu icin tekrar guvenli.
    req.log.error({ err, event: "shopier_webhook_failed", orderId: parsed.orderId }, "shopier_webhook_failed");
    return reply.code(500).send({ error: { message: "retry" } });
  }
}

/** POST /payments/:ref/shopier/check — webhook gecikirse kullanici odemesini kendisi dogrulatir. */
export async function checkShopierPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ref } = req.params as { ref: string };
    const state = await reconcileShopierPayment(ref, getAuthUserId(req), req.log);
    if (!state) return sendNotFound(reply);
    return reply.send({ state });
  } catch (e) {
    return handleRouteError(reply, req, e, "shopier_payment_check");
  }
}
