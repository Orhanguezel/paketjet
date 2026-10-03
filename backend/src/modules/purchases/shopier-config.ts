// src/modules/purchases/shopier-config.ts
// Shopier calisma ayarlari: once admin panelinde kaydedilen (DB, sifreli), yoksa sunucu ortam degiskeni.
// 30 sn bellek onbellegi; admin kaydi onbellegi bosaltir. Gizli degerler bu dosyadan disari DTO olarak cikmaz.
import { env } from '@/core/env';
import { openSecret, sealSecret } from '@/modules/_shared';
import { repoGetShopierSettings, repoSaveShopierSettings, type StoredShopierSettings } from './shopier-settings.repository';

export type Source = 'panel' | 'server' | null;
export type ShopierConfig = {
  pat: string;
  webhookTokens: string[];
  productImageUrl: string;
  cardEnabled: boolean;
  configured: boolean;
  source: { pat: Source; webhook: Source; image: Source; cardEnabled: 'panel' | 'server' };
};

const TTL_MS = 30_000;
let cache: { at: number; value: ShopierConfig } | null = null;

const splitTokens = (raw: string) => raw.split(',').map((t) => t.trim()).filter(Boolean);
function open(sealed?: string) {
  if (!sealed) return '';
  try {
    return openSecret(sealed, env.SETTINGS_ENCRYPTION_KEY);
  } catch {
    return ''; // anahtar degismis/bozuk kayit: guvenli tarafta kal, sunucu ayarina dus
  }
}

export function buildShopierConfig(stored: StoredShopierSettings): ShopierConfig {
  const panelPat = open(stored.pat_sealed);
  const panelTokens = splitTokens(open(stored.webhook_tokens_sealed));
  const pat = panelPat || env.SHOPIER_PAT;
  const webhookTokens = panelTokens.length ? panelTokens : splitTokens(env.SHOPIER_WEBHOOK_TOKEN);
  const productImageUrl = stored.product_image_url || env.SHOPIER_PRODUCT_IMAGE_URL;
  const configured = Boolean(pat && webhookTokens.length && productImageUrl);
  const cardEnabled = typeof stored.card_enabled === 'boolean' ? stored.card_enabled : process.env.PAYMENT_PROVIDER === 'shopier';
  return {
    pat,
    webhookTokens,
    productImageUrl,
    cardEnabled,
    configured,
    source: {
      pat: panelPat ? 'panel' : env.SHOPIER_PAT ? 'server' : null,
      webhook: panelTokens.length ? 'panel' : env.SHOPIER_WEBHOOK_TOKEN ? 'server' : null,
      image: stored.product_image_url ? 'panel' : env.SHOPIER_PRODUCT_IMAGE_URL ? 'server' : null,
      cardEnabled: typeof stored.card_enabled === 'boolean' ? 'panel' : 'server',
    },
  };
}

export async function getShopierConfig(): Promise<ShopierConfig> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  const value = buildShopierConfig(await repoGetShopierSettings());
  cache = { at: Date.now(), value };
  return value;
}

export function invalidateShopierConfig() {
  cache = null;
}

export type ShopierSettingsPatch = { cardEnabled?: boolean; productImageUrl?: string | null; pat?: string | null; webhookTokens?: string[] | null };

/** null → panel degerini sil (sunucu ayarina don); undefined → dokunma. */
export async function saveShopierSettings(patch: ShopierSettingsPatch, actorId: string) {
  const current = await repoGetShopierSettings();
  const next: StoredShopierSettings = { ...current };
  if (patch.cardEnabled !== undefined) next.card_enabled = patch.cardEnabled;
  if (patch.productImageUrl !== undefined) next.product_image_url = patch.productImageUrl || undefined;
  if (patch.pat !== undefined) next.pat_sealed = patch.pat ? sealSecret(patch.pat, env.SETTINGS_ENCRYPTION_KEY) : undefined;
  if (patch.webhookTokens !== undefined) next.webhook_tokens_sealed = patch.webhookTokens?.length ? sealSecret(patch.webhookTokens.join(','), env.SETTINGS_ENCRYPTION_KEY) : undefined;
  next.updated_by = actorId;
  next.updated_at = new Date().toISOString();
  await repoSaveShopierSettings(next);
  invalidateShopierConfig();
  return getShopierConfig();
}
