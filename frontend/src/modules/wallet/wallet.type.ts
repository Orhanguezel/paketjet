export type TransactionType = "credit" | "debit";
export type TransactionPurpose = "deposit" | "booking_payment" | "booking_earning" | "booking_refund" | "withdrawal" | "withdrawal_refund";

export interface Wallet {
  id: string;
  user_id: string;
  balance: string;
  credit_balance?: number;
  remaining_rights?: number;
  unit?: "hak";
  model?: "listing_credit";
  total_earnings: string;
  total_withdrawn: string;
  currency: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: string;
  amount_rights?: number;
  unit?: "hak";
  purpose_label?: string;
  purpose: TransactionPurpose;
  description?: string | null;
  reference_id?: string | null;
  payment_status?: string;
  created_at: string;
}

export interface WalletTransactionListResponse {
  data: WalletTransaction[];
  total: number;
  page: number;
}

export interface DepositInitiateResponse {
  provider: "iyzico" | "paytr";
  checkoutFormContent?: string;
  iframeUrl?: string;
  token?: string;
  conversationId: string;
  amount: number;
  successUrl: string;
  failUrl: string;
}
