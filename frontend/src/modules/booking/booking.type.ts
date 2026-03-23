export type BookingStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled" | "disputed";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded" | "awaiting_transfer" | "failed";
export type PaymentMethod = "wallet" | "card" | "transfer" | "paytr";

export interface Booking {
  id: string;
  ilan_id: string;
  customer_id: string;
  carrier_id: string;
  kg_amount: string;
  total_price: string;
  currency: string;
  pickup_address?: string | null;
  delivery_address?: string | null;
  customer_notes?: string | null;
  carrier_notes?: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod | null;
  payment_ref?: string | null;
  commission_rate?: string;
  commission_amount?: string;
  confirmed_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  from_city?: string;
  to_city?: string;
  carrier_name?: string;
  customer_name?: string;
  // Card payment extras
  requires_payment?: boolean;
  // Transfer extras
  bank_details?: BankDetails | null;
}

export interface BookingListResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookingInput {
  ilan_id: string;
  kg_amount: number;
  pickup_address?: string;
  delivery_address?: string;
  customer_notes?: string;
  payment_method?: PaymentMethod;
}

export interface BookingPaymentInitResponse {
  provider: "iyzico" | "paytr";
  checkoutFormContent?: string;
  iframeUrl?: string;
  token?: string;
  conversationId: string;
  successUrl: string;
  failUrl: string;
}

export interface BankDetails {
  iban: string;
  account_name: string;
  bank_name: string;
  description: string;
}
