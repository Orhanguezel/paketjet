// src/modules/bookings/helpers/repository.ts
import type { NewBooking } from "../schema";
import { bookings } from "../schema";

export type BookingStatusExtra = {
  carrier_notes?: string;
  confirmed_at?: Date;
  delivered_at?: Date;
  cancelled_at?: Date;
};

export function mapBookingRow(row: {
  booking: typeof bookings.$inferSelect;
  from_city: string | null;
  to_city: string | null;
  customer_name: string | null;
  carrier_name: string | null;
}) {
  return {
    ...row.booking,
    from_city: row.from_city,
    to_city: row.to_city,
    customer_name: row.customer_name,
    carrier_name: row.carrier_name,
  };
}

export function buildCreateBookingInsert(data: {
  id: string;
  ilanId: string;
  customerId: string;
  carrierId: string;
  kgAmount: number;
  totalPrice: number;
  currency: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  customerNotes?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentRef?: string;
}): NewBooking {
  return {
    id: data.id,
    ilan_id: data.ilanId,
    customer_id: data.customerId,
    carrier_id: data.carrierId,
    kg_amount: String(data.kgAmount),
    total_price: String(data.totalPrice),
    currency: data.currency,
    pickup_address: data.pickupAddress ?? null,
    delivery_address: data.deliveryAddress ?? null,
    customer_notes: data.customerNotes ?? null,
    payment_method: data.paymentMethod ?? "wallet",
    payment_ref: data.paymentRef ?? null,
    status: "pending",
    payment_status: data.paymentStatus ?? "unpaid",
  };
}

export function buildBookingStatusPatch(status: string, extra?: BookingStatusExtra): Partial<typeof bookings.$inferInsert> {
  const set: Partial<typeof bookings.$inferInsert> = { status };

  if (extra?.carrier_notes !== undefined) set.carrier_notes = extra.carrier_notes;
  if (extra?.confirmed_at) set.confirmed_at = extra.confirmed_at;
  if (extra?.delivered_at) set.delivered_at = extra.delivered_at;
  if (extra?.cancelled_at) set.cancelled_at = extra.cancelled_at;

  return set;
}
