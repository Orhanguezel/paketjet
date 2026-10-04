// src/modules/purchases/shopier.ts
// Shopier REST API (api.shopier.com/v1) istemcisi. HTTP katmani yok, DB yok.
//
// Akis: her odeme icin Shopier'de tek kullanimlik, vitrinde gorunmeyen (customListing) dijital urun
// olusturulur; alici urunun Shopier sayfasinda oder. Odeme, `order.created` webhook'u veya kullanicinin
// "kontrol et" istegiyle siparis API'den OKUNARAK dogrulanir. Webhook govdesi tek basina kanit sayilmaz.
import { createHmac, timingSafeEqual } from 'crypto';
import { getShopierConfig } from './shopier-config';
import { waitForShopierMedia } from './shopier-media';

const API = 'https://api.shopier.com/v1';
const TIMEOUT_MS = 8_000;


export class ShopierApiError extends Error {
  constructor(public status: number, public code: string) {
    super(`shopier_api_${status}_${code}`);
  }
}

async function call<T>(method: string, path: string, body?: unknown, fetcher: typeof fetch = fetch, pat?: string): Promise<T> {
  const token = pat ?? (await getShopierConfig()).pat;
  if (!token) throw new ShopierApiError(503, 'not_configured');
  const res = await fetcher(`${API}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) throw new ShopierApiError(res.status, String((json as { error?: string } | null)?.error ?? 'error'));
  return json as T;
}

export type ShopierProduct = { id: string; url: string };

/** Odeme basina tek kullanimlik urun. Stok 1: ayni urun ikinci kez satilamaz. */
export async function createShopierCheckout(input: { title: string; description: string; amount: number }, fetcher?: typeof fetch) {
  const { productImageUrl } = await getShopierConfig();
  const product = await call<{ id?: string; url?: string; media?: { url?: string }[] }>('POST', '/products', {
    title: input.title.slice(0, 120),
    description: input.description,
    type: 'digital',
    media: [{ type: 'image', url: productImageUrl, placement: 1 }],
    priceData: { currency: 'TRY', price: input.amount.toFixed(2) },
    stockQuantity: 1,
    shippingPayer: 'sellerPays',
    customListing: true,
  }, fetcher);
  if (!product?.id || !product.url || !/^https:\/\/(www\.)?shopier\.com\//.test(product.url)) throw new ShopierApiError(502, 'invalid_product_response');
  if (!product.media?.[0]?.url || !(await waitForShopierMedia(product.media[0].url, fetcher))) {
    await deleteShopierCheckout(String(product.id), fetcher).catch(() => undefined);
    throw new ShopierApiError(502, 'product_image_unavailable');
  }
  return { id: String(product.id), url: product.url } satisfies ShopierProduct;
}

export async function deleteShopierCheckout(productId: string, fetcher?: typeof fetch) {
  try {
    await call('DELETE', `/products/${encodeURIComponent(productId)}`, undefined, fetcher);
  } catch (e) {
    if (!(e instanceof ShopierApiError && e.status === 404)) throw e;
  }
}

export type ShopierOrder = {
  id: string;
  paymentStatus?: string;
  currency?: string;
  totals?: { total?: string | number };
  lineItems?: { productId?: string | number; quantity?: number; total?: string | number }[];
};

export const getShopierOrder = (orderId: string, fetcher?: typeof fetch) =>
  call<ShopierOrder>('GET', `/orders/${encodeURIComponent(orderId)}`, undefined, fetcher);

export const findShopierOrdersForProduct = (productId: string, fetcher?: typeof fetch) =>
  call<ShopierOrder[]>('GET', `/orders?productId=${encodeURIComponent(productId)}&limit=10`, undefined, fetcher);

export type ShopierCheck = { ok: true; orderId: string; amount: number } | { ok: false; reason: 'unpaid' | 'currency' | 'amount' | 'product' | 'quantity' };

/** Siparis, beklenen urun ve tutarla birebir ortusuyor mu? Saf fonksiyon. */
export function checkShopierOrder(order: ShopierOrder, expected: { productId: string; amount: number }): ShopierCheck {
  const cents = (v: unknown) => Math.round(Number(v) * 100);
  if (order.paymentStatus !== 'paid') return { ok: false, reason: 'unpaid' };
  if (order.currency !== 'TRY') return { ok: false, reason: 'currency' };
  const items = order.lineItems ?? [];
  if (items.length !== 1 || String(items[0]?.productId) !== expected.productId) return { ok: false, reason: 'product' };
  if (Number(items[0]?.quantity ?? 1) !== 1) return { ok: false, reason: 'quantity' };
  const want = Math.round(expected.amount * 100);
  if (cents(order.totals?.total) !== want || cents(items[0]?.total) !== want) return { ok: false, reason: 'amount' };
  return { ok: true, orderId: String(order.id), amount: expected.amount };
}

/** Shopier-Signature: ham govdenin webhook token'iyla HMAC-SHA256'si (hex veya base64). Her abonelik kendi token'ini kullanir. */
export function verifyShopierSignature(raw: Buffer | string, signature: string | undefined, tokens: string | string[]) {
  const list = (Array.isArray(tokens) ? tokens : tokens.split(',')).map((t) => t.trim()).filter(Boolean);
  if (!signature || !list.length) return false;
  const given = signature.trim();
  const value = Buffer.from(/^[0-9a-f]+$/i.test(given) ? given.toLowerCase() : given);
  return list.some((token) => {
    const sum = createHmac('sha256', token).update(raw).digest();
    return [Buffer.from(sum.toString('hex')), Buffer.from(sum.toString('base64'))].some((c) => c.length === value.length && timingSafeEqual(c, value));
  });
}

/** order.created govdesinden yalniz aday urun kimliklerini cikarir; karar API okumasiyla verilir. */
export function productIdsFromOrderEvent(payload: unknown): { orderId: string; productIds: string[] } | null {
  const order = (payload && typeof payload === 'object' && 'data' in payload ? (payload as { data: unknown }).data : payload) as ShopierOrder | null;
  if (!order?.id) return null;
  return { orderId: String(order.id), productIds: (order.lineItems ?? []).map((i) => String(i.productId ?? '')).filter(Boolean) };
}

export type ShopierRefund = { id: string; status?: 'pending' | 'failed' | 'succeeded' | string; orderId?: string; type?: string; total?: string | number; currency?: string };

/** Tam veya kismi iade. Kart iadesi Shopier tarafinda yurur; sonuc refund.updated ile gelir. */
export async function createShopierRefund(input: { orderId: string; amount: number; note?: string }, fetcher?: typeof fetch) {
  const refund = await call<ShopierRefund>('POST', '/refunds', { orderId: input.orderId, amount: input.amount.toFixed(2), ...(input.note ? { note: input.note.slice(0, 250) } : {}) }, fetcher);
  if (!refund?.id) throw new ShopierApiError(502, 'invalid_refund_response');
  return { ...refund, id: String(refund.id) };
}

export const getShopierRefund = (refundId: string, fetcher?: typeof fetch) =>
  call<ShopierRefund>('GET', `/refunds/${encodeURIComponent(refundId)}`, undefined, fetcher);

/** refund.* govdesinden yalniz iade kimligi; karar API okumasiyla verilir. */
export function refundIdFromEvent(payload: unknown): string | null {
  const r = (payload && typeof payload === 'object' && 'data' in payload ? (payload as { data: unknown }).data : payload) as { id?: unknown } | null;
  return r?.id ? String(r.id) : null;
}

export const SHOPIER_WEBHOOK_EVENTS = ['order.created', 'refund.requested', 'refund.updated'] as const;
export type ShopierWebhook = { id: string; event: string; url: string; token?: string };

export const listShopierWebhooks = (pat?: string) => call<ShopierWebhook[]>('GET', '/webhooks?limit=50', undefined, fetch, pat);
export const createShopierWebhook = (event: string, url: string, pat?: string) => call<ShopierWebhook>('POST', '/webhooks', { event, url }, fetch, pat);

/** Anahtari kaydetmeden ONCE dogrulamak icin: siparis okuma + magaza ayari. */
export async function probeShopier(pat?: string) {
  await call<unknown[]>('GET', '/orders?limit=1', undefined, fetch, pat);
  const shop = await call<{ name?: string; url?: string; title?: string }>('GET', '/shop/settings', undefined, fetch, pat);
  return { shopName: shop.title || shop.name || '', shopUrl: shop.url || '' };
}
export const deleteShopierWebhook = (id: string, pat?: string) => call<unknown>('DELETE', `/webhooks/${encodeURIComponent(id)}`, undefined, fetch, pat);
