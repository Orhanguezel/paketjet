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
import {type SmtpSettings} from './service.shared';
export async function getAppLocalesMeta(): Promise<AppLocaleMeta[]> {
  const raw = await getGlobalSettingValue('app_locales');
  if (!raw) {
    return cloneDefaultAppLocales();
  }

  const v: unknown = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  })();

  const metas = parseAppLocalesValueToMeta(v);
  if (metas.length) return metas;

  return cloneDefaultAppLocales();
}
export async function getAppLocales(_locale?: string | null): Promise<string[]> {
  const metas = await getAppLocalesMeta();
  return uniqLocales(metas.filter((m) => m.is_active !== false).map((m) => m.code));
}
export async function getDefaultLocale(_locale?: string | null): Promise<string> {
  const raw = await getGlobalSettingValue('default_locale');
  const s = normalizeLooseLocale(raw);
  return s || 'tr';
}
export async function getEffectiveDefaultLocale(): Promise<string> {
  const def = (await getDefaultLocale(null)).trim().toLowerCase();
  const metas = await getAppLocalesMeta();
  const active = metas.filter((m) => m.is_active !== false);

  if (active.some((m) => m.code === def)) return def;

  const fromMeta = active.find((m) => m.is_default)?.code;
  return (fromMeta || active[0]?.code || def || 'tr').trim().toLowerCase();
}
export async function buildLocaleFallbackChain(opts: {
  requested?: string | null;
  preferred?: string;
}): Promise<string[]> {
  const req = normalizeLooseLocale(opts.requested) || '';
  const preferred = normalizeLooseLocale(opts.preferred) || PREFERRED_FALLBACK_LOCALE;

  const candidates = buildLocaleCandidates(req);
  const def = await getEffectiveDefaultLocale();
  const appLocales = await getAppLocales(null);

  return uniqLocales([candidates[0], candidates[1], def, preferred, ...appLocales, GLOBAL_LOCALE]);
}
export async function getSiteMediaRaw(key: SiteMediaKey): Promise<string | null> {
  return await getGlobalSettingValue(key);
}
export async function getSiteMediaUrl(key: SiteMediaKey): Promise<string | null> {
  const raw = await getSiteMediaRaw(key);
  return parseSiteMediaUrl(raw);
}
export async function getSiteLogoUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_logo');
}
export async function getSiteLogoDarkUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_logo_dark');
}
export async function getSiteLogoLightUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_logo_light');
}
export async function getSiteFaviconUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_favicon');
}
export async function getAppleTouchIconUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_apple_touch_icon');
}
export async function getSiteAppIcon512Url(): Promise<string | null> {
  return await getSiteMediaUrl('site_app_icon_512');
}
export async function getSiteOgDefaultImageUrl(): Promise<string | null> {
  return await getSiteMediaUrl('site_og_default_image');
}
export async function getSmtpSettings(locale?: string | null): Promise<SmtpSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });

  const [host, portStr, username, password, fromEmail, fromName, sslStr] = await Promise.all([
    getFirstNonEmptySetting({ key: 'smtp_host', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_port', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_username', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_password', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_from_email', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_from_name', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_ssl', localeCandidates }),
  ]);

  const port = portStr ? Number(portStr) : null;

  return {
    host: normalizeSettingString(host),
    port: typeof port === 'number' && Number.isFinite(port) ? port : null,
    username: normalizeSettingString(username),
    password: normalizeSettingString(password),
    fromEmail: normalizeSettingString(fromEmail),
    fromName: normalizeSettingString(fromName),
    secure: normalizeSettingBool(sslStr),
  };
}