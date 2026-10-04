import { db } from '@/db/client';
import { eq } from 'drizzle-orm';
import { deepMergeThemeConfig } from './helpers';
import { SCOPED_THEME_IDS, themeConfig, type ThemeScope } from './schema';
import { scopedThemeDefaults } from './scoped-defaults';
import type { ThemeConfig, ThemeUpdateInput } from './types';

export async function repoGetScopedTheme(scope: ThemeScope) {
  const [row] = await db.select({ config: themeConfig.config }).from(themeConfig)
    .where(eq(themeConfig.id, SCOPED_THEME_IDS[scope])).limit(1);
  if (!row) return { ...scopedThemeDefaults[scope], enabled: false };
  try {
    const saved = JSON.parse(row.config) as ThemeUpdateInput;
    return { ...deepMergeThemeConfig(scopedThemeDefaults[scope], saved), enabled: true };
  } catch {
    return { ...scopedThemeDefaults[scope], enabled: false };
  }
}

export async function repoSaveScopedTheme(scope: ThemeScope, config: ThemeConfig) {
  await db.insert(themeConfig).values({
    id: SCOPED_THEME_IDS[scope], config: JSON.stringify(config), is_active: 1,
  }).onDuplicateKeyUpdate({ set: { config: JSON.stringify(config), is_active: 1 } });
}

export async function repoResetScopedTheme(scope: ThemeScope) {
  await db.delete(themeConfig).where(eq(themeConfig.id, SCOPED_THEME_IDS[scope]));
  return { ...scopedThemeDefaults[scope], enabled: false };
}
