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
import {type TelegramSettings} from './service.shared';
export async function getTelegramSettings(locale?: string | null): Promise<TelegramSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const map = await loadSettingsMap({ keys: TELEGRAM_KEYS, localeCandidates });

  const enabled = normalizeSettingBool(map.get('telegram_notifications_enabled'));
  const webhookEnabled = normalizeSettingBool(map.get('telegram_webhook_enabled'));
  const botToken = normalizeSettingString(map.get('telegram_bot_token'));
  const defaultChatId = normalizeSettingString(map.get('telegram_default_chat_id'));
  const autoReplyEnabled = normalizeSettingBool(map.get('telegram_autoreply_enabled'));
  const autoReplyTemplate = normalizeSettingString(map.get('telegram_autoreply_template'));

  return {
    enabled,
    webhookEnabled,
    botToken,
    defaultChatId,
    autoReplyEnabled,
    autoReplyTemplate,
  };
}