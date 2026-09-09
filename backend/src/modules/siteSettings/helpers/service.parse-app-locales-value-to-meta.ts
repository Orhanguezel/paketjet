import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db/client';
import { normalizeLooseLocale, toBool } from '@/modules/_shared';
import { siteSettings } from '../schema';
import type { AppLocaleMeta } from '@/modules/_shared';
import {uniqLocales} from './service.normalize-setting-bool';
export function parseAppLocalesValueToMeta(v: unknown): AppLocaleMeta[] {
  if (v == null) return [];

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

  const normalizeOne = (item: unknown): AppLocaleMeta | null => {
    if (!item) return null;

    if (typeof item === 'string') {
      const code = normalizeLooseLocale(item);
      if (!code) return null;
      return { code, label: code.toUpperCase(), is_default: false, is_active: true };
    }

    if (!isRecord(item)) return null;

    const code = normalizeLooseLocale(String(item.code ?? item.value ?? ''));
    if (!code) return null;

    const label = String(item.label ?? code.toUpperCase()).trim() || code.toUpperCase();
    const is_active = item.is_active !== false;
    const is_default = item.is_default === true || item.isDefault === true;

    return { code, label, is_default, is_active };
  };

  if (Array.isArray(v)) {
    const items = v.map(normalizeOne).filter(Boolean) as AppLocaleMeta[];
    const active = items.filter((item) => item.is_active !== false);
    const hasDefault = active.some((item) => item.is_default);

    if (!hasDefault && active.length) active[0] = { ...active[0], is_default: true };

    const map = new Map<string, AppLocaleMeta>();
    for (const item of active) map.set(item.code, item);
    return Array.from(map.values());
  }

  if (typeof v === 'string') {
    const raw = v.trim();
    if (!raw) return [];

    try {
      return parseAppLocalesValueToMeta(JSON.parse(raw));
    } catch {
      const codes = uniqLocales(raw.split(/[;,]+/).map((part) => part.trim()));
      return codes.map((code, index) => ({
        code,
        label: code.toUpperCase(),
        is_default: index === 0,
        is_active: true,
      }));
    }
  }

  return [];
}