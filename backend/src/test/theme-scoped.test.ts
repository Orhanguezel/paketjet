import { describe, expect, test } from 'bun:test';
import { deepMergeThemeConfig } from '../modules/theme/helpers';
import { scopedThemeDefaults } from '../modules/theme/scoped-defaults';
import { themeUpdateSchema } from '../modules/theme/validation';

describe('bağımsız tema ayarları', () => {
  test('site ve panel ayrı varsayılan paletler kullanır', () => {
    expect(scopedThemeDefaults.storefront.colors.navBg).not.toBe(scopedThemeDefaults['admin-panel'].colors.navBg);
    expect(scopedThemeDefaults.storefront.colors.primary).toBe(scopedThemeDefaults['admin-panel'].colors.primary);
  });

  test('kısmi güncelleme diğer renkleri ve diğer kapsamı korur', () => {
    const site = scopedThemeDefaults.storefront;
    const patch = themeUpdateSchema.parse({ colors: { primary: '#123456' } });
    const updated = deepMergeThemeConfig(site, patch);
    expect(updated.colors.primary).toBe('#123456');
    expect(updated.colors.navBg).toBe(site.colors.navBg);
    expect(scopedThemeDefaults['admin-panel'].colors.primary).not.toBe('#123456');
  });

  test('CSS alanlarına geçersiz değer kabul edilmez', () => {
    expect(themeUpdateSchema.safeParse({ colors: { primary: 'red; color: black' } }).success).toBe(false);
    expect(themeUpdateSchema.safeParse({ typography: { fontBody: 'Arial; color: red' } }).success).toBe(false);
    expect(themeUpdateSchema.safeParse({ radius: '10px; display: none' }).success).toBe(false);
  });
});
