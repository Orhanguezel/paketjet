// =============================================================
// FILE: src/server/fetch-branding.ts
// Server-only utility — SSR'da branding config'i backend'den çeker
// =============================================================

import { DEFAULT_BRANDING, type AdminBrandingConfig } from '@/config/app-config';
import { normalizeSiteSettingsBrandingConfig } from '@/integrations/shared';

/**
 * Backend API base URL (server-side only).
 * PANEL_API_URL > NEXT_PUBLIC_API_URL > fallback
 */
function getServerApiUrl(): string {
  const panel = (process.env.PANEL_API_URL || '').trim().replace(/\/+$/, '');
  if (panel) return `${panel}/api`;

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (base) return base;

  const pub = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  if (pub) return pub;

  return 'https://paketjet.com/api';
}

/**
 * SSR'da `ui_admin_config` key'ini public endpoint üzerinden çeker,
 * `branding` alt-objesini döndürür.
 * Hata durumunda DEFAULT_BRANDING fallback döner.
 */
export async function fetchBrandingConfig(): Promise<AdminBrandingConfig> {
  try {
    const base = getServerApiUrl();
    const res = await fetch(`${base}/site_settings/ui_admin_config`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return DEFAULT_BRANDING;

    const data = await res.json();
    return normalizeSiteSettingsBrandingConfig(data);
  } catch {
    return DEFAULT_BRANDING;
  }
}
