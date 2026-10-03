// src/modules/purchases/shopier-admin.service.ts
// Admin panelindeki Shopier ayarlari: durum (gizli deger icermez), anahtar dogrulama, webhook kurulumu.
import { env } from '@/core/env';
import { getShopierConfig, saveShopierSettings, type ShopierConfig } from './shopier-config';
import { repoGetShopierSettings } from './shopier-settings.repository';
import { SHOPIER_WEBHOOK_EVENTS, ShopierApiError, createShopierWebhook, deleteShopierWebhook, listShopierWebhooks, probeShopier } from './shopier';

export const shopierWebhookUrl = () => `${env.PUBLIC_URL.replace(/\/$/, '')}/api/payments/shopier/webhook`;

function patInfo(pat: string) {
  if (!pat) return { set: false as const };
  try {
    const claims = JSON.parse(Buffer.from(pat.split('.')[1] ?? '', 'base64url').toString('utf8')) as { exp?: number; scopes?: string[] };
    return { set: true as const, last4: pat.slice(-4), expires_at: claims.exp ? new Date(claims.exp * 1000).toISOString() : null, scopes: Array.isArray(claims.scopes) ? claims.scopes : [] };
  } catch {
    return { set: true as const, last4: pat.slice(-4), expires_at: null, scopes: [] as string[] };
  }
}

/** Panelde gosterilecek durum. Anahtar ve imza token'lari ASLA donmez. */
export async function shopierStatus(config?: ShopierConfig) {
  const c = config ?? (await getShopierConfig());
  const stored = await repoGetShopierSettings();
  return {
    card_enabled: c.cardEnabled,
    card_enabled_source: c.source.cardEnabled,
    configured: c.configured,
    available: c.cardEnabled && c.configured,
    pat: { ...patInfo(c.pat), source: c.source.pat },
    webhook: { count: c.webhookTokens.length, expected: SHOPIER_WEBHOOK_EVENTS.length, source: c.source.webhook, url: shopierWebhookUrl() },
    product_image: { url: c.productImageUrl || null, source: c.source.image },
    updated_at: stored.updated_at ?? null,
  };
}

export type ShopierSettingsInput = { card_enabled?: boolean; product_image_url?: string | null; pat?: string | null };

export async function updateShopierSettings(input: ShopierSettingsInput, actorId: string) {
  if (input.pat) {
    try {
      await probeShopier(input.pat);
    } catch (e) {
      throw Object.assign(new Error(e instanceof ShopierApiError && e.status === 401 ? 'shopier_pat_rejected' : 'shopier_pat_unverified'), { statusCode: 400 });
    }
  }
  const config = await saveShopierSettings({ cardEnabled: input.card_enabled, productImageUrl: input.product_image_url, pat: input.pat }, actorId);
  return shopierStatus(config);
}

/** Baglanti testi: anahtar gecerli mi, magaza hangisi, webhook'lar bu siteye kurulu mu. */
export async function testShopierConnection() {
  const config = await getShopierConfig();
  if (!config.pat) return { ok: false as const, error: 'not_configured' };
  try {
    const shop = await probeShopier();
    const url = shopierWebhookUrl();
    const hooks = await listShopierWebhooks();
    const ours = hooks.filter((h) => h.url === url);
    const missing = SHOPIER_WEBHOOK_EVENTS.filter((ev) => !ours.some((h) => h.event === ev));
    return {
      ok: true as const,
      shop_name: shop.shopName,
      shop_url: shop.shopUrl,
      webhooks: hooks.map((h) => ({ event: h.event, url: h.url, ours: h.url === url })),
      missing_events: missing,
      signing_ready: missing.length === 0 && config.webhookTokens.length >= SHOPIER_WEBHOOK_EVENTS.length,
    };
  } catch (e) {
    return { ok: false as const, error: e instanceof ShopierApiError ? `shopier_${e.status}` : 'shopier_unreachable' };
  }
}

/** Shopier liste yaniti imza token'ini vermez: bu siteye ait abonelikler silinip yeniden kurulur, token'lar sifreli kaydedilir. */
export async function rebuildShopierWebhooks(actorId: string) {
  const url = shopierWebhookUrl();
  const existing = (await listShopierWebhooks()).filter((h) => h.url === url);
  for (const hook of existing) await deleteShopierWebhook(hook.id);
  const tokens: string[] = [];
  for (const event of SHOPIER_WEBHOOK_EVENTS) {
    const created = await createShopierWebhook(event, url);
    if (!created.token) throw Object.assign(new Error('shopier_webhook_token_missing'), { statusCode: 502 });
    tokens.push(created.token);
  }
  return shopierStatus(await saveShopierSettings({ webhookTokens: tokens }, actorId));
}
