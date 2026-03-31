// src/modules/wallet/iyzico.ts
// İyzico Checkout Form entegrasyonu — resmi iyzipay SDK kullanır.
// Marketplace modu destekler (subMerchantKey/subMerchantPrice).

import Iyzipay from "iyzipay";
import { env } from "@/core/env";

// ── Singleton İyzipay instance ──────────────────────────────────────────────

let _instance: Iyzipay | null = null;

function getIyzipay(): Iyzipay {
  if (!_instance) {
    _instance = new Iyzipay({
      apiKey: env.IYZICO_API_KEY,
      secretKey: env.IYZICO_SECRET_KEY,
      uri: env.IYZICO_BASE_URL,
    });
  }
  return _instance;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;
  registrationAddress: string;
  city: string;
  country: string;
  ip?: string;
}

export interface IyzicoAddress {
  contactName: string;
  city: string;
  country: string;
  address: string;
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  itemType: "VIRTUAL" | "PHYSICAL";
  price: string;
  subMerchantKey?: string;
  subMerchantPrice?: string;
}

export interface CheckoutFormInitRequest {
  locale: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  enabledInstallments: number[];
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
}

export interface CheckoutFormInitResponse {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  conversationId?: string;
  token?: string;
  tokenExpireTime?: number;
  checkoutFormContent?: string;
}

export interface CheckoutFormDetailResponse {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  paymentId?: string;
  paymentStatus?: string;
  price?: string;
  paidPrice?: string;
  currency?: string;
  basketId?: string;
  conversationId?: string;
  fraudStatus?: number;
}

// ── Public API ────────────────────────────────────────────────────────────────

function promisify<T>(fn: (req: unknown, cb: (err: Error | null, result: T) => void) => void, req: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    fn(req, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export async function createCheckoutForm(req: CheckoutFormInitRequest): Promise<CheckoutFormInitResponse> {
  const iyzipay = getIyzipay();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return promisify<CheckoutFormInitResponse>(
    (iyzipay.checkoutFormInitialize as any).create.bind(iyzipay.checkoutFormInitialize),
    req,
  );
}

export async function retrieveCheckoutForm(token: string, conversationId: string): Promise<CheckoutFormDetailResponse> {
  const iyzipay = getIyzipay();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return promisify<CheckoutFormDetailResponse>(
    (iyzipay.checkoutFormInitialize as any).retrieve.bind(iyzipay.checkoutFormInitialize),
    { locale: "tr", conversationId, token },
  );
}

// ── Sub-Merchant (Alt Üye İşyeri) ───────────────────────────────────────────

export interface SubMerchantCreateRequest {
  locale?: string;
  conversationId?: string;
  subMerchantExternalId: string;
  subMerchantType: "PERSONAL" | "PRIVATE_COMPANY" | "LIMITED_OR_JOINT_STOCK_COMPANY";
  address: string;
  contactName: string;
  contactSurname: string;
  email: string;
  gsmNumber: string;
  name: string;
  iban: string;
  identityNumber: string;
  taxOffice?: string;
  legalCompanyTitle?: string;
  taxNumber?: string;
  currency?: string;
}

export interface SubMerchantResponse {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  subMerchantKey?: string;
  conversationId?: string;
}

export async function createSubMerchant(data: SubMerchantCreateRequest): Promise<SubMerchantResponse> {
  const iyzipay = getIyzipay();
  return promisify<SubMerchantResponse>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (iyzipay as any).subMerchant.create.bind((iyzipay as any).subMerchant),
    { locale: data.locale ?? "tr", conversationId: data.conversationId ?? data.subMerchantExternalId, ...data },
  );
}

export async function updateSubMerchant(data: SubMerchantCreateRequest & { subMerchantKey: string }): Promise<SubMerchantResponse> {
  const iyzipay = getIyzipay();
  return promisify<SubMerchantResponse>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (iyzipay as any).subMerchant.update.bind((iyzipay as any).subMerchant),
    { locale: data.locale ?? "tr", conversationId: data.conversationId ?? data.subMerchantExternalId, ...data },
  );
}

export async function retrieveSubMerchant(subMerchantExternalId: string): Promise<SubMerchantResponse> {
  const iyzipay = getIyzipay();
  return promisify<SubMerchantResponse>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (iyzipay as any).subMerchant.retrieve.bind((iyzipay as any).subMerchant),
    { locale: "tr", conversationId: subMerchantExternalId, subMerchantExternalId },
  );
}
