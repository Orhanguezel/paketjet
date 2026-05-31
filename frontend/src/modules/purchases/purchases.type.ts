export interface ContactSnapshot {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface PurchaseIlanResponse {
  purchase_id: string;
  contact: ContactSnapshot;
  credit_balance: number;
}

export interface PurchaseDeclarationInput {
  estimated_value: number;
  estimated_value_currency?: "TRY";
  content_declared: true;
}

export interface MyPurchase {
  id: string;
  ilan_id: string;
  created_at: string;
  estimated_value?: string | null;
  contact?: ContactSnapshot | null;
  from_city?: string | null;
  to_city?: string | null;
  title?: string | null;
}

export interface MyPurchasesResponse {
  data: MyPurchase[];
}

export interface CreditLedgerItem {
  id: string;
  user_id: string;
  delta: number;
  reason: "package_purchase" | "reveal_spend" | "admin_grant" | "refund" | string;
  ref_id?: string | null;
  balance_after: number;
  created_at: string;
}

export interface MyCreditsResponse {
  balance: number;
  ledger: CreditLedgerItem[];
}

export interface CreditPackagePaymentResponse {
  provider: "iyzico" | "paytr";
  checkoutFormContent?: string;
  iframeUrl?: string;
  token?: string;
  conversationId: string;
  amount: number;
}

export type IlanPaymentResponse = CreditPackagePaymentResponse;
