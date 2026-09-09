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
export type SmtpSettings = {
  host: string | null;
  port: number | null;
  username: string | null;
  password: string | null;
  fromEmail: string | null;
  fromName: string | null;
  secure: boolean;
};
export type StorageDriver = 'local' | 'cloudinary';
export type StorageSettings = {
  driver: StorageDriver;
  localRoot: string | null;
  localBaseUrl: string | null;
  cloudName: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  folder: string | null;

  // ✅ ZATEN VAR: DB key = cloudinary_unsigned_preset
  unsignedUploadPreset: string | null;

  cdnPublicBase: string | null;
  publicApiBase: string | null;
};
export const toDriver = (raw: string | null | undefined): StorageDriver => {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'local' || v === 'cloudinary') return v;

  const envRaw = (env.STORAGE_DRIVER || '').trim().toLowerCase();
  if (envRaw === 'local' || envRaw === 'cloudinary') return envRaw as StorageDriver;

  return 'cloudinary';
};
export type GoogleSettings = {
  clientId: string | null;
  clientSecret: string | null;
};
export type CookieConsentConfig = {
  consent_version: number;
  defaults: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  ui?: { enabled?: boolean };
};
export const defaultCookieConsentConfig: CookieConsentConfig = {
  consent_version: 1,
  defaults: { necessary: true, analytics: false, marketing: false },
  ui: { enabled: true },
};
export type TelegramSettings = {
  enabled: boolean;
  webhookEnabled: boolean;
  botToken: string | null;
  defaultChatId: string | null;
  autoReplyEnabled: boolean;
  autoReplyTemplate: string | null;
};
export type SiteSettingsEnvCloudinary = {
    unsignedUploadPreset?: string | null;
    uploadPreset?: string | null;
  };
export type SiteSettingsEnvFallbacks = {
    CLOUDINARY_UNSIGNED_UPLOAD_PRESET?: string | null;
    CLOUDINARY_UNSIGNED_PRESET?: string | null;
    PUBLIC_BASE_URL?: string | null;
    CLOUDINARY?: SiteSettingsEnvCloudinary | null;
  };
export const envFallbacks = env as SiteSettingsEnvFallbacks;
