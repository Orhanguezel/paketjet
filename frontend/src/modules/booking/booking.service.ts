import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Booking, BookingListResponse, CreateBookingInput, BookingPaymentInitResponse, BankDetails } from "./booking.type";

export const createBooking = (input: CreateBookingInput) =>
  apiPost<Booking>(API.bookings.list, input);

export const getMyBookings = (page = 1) =>
  apiGet<BookingListResponse>(`${API.bookings.list}?role=customer&page=${page}&limit=20`);

export const getCarrierBookings = (status?: string, page = 1) => {
  const params = new URLSearchParams({ role: "carrier", page: String(page), limit: "20" });
  if (status) params.set("status", status);
  return apiGet<BookingListResponse>(`${API.bookings.list}?${params.toString()}`);
};

export const getBooking = (id: string) =>
  apiGet<Booking>(API.bookings.detail(id));

export const confirmBooking = (id: string) =>
  apiPatch<Booking>(API.bookings.confirm(id), {});

export const updateBookingStatus = (id: string, status: string, carrier_notes?: string) =>
  apiPatch<Booking>(API.bookings.status(id), { status, carrier_notes });

export const cancelBooking = (id: string, reason?: string) =>
  apiPatch<Booking>(API.bookings.cancel(id), { reason: reason ?? "" });

export const initiateBookingPayment = (bookingId: string) =>
  apiPost<BookingPaymentInitResponse>(API.bookings.payInitiate(bookingId), {});

export const getBankDetails = () =>
  apiGet<BankDetails>(API.bookings.bankDetails);
