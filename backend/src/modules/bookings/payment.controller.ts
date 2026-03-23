// src/modules/bookings/payment.controller.ts
// İyzico/PayTR ile doğrudan booking ödemesi (kredi kartı)

import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { users } from "../auth/schema";
import { eq } from "drizzle-orm";
import { getAuthUserId, handleRouteError, sendNotFound } from "@/modules/_shared";
import { env } from "@/core/env";
import { createCheckoutForm, retrieveCheckoutForm } from "../wallet/iyzico";
import { createPayTRToken, encodePayTRBasket, verifyPayTRCallback } from "../wallet/paytr";
import { repoGetBookingById, repoUpdatePaymentStatus, repoUpdatePaymentRef } from "./repository";
import { repoDeductCapacity } from "../ilanlar/repository";
import { notifyBookingCreated } from "./notify";
import { bookings } from "./schema";

function normalizeIp(req: { headers: Record<string, unknown>; ip?: string }): string {
  const raw = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.ip ?? "127.0.0.1";
  return raw === "::1" || raw === "::ffff:127.0.0.1" ? "127.0.0.1" : raw;
}

/** POST /bookings/:id/pay — Ödeme başlat (İyzico, PayTR veya dev) */
export const initiateBookingPayment: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId)
      return reply.code(403).send({ error: { message: "forbidden" } });
    if (!["card", "paytr"].includes(booking.payment_method ?? ""))
      return reply.code(400).send({ error: { message: "invalid_payment_method" } });
    if (booking.payment_status !== "pending")
      return reply.code(400).send({ error: { message: "payment_already_processed" } });

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return reply.code(404).send({ error: { message: "user_not_found" } });

    const conversationId = randomUUID();
    const amountStr = parseFloat(booking.total_price).toFixed(2);
    const nameParts = (user.full_name ?? "PaketJet Kullanıcı").trim().split(" ");
    const firstName = nameParts[0] ?? "PaketJet";
    const lastName = nameParts.slice(1).join(" ") || "Kullanıcı";
    const buyerIp = normalizeIp(req);

    await repoUpdatePaymentRef(id, conversationId);

    const frontendUrl = env.FRONTEND_URL;

    // --- DEV MODE: Ödemeyi direkt başarılı say ---
    if (env.NODE_ENV === "development" && (req.query as Record<string, string>)?.dev === "1") {
      await repoUpdatePaymentStatus(booking.id, "paid");
      await repoDeductCapacity(booking.ilan_id, parseFloat(booking.kg_amount));
      const fullBooking = await repoGetBookingById(booking.id);
      if (fullBooking) void notifyBookingCreated(fullBooking, booking.customer_id, booking.carrier_id);
      return reply.send({ provider: "dev", paid: true, conversationId });
    }

    // --- CASE: PayTR ---
    if (booking.payment_method === "paytr") {
      const kurusAmount = Math.round(parseFloat(booking.total_price) * 100);
      const basket = encodePayTRBasket([
        [`PaketJet Kargo - ${booking.from_city ?? ""} → ${booking.to_city ?? ""}`, booking.total_price, 1]
      ]);

      const paytrRes = await createPayTRToken({
        merchant_oid: conversationId,
        email: user.email,
        payment_amount: kurusAmount,
        user_ip: buyerIp,
        user_basket: basket,
        user_name: `${firstName} ${lastName}`,
        user_address: "Türkiye",
        user_phone: user.phone || "05550000000",
        merchant_ok_url: `${frontendUrl}/panel/musteri/odeme-sonuc?booking_id=${id}&status=success`,
        merchant_fail_url: `${frontendUrl}/panel/musteri/odeme-sonuc?booking_id=${id}&status=fail`,
        merchant_notify_url: `${env.PUBLIC_URL}/api/bookings/pay/paytr-callback`,
        currency: "TL",
      });

      return reply.send({
        provider: "paytr",
        token: paytrRes.token,
        iframeUrl: paytrRes.iframe_url,
        conversationId,
      });
    }

    // --- CASE: Iyzico ---
    const callbackUrl = `${env.PUBLIC_URL}/api/bookings/pay/callback`;

    const iyzicoRes = await createCheckoutForm({
      locale: "tr",
      conversationId,
      price: amountStr,
      paidPrice: amountStr,
      currency: "TRY",
      basketId: `booking-${id}`,
      paymentGroup: "PRODUCT",
      callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: userId,
        name: firstName,
        surname: lastName,
        email: user.email,
        identityNumber: "11111111111",
        registrationAddress: "Türkiye",
        city: "Istanbul",
        country: "Turkey",
        ip: buyerIp,
      },
      shippingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      billingAddress: { contactName: `${firstName} ${lastName}`, city: "Istanbul", country: "Turkey", address: "Türkiye" },
      basketItems: [{
        id: id,
        name: `PaketJet Kargo - ${booking.from_city ?? ""} → ${booking.to_city ?? ""}`,
        category1: "Kargo",
        itemType: "PHYSICAL",
        price: amountStr,
      }],
    });

    if (iyzicoRes.status !== "success" || !iyzicoRes.checkoutFormContent) {
      req.log.warn({ iyzicoRes, buyerIp }, "booking_payment_iyzico_failed");
      return reply.code(502).send({ error: { message: "iyzico_init_failed", details: iyzicoRes.errorMessage, errorCode: iyzicoRes.errorCode } });
    }

    return reply.send({
      provider: "iyzico",
      checkoutFormContent: iyzicoRes.checkoutFormContent,
      token: iyzicoRes.token,
      conversationId,
      successUrl: `${frontendUrl}/panel/musteri/odeme-sonuc?booking_id=${id}&status=success`,
      failUrl: `${frontendUrl}/panel/musteri/odeme-sonuc?booking_id=${id}&status=fail`,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_payment_initiate");
  }
};

