export interface WithdrawalRequest {
  id: string;
  user_id: string;
  bank_account_id: string;
  amount: string;
  currency: string;
  status: "pending" | "processing" | "completed" | "rejected";
  admin_notes: string | null;
  requested_at: string;
  processed_at: string | null;
  // Admin list join fields
  user_name?: string | null;
  user_email?: string | null;
  iban?: string | null;
  account_holder?: string | null;
  bank_name?: string | null;
}

export interface WithdrawalListResponse {
  data: WithdrawalRequest[];
  total: number;
  page: number;
  limit: number;
}
