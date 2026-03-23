import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Wallet, WalletTransactionListResponse, DepositInitiateResponse } from "./wallet.type";

export const getWallet = () =>
  apiGet<Wallet>(API.wallet.get);

export const getTransactions = (page = 1, filters?: { type?: string; purpose?: string }) => {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (filters?.type) params.set("type", filters.type);
  if (filters?.purpose) params.set("purpose", filters.purpose);
  return apiGet<WalletTransactionListResponse>(`${API.wallet.transactions}?${params}`);
};

/** Ödeme başlat — PayTR veya Iyzico */
export const initiateDeposit = (amount: number, provider: "iyzico" | "paytr" = "paytr") =>
  apiPost<DepositInitiateResponse>(API.wallet.depositInitiate, { amount, provider });

/** DEV: Doğrudan bakiye yükle (sadece development) */
export const devDeposit = (amount: number, description?: string) =>
  apiPost<Wallet>("/api/wallet/deposit/dev", { amount, description });