/** POST /bookings/pay/callback — İyzico callback (public, no auth) */
export const bookingPaymentCallback: RouteHandler = async (req, reply) => {
  const frontendBase = env.FRONTEND_URL;

  try {
    const body = req.body as Record<string, string>;
    const token = body?.token;
    const conversationId = body?.conversationId;

    if (!token) return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?status=fail&reason=no_token`);
    if (!conversationId) return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?status=fail&reason=no_conversation`);

    const allBookings = await db.select().from(bookings)
      .where(eq(bookings.payment_ref, conversationId))
      .limit(1);
    const booking = allBookings[0];

    if (!booking) {
      req.log.warn({ conversationId }, "booking_payment_callback: booking not found");
      return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?status=fail&reason=not_found`);
    }

    if (booking.payment_status !== "pending") {
      const ok = booking.payment_status === "paid";
      return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?booking_id=${booking.id}&status=${ok ? "success" : "fail"}&reason=already_processed`);
    }

    if (body?.status !== "success") {
      await repoUpdatePaymentStatus(booking.id, "failed");
      return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?booking_id=${booking.id}&status=fail&reason=payment_failed`);
    }

    // İyzico'dan doğrula
    const detail = await retrieveCheckoutForm(token, conversationId);
    const paid = detail.status === "success" && detail.paymentStatus === "SUCCESS" && (detail.fraudStatus ?? 0) === 1;

    if (!paid) {
      await repoUpdatePaymentStatus(booking.id, "failed");
      req.log.warn({ detail }, "booking_payment_callback: verification failed");
      return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?booking_id=${booking.id}&status=fail&reason=verification_failed`);
    }

    await repoUpdatePaymentStatus(booking.id, "paid");
    await repoDeductCapacity(booking.ilan_id, parseFloat(booking.kg_amount));

    const fullBooking = await repoGetBookingById(booking.id);
    if (fullBooking) {
      void notifyBookingCreated(fullBooking, booking.customer_id, booking.carrier_id);
    }

    req.log.info({ bookingId: booking.id }, "booking_payment_callback: payment completed");
    return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?booking_id=${booking.id}&status=success`);
  } catch (e) {
    req.log.error(e, "booking_payment_callback: unexpected error");
    return reply.redirect(`${frontendBase}/panel/musteri/odeme-sonuc?status=fail&reason=server_error`);
  }
};

/** POST /bookings/pay/paytr-callback — PayTR callback (public, no auth) */
export const bookingPayTRCallback: RouteHandler = async (req, reply) => {
  try {
    const body = req.body as Record<string, string>;
    if (!verifyPayTRCallback(body)) {
      req.log.warn({ body }, "paytr_callback: hash mismatch");
      return reply.send("PAYTR: hash mismatch");
    }

    const { merchant_oid, status } = body;
    const [booking] = await db.select().from(bookings).where(eq(bookings.payment_ref, merchant_oid)).limit(1);

    if (!booking) {
      req.log.warn({ merchant_oid }, "paytr_callback: booking not found");
      return reply.send("OK");
    }

    if (booking.payment_status !== "pending") {
      return reply.send("OK");
    }

    if (status === "success") {
      await repoUpdatePaymentStatus(booking.id, "paid");
      await repoDeductCapacity(booking.ilan_id, parseFloat(booking.kg_amount));

      const fullBooking = await repoGetBookingById(booking.id);
      if (fullBooking) {
        void notifyBookingCreated(fullBooking, booking.customer_id, booking.carrier_id);
      }
      req.log.info({ bookingId: booking.id }, "paytr_callback: success");
    } else {
      await repoUpdatePaymentStatus(booking.id, "failed");
      req.log.info({ bookingId: booking.id }, "paytr_callback: failed");
    }

    return reply.send("OK");
  } catch (e) {
    req.log.error(e, "paytr_callback: unexpected error");
    return reply.send("ERROR");
  }
};
