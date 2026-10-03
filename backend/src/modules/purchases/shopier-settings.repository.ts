// src/modules/purchases/shopier-settings.repository.ts
// Shopier odeme ayarlari: site_settings'te tek, herkese KAPALI kayit (key='payment.shopier', locale='*').
// Gizli alanlar burada zaten sifreli metin olarak durur; sifreleme/cozme shopier-config.ts'te.
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { siteSettings } from '@/modules/siteSettings';

export const SHOPIER_SETTINGS_KEY = 'payment.shopier';

export type StoredShopierSettings = {
  card_enabled?: boolean;
  product_image_url?: string;
  pat_sealed?: string;
  webhook_tokens_sealed?: string;
  updated_by?: string;
  updated_at?: string;
};

export async function repoGetShopierSettings(): Promise<StoredShopierSettings> {
  const [row] = await db.select().from(siteSettings).where(and(eq(siteSettings.key, SHOPIER_SETTINGS_KEY), eq(siteSettings.locale, '*'))).limit(1);
  if (!row?.value) return {};
  try {
    const parsed = JSON.parse(row.value) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as StoredShopierSettings) : {};
  } catch {
    return {};
  }
}

export async function repoSaveShopierSettings(next: StoredShopierSettings) {
  const value = JSON.stringify(next);
  const [row] = await db.select({ id: siteSettings.id }).from(siteSettings).where(and(eq(siteSettings.key, SHOPIER_SETTINGS_KEY), eq(siteSettings.locale, '*'))).limit(1);
  if (row) await db.update(siteSettings).set({ value, updated_at: new Date() }).where(eq(siteSettings.id, row.id));
  else await db.insert(siteSettings).values({ id: randomUUID(), key: SHOPIER_SETTINGS_KEY, locale: '*', value });
}
