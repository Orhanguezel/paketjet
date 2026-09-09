import {randomUUID} from 'node:crypto';
import {and,eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {toBool} from '@/modules/_shared';
import {customPages,customPagesI18n} from './schema';
import {repoPreserveContent} from './revision.repository';
import type {CreateCustomPageInput,UpdateCustomPageInput} from './validation';
export async function repoCreateCustomPage(data: CreateCustomPageInput) {
  const id = randomUUID();
  return db.transaction(async (tx) => {
  await tx.insert(customPages).values({
    id,
    module_key: data.module_key,
    is_published: data.is_published !== undefined ? (toBool(data.is_published) ? 1 : 0) : 0,
    display_order: data.display_order ?? 0,
    featured_image: data.featured_image ?? null,
    storage_asset_id: data.storage_asset_id ?? null,
  });
  await tx.insert(customPagesI18n).values({
    page_id: id,
    locale: data.locale,
    title: data.title,
    slug: data.slug,
    content: data.content ?? null,
    summary: data.summary ?? null,
    meta_title: data.meta_title ?? null,
    meta_description: data.meta_description ?? null,
  });
  return { id };
  });
}

export async function repoUpdateCustomPage(id: string, data: UpdateCustomPageInput) {
  return db.transaction(async (tx) => {
  const [parent] = await tx.select().from(customPages).where(eq(customPages.id,id)).for('update');
  const locales = await tx.select().from(customPagesI18n).where(eq(customPagesI18n.page_id,id));
  for (const locale of locales) await repoPreserveContent({...parent,...locale,id},tx);
  const pagePatch: Record<string, unknown> = {updated_at:new Date()};
  if (data.module_key !== undefined) pagePatch.module_key = data.module_key;
  if (data.is_published !== undefined) pagePatch.is_published = toBool(data.is_published) ? 1 : 0;
  if (data.display_order !== undefined) pagePatch.display_order = data.display_order;
  if (data.featured_image !== undefined) pagePatch.featured_image = data.featured_image;
  if (data.storage_asset_id !== undefined) pagePatch.storage_asset_id = data.storage_asset_id;
  if (Object.keys(pagePatch).length) await tx.update(customPages).set(pagePatch).where(eq(customPages.id, id));

  const i18nPatch: Record<string, unknown> = {};
  if (data.title !== undefined) i18nPatch.title = data.title;
  if (data.slug !== undefined) i18nPatch.slug = data.slug;
  if (data.content !== undefined) i18nPatch.content = data.content;
  if (data.summary !== undefined) i18nPatch.summary = data.summary;
  if (data.meta_title !== undefined) i18nPatch.meta_title = data.meta_title;
  if (data.meta_description !== undefined) i18nPatch.meta_description = data.meta_description;
  if (Object.keys(i18nPatch).length) {
    await tx.update(customPagesI18n).set(i18nPatch).where(and(eq(customPagesI18n.page_id, id), eq(customPagesI18n.locale, data.locale)));
  }
  });
}

export async function repoDeleteCustomPage(id: string) {
  await db.transaction(async(tx)=>{
    const [parent]=await tx.select().from(customPages).where(eq(customPages.id,id)).for('update');
    const locales=await tx.select().from(customPagesI18n).where(eq(customPagesI18n.page_id,id));
    for(const locale of locales)await repoPreserveContent({...parent,...locale,id},tx);
    await tx.delete(customPages).where(eq(customPages.id,id));
  });
}

export async function repoReorderCustomPages(items: { id: string; display_order: number }[]) {
  for (const item of items) {
    await db.update(customPages).set({ display_order: item.display_order }).where(eq(customPages.id, item.id));
  }
}
