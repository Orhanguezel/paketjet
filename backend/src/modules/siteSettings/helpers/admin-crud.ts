// src/modules/siteSettings/helpers/admin-crud.ts
// CRUD-specific helpers for site settings admin controller.

import { rowToDto, repoGetFirstRowByFallback, repoGetRowByKeyAndLocale, repoUpsertAllLocales, repoUpsertOne } from '../repository';
import { getAppLocalesMeta, getEffectiveDefaultLocale } from '../service';
import {
  buildAdminFallbacks,
  getAdminAppLocales,
  getAdminDefaultLocale,
  isGlobalKey,
  isLocaleMap,
  normalizeLooseLocale,
} from './admin-locale';
import { repoDeleteByKey, repoDeleteMany, repoListSettings } from '../admin.repository';
import type { JsonLike } from '@/modules/_shared';
import type { SiteSettingBulkUpsertInput, SiteSettingUpsertInput } from '../validation';

export type SiteSettingsListQuery = Record<string, string | undefined>;

export async function listAdminSiteSettings(query: SiteSettingsListQuery) {
  const requested = normalizeLooseLocale(query.locale);
  const defaultLocale = await getAdminDefaultLocale();
  const localeToUse = requested ?? defaultLocale;

  const rows = await repoListSettings({
    q: query.q,
    keys: query.keys,
    prefix: query.prefix,
    order: query.order,
    limit: query.limit,
    offset: query.offset,
    localeToUse,
    isGlobalKey,
  });

  return rows.map(rowToDto);
}

export async function getAdminSiteSettingByKey(key: string, locale?: string | null) {
  const fallbacks = await buildAdminFallbacks(locale);
  const row = await repoGetFirstRowByFallback(key, fallbacks);
  if (!row) return null;

  const dto = rowToDto(row);
  return { key: dto.key, value: dto.value, locale: dto.locale };
}

export async function createAdminSiteSetting(input: SiteSettingUpsertInput) {
  const appLocales = await getAdminAppLocales();
  await repoUpsertAllLocales(input.key, input.value, appLocales);

  const defaultLocale = await getAdminDefaultLocale();
  const row = await repoGetRowByKeyAndLocale(input.key, defaultLocale);
  return row ? rowToDto(row) : { key: input.key, locale: defaultLocale, value: input.value };
}

export function hasAdminSettingValue(body: Partial<{ value: JsonLike }>): body is { value: JsonLike } {
  return 'value' in body;
}

export async function syncIndividualSeoPages(seoPagesValue: unknown, locale: string) {
  if (!seoPagesValue || typeof seoPagesValue !== 'object') return;
  const pages = seoPagesValue as Record<string, any>;
  const activeLocale = String(locale || 'tr').trim();

  for (const [pageKey, pageData] of Object.entries(pages)) {
    if (!pageData || typeof pageData !== 'object') continue;

    const title = typeof pageData.title === 'string' ? pageData.title.trim() : '';
    const description = typeof pageData.description === 'string' ? pageData.description.trim() : '';
    const ogImage = typeof pageData.og_image === 'string' ? pageData.og_image.trim() : '';
    const noIndex = Boolean(pageData.no_index || pageData.noIndex);
    const keywords = typeof pageData.keywords === 'string' ? pageData.keywords.trim() : '';

    const individualValue = {
      title,
      description,
      keywords,
      open_graph: {
        type: 'website',
        images: ogImage ? [ogImage] : [],
      },
      robots: {
        noindex: noIndex,
        index: !noIndex,
        follow: true,
      },
    };

    const individualKey = `seo_pages_${pageKey}`;
    await repoUpsertOne(individualKey, activeLocale, individualValue);
  }
}

export async function updateAdminSiteSetting(key: string, value: JsonLike, locale?: string | null) {
  const normalizedLocale = normalizeLooseLocale(locale);

  if (normalizedLocale === '*') {
    await repoUpsertOne(key, '*', value);
    const cleanKey = String(key || '').trim().toLowerCase();
    if (cleanKey.endsWith('seo_pages')) {
      await syncIndividualSeoPages(value, '*');
    }
    return;
  }

  const appLocales = await getAdminAppLocales();
  if (normalizedLocale && appLocales.includes(normalizedLocale)) {
    await repoUpsertOne(key, normalizedLocale, value);
    const cleanKey = String(key || '').trim().toLowerCase();
    if (cleanKey.endsWith('seo_pages')) {
      await syncIndividualSeoPages(value, normalizedLocale);
    }
    return;
  }

  await repoUpsertAllLocales(key, value, appLocales);
  const cleanKey = String(key || '').trim().toLowerCase();
  if (cleanKey.endsWith('seo_pages')) {
    for (const l of appLocales) {
      await syncIndividualSeoPages(value, l);
    }
  }
}

export async function bulkUpsertAdminSiteSettings(input: SiteSettingBulkUpsertInput) {
  const appLocales = await getAdminAppLocales();
  const defaultLocale = await getAdminDefaultLocale();

  for (const item of input.items) {
    const cleanKey = String(item.key || '').trim().toLowerCase();
    const isSeoPages = cleanKey.endsWith('seo_pages');

    if (isLocaleMap(item.value, appLocales)) {
      const localizedValues = item.value as Partial<Record<string, JsonLike>>;

      for (const locale of appLocales) {
        const localizedValue = localizedValues[locale] ?? localizedValues[defaultLocale] ?? item.value;
        await repoUpsertOne(item.key, locale, localizedValue as JsonLike);
        if (isSeoPages) {
          await syncIndividualSeoPages(localizedValue, locale);
        }
      }
      continue;
    }

    await repoUpsertAllLocales(item.key, item.value, appLocales);
    if (isSeoPages) {
      for (const locale of appLocales) {
        await syncIndividualSeoPages(item.value, locale);
      }
    }
  }
}

export async function deleteManyAdminSiteSettings(query: SiteSettingsListQuery) {
  await repoDeleteMany({
    idNe: query['id!'] ?? query.id_ne,
    key: query.key,
    keyNe: query['key!'] ?? query.key_ne,
    keyIn: query.key_in ?? query.keys,
    prefix: query.prefix,
    locale: normalizeLooseLocale(query.locale),
  });
}

export async function deleteAdminSiteSetting(key: string, locale?: string | null) {
  await repoDeleteByKey(key, normalizeLooseLocale(locale));
}

export async function getAdminAppLocalesMeta() {
  return getAppLocalesMeta();
}

export async function getAdminEffectiveDefaultLocale() {
  return getEffectiveDefaultLocale();
}
