import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db/client';
import { normalizeLooseLocale, toBool } from '@/modules/_shared';
import { siteSettings } from '../schema';
import type { AppLocaleMeta } from '@/modules/_shared';
export const GLOBAL_LOCALE = '*' as const;
export const PREFERRED_FALLBACK_LOCALE = 'tr' as const;
export type SettingRow = { key: string; locale: string; value: string };
