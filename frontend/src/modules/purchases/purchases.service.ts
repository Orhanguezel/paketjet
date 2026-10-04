import { API } from "@/config/api-endpoints";
import { apiGet, apiPost } from "@/lib/api-client";
import type { BankOrder } from '@/modules/payments/payments.type';
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

export function purchaseCreditPackage(packageKey: string) {
  return apiPost<CreditPackagePaymentResponse>(API.purchases.buyCredits, { package_key: packageKey, terms_accepted: true });
}
export function createBankCreditOrder(packageKey:string) {
  return apiPost<BankOrder>(API.purchases.bankBuyCredits, {package_key:packageKey,terms_accepted:true});
}
export function createBankListingOrder(id:string,declaration:PurchaseDeclarationInput) {
  return apiPost<BankOrder>(API.ilanlar.bankPay(id),declaration);
}

export function initiateIlanPayment(id: string, declaration: PurchaseDeclarationInput) {
  return apiPost<IlanPaymentResponse>(API.ilanlar.pay(id), declaration);
}

export type ListingAccess = {is_owner:boolean;contact:import('./purchases.type').ContactSnapshot|null;balance:number;state:'purchased'|'owner'|'unavailable'|'credit'|'card'};
export const getListingAccess = (id:string) => apiGet<ListingAccess>(API.ilanlar.access(id),{cache:'no-store'});
