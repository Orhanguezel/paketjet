'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import { API } from '@/config/api-endpoints';
import { storefrontThemeCss, type PublicTheme } from '@/lib/storefront-theme-css';

export function ManagedStorefrontTheme() {
  const { setTheme } = useTheme();
  useEffect(() => {
    let closed = false;
    async function refresh() {
      try {
        const response = await fetch(API.theme.storefront, { cache: 'no-store' });
        if (!response.ok || closed) return;
        const theme = await response.json() as PublicTheme;
        const old = document.getElementById('managed-storefront-theme');
        const css = storefrontThemeCss(theme);
        if (old && old.textContent !== css) old.remove();
        if (css && old?.textContent !== css) {
          const style = document.createElement('style');
          style.id = 'managed-storefront-theme';
          style.textContent = css;
          document.head.append(style);
        }
        if (theme.enabled && !localStorage.getItem(THEME_STORAGE_KEY)) setTheme(theme.darkMode);
      } catch { /* Keep the compiled site theme when the API is unavailable. */ }
    }
    void refresh();
    window.addEventListener('focus', refresh);
    return () => { closed = true; window.removeEventListener('focus', refresh); };
  }, [setTheme]);
  return null;
}
