// src/modules/bookings/notify.ts
// Booking lifecycle bildirim tetikleyicileri (mail + telegram + in-app)
// Fire-and-forget — hata firlatmaz.

import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { users } from "../auth/schema";
import { createUserNotification } from "../notifications/service";
import {
  sendBookingCreatedMail,
  sendBookingConfirmedMail,
  sendBookingInTransitMail,
  sendBookingDeliveredMail,
  sendBookingCancelledMail,
  sendCarrierPaymentMail,
} from "../mail/service";
import { telegramNotify } from "../telegram";

async function getEmail(userId: string): Promise<string | null> {
  const [u] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  return u?.email ?? null;
}

type BookingInfo = {
  id: string;
  customer_id: string;
  carrier_id: string;
  from_city: string | null;
  to_city: string | null;
  customer_name: string | null;
  carrier_name: string | null;
  kg_amount: string;
  total_price: string;
  payment_status: string;
  departure_date?: string;
};

export async function notifyBookingCreated(b: BookingInfo, customerId: string, carrierId: string) {
  const fc = b.from_city ?? "";
  const tc = b.to_city ?? "";
  await Promise.allSettled([
    createUserNotification({ userId: carrierId, title: "Yeni rezervasyon talebi", message: `${fc} → ${tc} ilaniniza yeni bir talep geldi.`, type: "booking_created" }),
    createUserNotification({ userId: customerId, title: "Rezervasyonunuz alindi", message: `${fc} → ${tc} icin rezervasyon talebiniz tasiyiciya iletildi.`, type: "booking_created" }),
    getEmail(customerId).then((email) => {
      if (email) return sendBookingCreatedMail({ to: email, customer_name: email.split("@")[0], from_city: fc, to_city: tc, kg_amount: b.kg_amount, total_price: b.total_price, departure_date: b.departure_date });
    }),
    telegramNotify({ event: "new_booking", data: { customer_name: b.customer_name ?? "Musteri", from_city: fc, to_city: tc, kg_amount: b.kg_amount, total_price: b.total_price, created_at: new Date().toISOString() } }),
  ]);
}

export async function notifyBookingConfirmed(b: BookingInfo) {
  const fc = b.from_city ?? "";
  const tc = b.to_city ?? "";
  await createUserNotification({ userId: b.customer_id, title: "Rezervasyonunuz onaylandi", message: "Tasiyici rezervasyonunuzu onayladi.", type: "booking_confirmed" });
  void getEmail(b.customer_id).then((email) => {
    if (email) sendBookingConfirmedMail({ to: email, customer_name: b.customer_name ?? email.split("@")[0], carrier_name: b.carrier_name ?? undefined, from_city: fc, to_city: tc, kg_amount: b.kg_amount, total_price: b.total_price });
  }).catch(() => {});
  void telegramNotify({ event: "booking_confirmed", data: { customer_name: b.customer_name ?? "", carrier_name: b.carrier_name ?? "", from_city: fc, to_city: tc, created_at: new Date().toISOString() } });
}

export async function notifyBookingInTransit(b: BookingInfo) {
  void getEmail(b.customer_id).then((email) => {
    if (email) sendBookingInTransitMail({ to: email, customer_name: b.customer_name ?? email.split("@")[0], from_city: b.from_city ?? "", to_city: b.to_city ?? "", kg_amount: b.kg_amount, total_price: b.total_price });
  }).catch(() => {});
}

export async function notifyBookingDelivered(b: BookingInfo) {
  const fc = b.from_city ?? "";
  const tc = b.to_city ?? "";
  await createUserNotification({ userId: b.customer_id, title: "Kargonuz teslim edildi", message: "Gonderiniz teslim edildi.", type: "booking_delivered" });
  void telegramNotify({ event: "booking_delivered", data: { customer_name: b.customer_name ?? "", carrier_name: b.carrier_name ?? "", from_city: fc, to_city: tc, total_price: b.total_price, created_at: new Date().toISOString() } });
  void getEmail(b.customer_id).then((email) => {
    if (email) sendBookingDeliveredMail({ to: email, customer_name: b.customer_name ?? email.split("@")[0], from_city: fc, to_city: tc, kg_amount: b.kg_amount, total_price: b.total_price });
  }).catch(() => {});
  void getEmail(b.carrier_id).then((email) => {
    if (email) sendCarrierPaymentMail({ to: email, user_name: b.carrier_name ?? email.split("@")[0], amount: b.total_price, new_balance: "" });
  }).catch(() => {});
}

export async function notifyBookingCancelled(b: BookingInfo, cancelledByUserId: string) {
  const otherId = b.customer_id === cancelledByUserId ? b.carrier_id : b.customer_id;
  await createUserNotification({ userId: otherId, title: "Rezervasyon iptal edildi", message: "Bir rezervasyon iptal edildi.", type: "booking_cancelled" });
  void getEmail(b.customer_id).then((email) => {
    if (email) sendBookingCancelledMail({ to: email, customer_name: email.split("@")[0], from_city: b.from_city ?? "", to_city: b.to_city ?? "", kg_amount: b.kg_amount, total_price: b.total_price, refunded: b.payment_status === "paid" });
  }).catch(() => {});
  void telegramNotify({ event: "booking_cancelled", data: { customer_name: b.customer_name ?? "", from_city: b.from_city ?? "", to_city: b.to_city ?? "", created_at: new Date().toISOString() } });
}
