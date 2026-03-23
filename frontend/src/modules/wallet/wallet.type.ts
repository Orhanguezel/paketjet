export type TransactionType = "credit" | "debit";
export type TransactionPurpose = "deposit" | "booking_payment" | "booking_earning" | "booking_refund" | "withdrawal" | "withdrawal_refund";

export interface Wallet {
  id: string;
  user_id: string;
  balance: string;
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
