// src/modules/purchases/shopier.ts
// Shopier odeme formu (api_pay4) + donus dogrulama + REST API ile sunucu tarafi teyit.
//
// GUVENLIK: Shopier donus imzasi yalniz `random_nr + platform_order_id` uzerindedir; `status`
// ve `payment_id` imzalanmaz ve donus kullanicinin tarayicisindan gelir. Imza dogru olsa bile
// donus tek basina "odendi" kaniti DEGILDIR. Odeme yalniz verifyShopierPayment() ile
// Shopier REST API'den okunan siparisle (paid + tutar + para birimi) teyit edilince tamamlanir.
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { env } from '@/core/env';

export const SHOPIER_PAY_URL = 'https://www.shopier.com/ShowProduct/api_pay4.php';
const SHOPIER_API_URL = 'https://api.shopier.com/v1';
const PRODUCT_TYPE_DOWNLOADABLE_VIRTUAL = 1;
const CURRENCY_TL = 0;
const LANGUAGE_TR = 0;

export function shopierConfigured() {
  return Boolean(env.SHOPIER_API_KEY && env.SHOPIER_API_SECRET && env.SHOPIER_PAT);
}

const sign = (data: string, secret = env.SHOPIER_API_SECRET) => createHmac('sha256', secret).update(data).digest('base64');

export type ShopierCheckoutInput = {
  orderId: string;
  amount: number;
  productName: string;
  callbackUrl: string;
  buyer: { id: string; firstName: string; lastName: string; email: string; phone?: string | null; accountAgeDays?: number };
};

/** Tarayicinin Shopier'e POST edecegi form. Kart verisi bizim sistemimize hic gelmez. */
export function buildShopierCheckout(input: ShopierCheckoutInput, secret = env.SHOPIER_API_SECRET, apiKey = env.SHOPIER_API_KEY) {
  const total = input.amount.toFixed(2);
  const randomNr = String(randomInt(100000, 1000000));
  const address = 'Dijital hizmet - teslimat yok';
  const fields: Record<string, string> = {
    API_key: apiKey,
    website_index: String(env.SHOPIER_WEBSITE_INDEX),
    platform_order_id: input.orderId,
    product_name: input.productName.slice(0, 120),
    product_type: String(PRODUCT_TYPE_DOWNLOADABLE_VIRTUAL),
    buyer_name: input.buyer.firstName,
    buyer_surname: input.buyer.lastName,
    buyer_email: input.buyer.email,
    buyer_account_age: String(Math.max(0, Math.floor(input.buyer.accountAgeDays ?? 0))),
    buyer_id_nr: input.buyer.id,
    buyer_phone: input.buyer.phone || '',
    billing_address: address,
    billing_city: 'Istanbul',
    billing_country: 'Turkey',
    billing_postcode: '34000',
    shipping_address: address,
    shipping_city: 'Istanbul',
    shipping_country: 'Turkey',
    shipping_postcode: '34000',
    total_order_value: total,
    currency: String(CURRENCY_TL),
    platform: '0',
    is_in_frame: '0',
    current_language: String(LANGUAGE_TR),
    modul_version: '1.0.4',
    random_nr: randomNr,
    callback: input.callbackUrl,
  };
  fields.signature = sign(randomNr + input.orderId + total + String(CURRENCY_TL), secret);
  return { action: SHOPIER_PAY_URL, method: 'POST' as const, fields };
}

export type ShopierCallback = { orderId: string; status: string; paymentId: string; installment: string };

/** Imzayi sabit zamanli karsilastirir. Gecerli imza yalniz "bu siparis no Shopier'den geldi" demektir. */
export function verifyShopierCallback(body: unknown, secret = env.SHOPIER_API_SECRET): ShopierCallback | null {
  if (!body || typeof body !== 'object' || !secret) return null;
  const b = body as Record<string, unknown>;
  const pick = (k: string) => (typeof b[k] === 'string' ? (b[k] as string) : '');
  const orderId = pick('platform_order_id'), randomNr = pick('random_nr'), signature = pick('signature');
  if (!orderId || !randomNr || !signature) return null;
  const expected = Buffer.from(sign(randomNr + orderId, secret), 'base64');
  const given = Buffer.from(signature, 'base64');
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return { orderId, status: pick('status').toLowerCase(), paymentId: pick('payment_id'), installment: pick('installment') };
}

export type ShopierOrderCheck =
  | { ok: true; orderId: string; total: number; currency: string }
  | { ok: false; reason: 'not_configured' | 'not_found' | 'unpaid' | 'amount_mismatch' | 'currency_mismatch' | 'email_mismatch' | 'api_error' };

/** Shopier REST API'den siparisi okuyup odemeyi teyit eder. Belirsizlikte DAIMA ok:false. */
export async function verifyShopierPayment(
  paymentId: string,
  expected: { amount: number; email?: string },
  fetcher: typeof fetch = fetch,
): Promise<ShopierOrderCheck> {
  if (!env.SHOPIER_PAT) return { ok: false, reason: 'not_configured' };
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(paymentId)) return { ok: false, reason: 'not_found' };
  let res: Response;
  try {
    res = await fetcher(`${SHOPIER_API_URL}/orders/${encodeURIComponent(paymentId)}`, {
      headers: { authorization: `Bearer ${env.SHOPIER_PAT}`, accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, reason: 'api_error' };
  }
  if (res.status === 404) return { ok: false, reason: 'not_found' };
  if (!res.ok) return { ok: false, reason: 'api_error' };
  const order = (await res.json().catch(() => null)) as {
    id?: string; paymentStatus?: string; currency?: string; totals?: { total?: string | number };
    shippingInfo?: { email?: string }; billingInfo?: { email?: string }; customer?: { email?: string };
  } | null;
  if (!order?.id) return { ok: false, reason: 'not_found' };
  if (order.paymentStatus !== 'paid') return { ok: false, reason: 'unpaid' };
  if (order.currency !== 'TRY') return { ok: false, reason: 'currency_mismatch' };
  const total = Number(order.totals?.total);
  if (!Number.isFinite(total) || Math.round(total * 100) !== Math.round(expected.amount * 100)) return { ok: false, reason: 'amount_mismatch' };
  const email = (order.customer?.email ?? order.billingInfo?.email ?? order.shippingInfo?.email ?? '').toLowerCase();
  if (expected.email && email && email !== expected.email.toLowerCase()) return { ok: false, reason: 'email_mismatch' };
  return { ok: true, orderId: order.id, total, currency: order.currency };
}
