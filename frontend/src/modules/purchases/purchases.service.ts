import { API } from "@/config/api-endpoints";
import { apiGet, apiPost } from "@/lib/api-client";
import type {
  ContactSnapshot,
  MyCreditsResponse,
  MyPurchasesResponse,
  PurchaseIlanResponse,
} from "./purchases.type";

export function purchaseIlan(id: string) {
  return apiPost<PurchaseIlanResponse>(API.ilanlar.buy(id));
}

export async function getIlanContact(id: string) {
  const response = await apiGet<{ contact: ContactSnapshot }>(API.ilanlar.contact(id));
  return response.contact;
}

export function getMyPurchases() {
  return apiGet<MyPurchasesResponse>(API.purchases.mine);
}

export function getMyCredits() {
  return apiGet<MyCreditsResponse>(API.purchases.credits);
}

