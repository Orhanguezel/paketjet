import { apiGet, apiPost } from "@/lib/api-client";

export interface BookingMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_name: string | null;
  message: string;
  is_system: number;
  read_at: string | null;
  created_at: string;
}

export interface Dispute {
  id: string;
  booking_id: string;
  opened_by: string;
  reason: string;
  status: "open" | "under_review" | "resolved" | "closed";
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
}

export const getBookingMessages = (bookingId: string) =>
  apiGet<BookingMessage[]>(`/api/bookings/${bookingId}/messages`);

export const sendBookingMessage = (bookingId: string, message: string) =>
  apiPost<BookingMessage>(`/api/bookings/${bookingId}/messages`, { message });

export const getBookingDispute = (bookingId: string) =>
  apiGet<Dispute | null>(`/api/bookings/${bookingId}/dispute`);

export const openBookingDispute = (bookingId: string, reason: string) =>
  apiPost<Dispute>(`/api/bookings/${bookingId}/dispute`, { reason });
