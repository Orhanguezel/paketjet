import { and, asc, desc, eq, inArray, like, or } from 'drizzle-orm';
import { db } from '@/db/client';
import { normalizeLocaleStr, toBool } from '@/modules/_shared';
import { customPages, customPagesI18n } from './schema';
import type { CreateCustomPageInput, ListQueryInput, UpdateCustomPageInput } from './validation';

type PageRow = {
  id: string;
  module_key: string;
  is_published: number;
  display_order: number;
  featured_image: string | null;
  storage_asset_id: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  locale: string;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

function pickLocalizedRow<T extends PageRow>(rows: T[], locale: string): T | null {
  if (!rows.length) return null;
  return rows.find((row) => row.locale === locale) ?? rows.find((row) => row.locale === 'tr') ?? rows[0] ?? null;
}

function buildPageConditions(params: ListQueryInput) {
  const conditions = [] as ReturnType<typeof eq>[];
  if (params.module_key) conditions.push(eq(customPages.module_key, params.module_key));
  if (params.is_published !== undefined) conditions.push(eq(customPages.is_published, toBool(params.is_published) ? 1 : 0));
  if (params.search) {
    const needle = `%${params.search}%`;
    conditions.push(or(like(customPagesI18n.title, needle), like(customPagesI18n.slug, needle))!);
  }
  return conditions;
}

export async function repoListCustomPages(params: ListQueryInput) {
  const locale = normalizeLocaleStr(params.locale) || 'tr';
  const conditions = buildPageConditions(params);
  const rows = await db
    .select({
      id: customPages.id,
      module_key: customPages.module_key,
      is_published: customPages.is_published,
      display_order: customPages.display_order,
      featured_image: customPages.featured_image,
      storage_asset_id: customPages.storage_asset_id,
      created_at: customPages.created_at,
      updated_at: customPages.updated_at,
      locale: customPagesI18n.locale,
      title: customPagesI18n.title,
      slug: customPagesI18n.slug,
      content: customPagesI18n.content,
      summary: customPagesI18n.summary,
      meta_title: customPagesI18n.meta_title,
      meta_description: customPagesI18n.meta_description,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, eq(customPages.id, customPagesI18n.page_id))
    .where(and(...conditions, inArray(customPagesI18n.locale, [locale, 'tr'])))
    .orderBy(asc(customPages.display_order), asc(customPagesI18n.title));

  const picked = new Map<string, PageRow>();
  for (const row of rows) {
    const current = picked.get(row.id);
    const next = pickLocalizedRow([...(current ? [current] : []), row], locale);
    if (next) picked.set(row.id, next);
  }

  return Array.from(picked.values()).slice(params.offset, params.offset + params.limit);
}

export async function repoGetCustomPageById(id: string, locale = 'tr') {
  const rows = await db
    .select({
      id: customPages.id,
      module_key: customPages.module_key,
      is_published: customPages.is_published,
      display_order: customPages.display_order,
      featured_image: customPages.featured_image,
      storage_asset_id: customPages.storage_asset_id,
      created_at: customPages.created_at,
      updated_at: customPages.updated_at,
      locale: customPagesI18n.locale,
      title: customPagesI18n.title,
      slug: customPagesI18n.slug,
      content: customPagesI18n.content,
      summary: customPagesI18n.summary,
      meta_title: customPagesI18n.meta_title,
      meta_description: customPagesI18n.meta_description,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, eq(customPages.id, customPagesI18n.page_id))
    .where(and(eq(customPages.id, id), inArray(customPagesI18n.locale, [locale, 'tr'])))
    .orderBy(desc(customPagesI18n.locale));

  return pickLocalizedRow(rows, locale);
}

export async function repoGetCustomPageBySlug(slug: string, locale = 'tr') {
  const rows = await db
    .select({
      id: customPages.id,
      module_key: customPages.module_key,
      is_published: customPages.is_published,
      display_order: customPages.display_order,
      featured_image: customPages.featured_image,
      storage_asset_id: customPages.storage_asset_id,
      created_at: customPages.created_at,
      updated_at: customPages.updated_at,
      locale: customPagesI18n.locale,
      title: customPagesI18n.title,
      slug: customPagesI18n.slug,
      content: customPagesI18n.content,
      summary: customPagesI18n.summary,
      meta_title: customPagesI18n.meta_title,
      meta_description: customPagesI18n.meta_description,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, eq(customPages.id, customPagesI18n.page_id))
    .where(and(eq(customPagesI18n.slug, slug), inArray(customPagesI18n.locale, [locale, 'tr'])))
    .orderBy(desc(customPagesI18n.locale));

  return pickLocalizedRow(rows, locale);
}

export { repoCreateCustomPage, repoUpdateCustomPage, repoDeleteCustomPage, repoReorderCustomPages } from './mutation.repository';
