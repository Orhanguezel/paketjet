import { API } from "@/config/api-endpoints";
import { apiGet, apiPost } from "@/lib/api-client";
import type {
  ContactSnapshot,
  CreditPackagePaymentResponse,
  IlanPaymentResponse,
  MyCreditsResponse,
  MyPurchasesResponse,
  PurchaseDeclarationInput,
  PurchaseIlanResponse,
} from "./purchases.type";

export function purchaseIlan(id: string, declaration: PurchaseDeclarationInput) {
  return apiPost<PurchaseIlanResponse>(API.ilanlar.buy(id), declaration);
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

export function purchaseCreditPackage(packageKey: string, provider: "iyzico" | "paytr" = "paytr") {
  return apiPost<CreditPackagePaymentResponse>(API.purchases.buyCredits, { package_key: packageKey, provider });
}

export function initiateIlanPayment(id: string, declaration: PurchaseDeclarationInput, provider: "iyzico" | "paytr" = "paytr") {
  return apiPost<IlanPaymentResponse>(API.ilanlar.pay(id), { ...declaration, provider });
}
