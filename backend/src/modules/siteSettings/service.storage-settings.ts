import { env } from '@/core/env';
import {
  GLOBAL_LOCALE,
  PREFERRED_FALLBACK_LOCALE,
  buildLocaleCandidates,
  cloneDefaultAppLocales,
  getFirstNonEmptySetting,
  getGlobalSettingValue,
  loadSettingsMap,
  normalizeLooseLocale,
  normalizeSettingBool,
  normalizeSettingString,
  parseAppLocalesValueToMeta,
  parseSiteMediaUrl,
  uniqLocales,
  GOOGLE_KEYS,
  SITE_MEDIA_KEYS,
  STORAGE_KEYS,
  TELEGRAM_KEYS,
  type AppLocaleMeta,
  type SiteMediaKey,
} from './helpers';
import {buildLocaleFallbackChain} from './service.app-locales-meta';
import {type StorageSettings,toDriver,type GoogleSettings,type CookieConsentConfig,defaultCookieConsentConfig,envFallbacks} from './service.shared';
export async function getStorageSettings(locale?: string | null): Promise<StorageSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const map = await loadSettingsMap({ keys: STORAGE_KEYS, localeCandidates });

  const driver = toDriver(map.get('storage_driver'));

  const localRoot =
    normalizeSettingString(map.get('storage_local_root')) ?? normalizeSettingString(env.LOCAL_STORAGE_ROOT) ?? null;

  const localBaseUrl =
    normalizeSettingString(map.get('storage_local_base_url')) ??
    normalizeSettingString(env.LOCAL_STORAGE_BASE_URL) ??
    null;

  const cdnPublicBase =
    normalizeSettingString(map.get('storage_cdn_public_base')) ??
    normalizeSettingString(env.STORAGE_CDN_PUBLIC_BASE) ??
    normalizeSettingString(env.CDN_PUBLIC_BASE) ??
    null;

  const publicApiBase =
    normalizeSettingString(map.get('storage_public_api_base')) ??
    normalizeSettingString(env.STORAGE_PUBLIC_API_BASE) ??
    normalizeSettingString(env.PUBLIC_API_BASE) ??
    null;

  const cloudName =
    normalizeSettingString(map.get('cloudinary_cloud_name')) ??
    normalizeSettingString(env.CLOUDINARY_CLOUD_NAME) ??
    normalizeSettingString(env.CLOUDINARY?.cloudName) ??
    null;

  const apiKey =
    normalizeSettingString(map.get('cloudinary_api_key')) ??
    normalizeSettingString(env.CLOUDINARY_API_KEY) ??
    normalizeSettingString(env.CLOUDINARY?.apiKey) ??
    null;

  const apiSecret =
    normalizeSettingString(map.get('cloudinary_api_secret')) ??
    normalizeSettingString(env.CLOUDINARY_API_SECRET) ??
    normalizeSettingString(env.CLOUDINARY?.apiSecret) ??
    null;

  const folder =
    normalizeSettingString(map.get('cloudinary_folder')) ??
    normalizeSettingString(env.CLOUDINARY_FOLDER) ??
    normalizeSettingString(env.CLOUDINARY?.folder) ??
    null;

  // ✅ DB key map: cloudinary_unsigned_preset
  const unsignedUploadPreset =
    normalizeSettingString(map.get('cloudinary_unsigned_preset')) ??
    // ENV fallback'leri (isim değiştirmeden ALIAS)
    normalizeSettingString(envFallbacks.CLOUDINARY_UNSIGNED_UPLOAD_PRESET) ??
    normalizeSettingString(envFallbacks.CLOUDINARY_UNSIGNED_PRESET) ??
    normalizeSettingString(envFallbacks.CLOUDINARY?.unsignedUploadPreset) ??
    normalizeSettingString(envFallbacks.CLOUDINARY?.uploadPreset) ??
    null;

  return {
    driver,
    localRoot,
    localBaseUrl,
    cloudName,
    apiKey,
    apiSecret,
    folder,
    unsignedUploadPreset,
    cdnPublicBase,
    publicApiBase,
  };
}
export async function getGoogleSettings(locale?: string | null): Promise<GoogleSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const map = await loadSettingsMap({ keys: GOOGLE_KEYS, localeCandidates });

  const clientId =
    normalizeSettingString(map.get('google_client_id')) ?? normalizeSettingString(env.GOOGLE_CLIENT_ID) ?? null;

  const clientSecret =
    normalizeSettingString(map.get('google_client_secret')) ?? normalizeSettingString(env.GOOGLE_CLIENT_SECRET) ?? null;

  return { clientId, clientSecret };
}
export async function getPublicBaseUrl(locale?: string | null): Promise<string | null> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });

  const v = await getFirstNonEmptySetting({ key: 'public_base_url', localeCandidates });
  if (v) return v.replace(/\/+$/, '');

  const envV = normalizeSettingString(envFallbacks.PUBLIC_BASE_URL) ?? normalizeSettingString(process.env.PUBLIC_BASE_URL);

  return envV ? envV.replace(/\/+$/, '') : null;
}
export async function getGa4MeasurementId(locale?: string | null): Promise<string | null> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const v = await getFirstNonEmptySetting({ key: 'ga4_measurement_id', localeCandidates });
  return v ? v.trim() : null;
}
export async function getGtmContainerId(locale?: string | null): Promise<string | null> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const v = await getFirstNonEmptySetting({ key: 'gtm_container_id', localeCandidates });
  return v ? v.trim() : null;
}
export async function getCookieConsentConfig(locale?: string | null): Promise<CookieConsentConfig> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const raw = await getFirstNonEmptySetting({ key: 'cookie_consent', localeCandidates });

  if (!raw) return defaultCookieConsentConfig;

  try {
    const parsed = JSON.parse(raw);
    return {
      consent_version: Number(parsed?.consent_version ?? 1) || 1,
      defaults: {
        necessary: parsed?.defaults?.necessary !== false,
        analytics: parsed?.defaults?.analytics === true,
        marketing: parsed?.defaults?.marketing === true,
      },
      ui: { enabled: parsed?.ui?.enabled !== false },
    };
  } catch {
    return defaultCookieConsentConfig;
  }
}