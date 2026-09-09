import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db/client';
import { normalizeLooseLocale, toBool } from '@/modules/_shared';
import { siteSettings } from '../schema';
import type { AppLocaleMeta } from '@/modules/_shared';
import {GLOBAL_LOCALE,type SettingRow} from './service.shared';
export function normalizeSettingBool(v: string | null | undefined): boolean {
  return toBool(v);
}
export function normalizeSettingString(v: string | null | undefined): string | null {
  if (v == null) return null;
  const trimmed = String(v).trim();
  return trimmed === '' ? null : trimmed;
}
export function uniqLocales(arr: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of arr) {
    const locale = normalizeLooseLocale(raw);
    if (!locale) continue;
    if (seen.has(locale)) continue;
    seen.add(locale);
    out.push(locale);
  }

  return out;
}
export function buildLocaleCandidates(rawLocale?: string | null): string[] {
  const locale = normalizeLooseLocale(rawLocale);
  if (!locale) return [];

  const langPart = locale.includes('-') ? locale.split('-')[0] : locale;
  return uniqLocales([locale, langPart]);
}
export function normalizeDbValueToString(raw: unknown): string {
  const value = String(raw ?? '');

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
      return String(parsed);
    }
  } catch {
    // ignore malformed JSON; keep raw string
  }

  return value;
}
export function parseSiteMediaUrl(raw: string | null | undefined): string | null {
  const value = normalizeSettingString(raw);
  if (!value) return null;

  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;

  try {
    const parsed = JSON.parse(value) as { url?: unknown; value?: unknown };
    const candidate =
      typeof parsed.url === 'string' ? parsed.url : typeof parsed.value === 'string' ? parsed.value : null;
    return normalizeSettingString(candidate);
  } catch {
    return value;
  }
}
export async function getGlobalSettingValue(key: string): Promise<string | null> {
  const star = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(and(eq(siteSettings.key, key), eq(siteSettings.locale, GLOBAL_LOCALE)))
    .limit(1);

  if (star?.[0]?.value != null) return String(star[0].value);

  const anyRow = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  return anyRow?.[0]?.value != null ? String(anyRow[0].value) : null;
}
export async function fetchSettingsRows(opts: {
  keys: readonly string[];
  localeCandidates?: string[] | null;
}): Promise<SettingRow[]> {
  const { keys, localeCandidates } = opts;

  const rows = await db
    .select({
      key: siteSettings.key,
      locale: siteSettings.locale,
      value: siteSettings.value,
    })
    .from(siteSettings)
    .where(
      localeCandidates && localeCandidates.length
        ? and(inArray(siteSettings.key, keys), inArray(siteSettings.locale, localeCandidates))
        : inArray(siteSettings.key, keys),
    );

  return rows.map((row) => ({
    key: String(row.key),
    locale: String(row.locale),
    value: normalizeDbValueToString(row.value),
  }));
}
export async function loadSettingsMap(opts: {
  keys: readonly string[];
  localeCandidates: string[];
}): Promise<Map<string, string>> {
  const rows = await fetchSettingsRows(opts);
  const map = new Map<string, string>();

  for (const key of opts.keys) {
    const sameKey = rows.filter((row) => row.key === key);

    for (const locale of opts.localeCandidates) {
      const hit = sameKey.find((row) => row.locale === locale);
      if (!hit) continue;
      map.set(key, hit.value);
      break;
    }
  }

  return map;
}
export async function getFirstNonEmptySetting(opts: {
  key: string;
  localeCandidates: string[];
}): Promise<string | null> {
  const rows = await fetchSettingsRows({
    keys: [opts.key],
    localeCandidates: opts.localeCandidates,
  });

  for (const locale of opts.localeCandidates) {
    const hit = rows.find((row) => row.locale === locale);
    const normalized = normalizeSettingString(hit?.value ?? null);
    if (normalized) return normalized;
  }

  return null;
}