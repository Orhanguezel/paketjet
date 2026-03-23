// src/modules/bookings/helpers/controller.ts
import { parsePage } from "@/modules/_shared";

export type BookingControllerStatusExtra = {
  carrier_notes?: string;
  delivered_at?: Date;
};

export function parseBookingsListParams(query: Record<string, string>) {
  const { page, limit } = parsePage(query);

  return {
    page,
    limit,
    role: query.role === "carrier" ? "carrier" : "customer",
    status: query.status,
  } as const;
}

export function createUpdateBookingStatusExtra(input: {
  status: string;
  carrier_notes?: string;
}): BookingControllerStatusExtra {
  return {
    carrier_notes: input.carrier_notes,
    delivered_at: input.status === "delivered" ? new Date() : undefined,
  };
}
