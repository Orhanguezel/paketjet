// src/modules/wallet/paytr.ts
import crypto from "crypto";
import { env } from "@/core/env";

export interface PayTRTokenRequest {
  merchant_oid: string;
  email: string;
  payment_amount: number; // Kuruş bazında
  user_ip: string;
  user_basket: string; // [name, price, qty] şeklinde base64_encoded JSON
  user_name: string;
  user_address: string;
  user_phone: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
  merchant_notify_url: string; // PayTR callback URL (public)
  currency?: string;
  no_installment?: number;
  max_installment?: number;
}

export interface PayTRTokenResponse {
  status: "success" | "error";
  token?: string;
  reason?: string;
}

/** PayTR Token hazırlama ve iFrame URL alma */
export async function createPayTRToken(data: PayTRTokenRequest): Promise<{ token: string; iframe_url: string }> {
  const {
    PAYTR_MERCHANT_ID: merchant_id,
    PAYTR_MERCHANT_KEY: merchant_key,
    PAYTR_MERCHANT_SALT: merchant_salt,
    PAYTR_TEST_MODE,
  } = env;

  const test_mode = PAYTR_TEST_MODE ? "1" : "0";
  const debug_on = PAYTR_TEST_MODE ? 1 : 0;
  const no_installment = data.no_installment ?? 0;
  const max_installment = data.max_installment ?? 0;
  const currency = data.currency ?? "TL";

  const hash_str = merchant_id + data.user_ip + data.merchant_oid + data.email + 
                   data.payment_amount + data.user_basket + no_installment + 
                   max_installment + currency + test_mode;
  
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hash_str + merchant_salt)
    .digest("base64");

  const postData = new URLSearchParams({
    merchant_id,
    user_ip: data.user_ip,
    merchant_oid: data.merchant_oid,
    email: data.email,
    payment_amount: data.payment_amount.toString(),
    paytr_token,
    user_basket: data.user_basket,
    debug_on: debug_on.toString(),
    no_installment: no_installment.toString(),
    max_installment: max_installment.toString(),
    user_name: data.user_name,
    user_address: data.user_address,
    user_phone: data.user_phone,
    merchant_ok_url: data.merchant_ok_url,
    merchant_fail_url: data.merchant_fail_url,
    merchant_notify_url: data.merchant_notify_url,
    timeout_limit: "30",
    currency,
    test_mode,
  });

  const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: postData.toString(),
  });

  const result = (await response.json()) as PayTRTokenResponse;

  if (result.status !== "success") {
    throw new Error(result.reason || "paytr_token_failed");
  }

  return {
    token: result.token!,
    iframe_url: `https://www.paytr.com/odeme/guvenli/${result.token}`,
  };
}

/** PayTR Callback doğrulama */
export function verifyPayTRCallback(body: any): boolean {
  const { PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT } = env;
  const { merchant_oid, status, total_amount, hash } = body;

  const hash_str = merchant_oid + PAYTR_MERCHANT_SALT + status + total_amount;
  const expected_hash = crypto
    .createHmac("sha256", PAYTR_MERCHANT_KEY)
    .update(hash_str)
    .digest("base64");

  return expected_hash === hash;
}

/** Sepet verisini encode et */
export function encodePayTRBasket(items: [string, string, number][]): string {
  return Buffer.from(JSON.stringify(items)).toString("base64");
}
