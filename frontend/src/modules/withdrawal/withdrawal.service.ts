import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { WithdrawalRequest, WithdrawalListResponse } from "./withdrawal.type";

export const createWithdrawal = (amount: number) =>
  apiPost<WithdrawalRequest>(API.withdrawal.create, { amount });

export const getMyWithdrawals = (page = 1) =>
  apiGet<WithdrawalListResponse>(`${API.withdrawal.my}?page=${page}&limit=20`);
