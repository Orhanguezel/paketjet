import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Wallet, WalletTransactionListResponse, } from "./wallet.type";

export const getWallet = () =>
  apiGet<Wallet>(API.wallet.get);

export const getTransactions = (page = 1, filters?: { type?: string; purpose?: string }) => {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (filters?.type) params.set("type", filters.type);
  if (filters?.purpose) params.set("purpose", filters.purpose);
  return apiGet<WalletTransactionListResponse>(`${API.wallet.transactions}?${params}`);
};

/** DEV: Doğrudan ilan hakkı ekle (sadece development) */
export const devDeposit = (amount: number, description?: string) =>
  apiPost<Wallet>("/api/wallet/deposit/dev", { amount, description });
