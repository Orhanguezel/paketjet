// src/modules/bookings/controller.ts
import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import {
  getAuthUserId,
  handleRouteError,
  sendNotFound,
  sendForbidden,
} from "@/modules/_shared";
import { createUpdateBookingStatusExtra, parseBookingsListParams } from "./helpers";
import { ilanlar } from "../ilanlar/schema";
import { repoDeductCapacity, repoRestoreCapacity } from "../ilanlar/repository";
import {
  repoGetBookingById,
  repoListBookings,
  repoCreateBooking,
  repoUpdateBookingStatus,
  repoUpdatePaymentStatus,
  repoUpdateBookingCommission,
} from "./repository";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  cancelBookingSchema,
} from "./validation";
import { deductForBooking, creditCarrier, refundToCustomer } from "../wallet/service";
import { getCommissionRate, calculateCarrierPayout } from "../wallet/commission";
import { repoGetFirstRowByFallback } from "../siteSettings/repository";
import {
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyBookingInTransit,
  notifyBookingDelivered,
  notifyBookingCancelled,
} from "./notify";

// ── Musteri: rezervasyon olustur ──────────────────────────────────────────────

export const createBooking: RouteHandler = async (req, reply) => {
  try {
    const customerId = getAuthUserId(req);
    const body = createBookingSchema.parse(req.body ?? {});

    const [ilan] = await db.select().from(ilanlar).where(eq(ilanlar.id, body.ilan_id)).limit(1);
    if (!ilan || ilan.status !== "active")
      return reply.code(400).send({ error: { message: "ilan_not_available" } });

    const available = parseFloat(ilan.available_capacity_kg);
    if (body.kg_amount > available)
      return reply.code(400).send({ error: { message: "insufficient_capacity", available } });

    if (ilan.user_id === customerId)
      return reply.code(400).send({ error: { message: "cannot_book_own_ilan" } });

    const totalPrice = body.kg_amount * parseFloat(ilan.price_per_kg);
    const paymentMethod = body.payment_method ?? "wallet";

    // Ortak booking verileri
    const bookingData = {
      ilanId: body.ilan_id,
      customerId,
      carrierId: ilan.user_id,
      kgAmount: body.kg_amount,
      totalPrice,
      currency: ilan.currency,
      pickupAddress: body.pickup_address,
      deliveryAddress: body.delivery_address,
      customerNotes: body.customer_notes,
      paymentMethod,
    };

    if (paymentMethod === "wallet") {
      // Wallet: hemen öde, kapasite düş
      await deductForBooking(customerId, totalPrice, body.ilan_id);
      const booking = await repoCreateBooking({ ...bookingData, paymentStatus: "paid" });
      if (!booking) return reply.code(500).send({ error: { message: "booking_creation_failed" } });
      await repoUpdatePaymentStatus(booking.id, "paid");
      await repoDeductCapacity(body.ilan_id, body.kg_amount);
      void notifyBookingCreated(
        { ...booking, departure_date: ilan.departure_date ? String(ilan.departure_date) : undefined },
        customerId, ilan.user_id,
      );
      return reply.code(201).send(booking);
    }

    if (paymentMethod === "card") {
      // Kredi kartı: booking oluştur, ödeme bekle (İyzico ile ayrı endpoint'te)
      const booking = await repoCreateBooking({ ...bookingData, paymentStatus: "pending" });
      if (!booking) return reply.code(500).send({ error: { message: "booking_creation_failed" } });
      return reply.code(201).send({ ...booking, requires_payment: true });
    }

    if (paymentMethod === "transfer") {
      // Havale/EFT: booking oluştur, referans kodu üret, admin onayı bekle
      const paymentRef = `PJ-${Date.now().toString(36).toUpperCase()}`;
      const booking = await repoCreateBooking({ ...bookingData, paymentStatus: "awaiting_transfer", paymentRef });
      if (!booking) return reply.code(500).send({ error: { message: "booking_creation_failed" } });
      // Banka bilgilerini döndür
      let bankDetails = null;
      try {
        const row = await repoGetFirstRowByFallback("bank_details", ["tr", "*"]);
        if (row) bankDetails = JSON.parse(row.value);
      } catch { /* ignore */ }
      return reply.code(201).send({ ...booking, bank_details: bankDetails });
    }

    return reply.code(400).send({ error: { message: "invalid_payment_method" } });
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_create_failed");
  }
};

// ── Liste ─────────────────────────────────────────────────────────────────────

export const listMyBookings: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const q = req.query as Record<string, string>;
    const params = parseBookingsListParams(q);
    const result = await repoListBookings({ userId, ...params });
    reply.header("x-total-count", String(result.total));
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "bookings_list_failed");
  }
};

export const getBooking: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);
    return reply.send(booking);
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_get_failed");
  }
};

// ── Tasiyici: onayla ─────────────────────────────────────────────────────────

export const confirmBooking: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.carrier_id !== userId) return sendForbidden(reply);
    if (booking.status !== "pending")
      return reply.code(400).send({ error: { message: "booking_not_pending" } });

    const updated = await repoUpdateBookingStatus(id, "confirmed", { confirmed_at: new Date() });
    if (updated) void notifyBookingConfirmed(updated);

    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_confirm_failed");
  }
};

// ── Durum guncelle (tasiyici) ────────────────────────────────────────────────

export const updateBookingStatus: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const { status, carrier_notes } = updateBookingStatusSchema.parse(req.body ?? {});

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.carrier_id !== userId) return sendForbidden(reply);

    const updated = await repoUpdateBookingStatus(
      id,
      status,
      createUpdateBookingStatusExtra({ status, carrier_notes }),
    );

    if (status === "in_transit" && updated) void notifyBookingInTransit(updated);

    if (status === "delivered") {
      const totalPrice = parseFloat(booking.total_price);
      const { rate } = await getCommissionRate();
      const { carrierPayout, commissionAmount } = calculateCarrierPayout(totalPrice, rate);
      await creditCarrier(booking.carrier_id, carrierPayout, id);
      await repoUpdateBookingCommission(id, rate, commissionAmount);
      await repoUpdatePaymentStatus(id, "paid");
      if (updated) void notifyBookingDelivered(updated);
    }

    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_status_update_failed");
  }
};

// ── Iptal ─────────────────────────────────────────────────────────────────────

export const cancelBooking: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    cancelBookingSchema.parse(req.body ?? {});

    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);

    const isParty = booking.customer_id === userId || booking.carrier_id === userId;
    if (!isParty) return sendForbidden(reply);

    if (["delivered", "cancelled"].includes(booking.status))
      return reply.code(400).send({ error: { message: "cannot_cancel_booking" } });

    await repoUpdateBookingStatus(id, "cancelled", { cancelled_at: new Date() });
    await repoRestoreCapacity(booking.ilan_id, parseFloat(booking.kg_amount));

    if (booking.payment_status === "paid") {
      await refundToCustomer(booking.customer_id, parseFloat(booking.total_price), id);
      await repoUpdatePaymentStatus(id, "refunded");
    }

    void notifyBookingCancelled(booking, userId);

    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_cancel_failed");
  }
};

// ── Banka bilgileri ──────────────────────────────────────────────────────────

export const getBankDetails: RouteHandler = async (req, reply) => {
  try {
    const row = await repoGetFirstRowByFallback("bank_details", ["tr", "*"]);
    if (!row) return reply.send({ iban: "", account_name: "", bank_name: "", description: "" });
    return reply.send(JSON.parse(row.value));
  } catch (e) {
    return handleRouteError(reply, req, e, "bank_details_error");
  }
};
