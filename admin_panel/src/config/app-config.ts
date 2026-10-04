// =============================================================
// FILE: src/config/app-config.ts
// Admin Panel Config — DB'den gelen branding verileri için fallback
// =============================================================

import { APP_NAME, PANEL_TITLE, PANEL_URL } from '@/lib/app-brand';
import packageJson from '../../package.json';
import { FALLBACK_LOCALE } from '@/i18n/config';

const currentYear = new Date().getFullYear();

export type AdminBrandingConfig = {
  app_name: string;
  app_copyright: string;
  html_lang: string;
  theme_color: string;
  logo: string;
  logo_dark: string;
  logo_icon: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
  meta: {
    title: string;
    description: string;
    og_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
  };
};

export const DEFAULT_BRANDING: AdminBrandingConfig = {
  app_name: PANEL_TITLE,
  app_copyright: APP_NAME,
  html_lang: FALLBACK_LOCALE,
  theme_color: '#F97316',
  logo: '',
  logo_dark: '',
  logo_icon: '',
  favicon_16: '',
  favicon_32: '',
  apple_touch_icon: '',
  meta: {
    title: PANEL_TITLE,
    description:
      'Yönetim paneli: taşıyıcılar, ilanlar, ödemeler ve site ayarları.',
    og_url: PANEL_URL,
    og_title: PANEL_TITLE,
    og_description:
      'İlan, ödeme ve site yönetimi tek panelde.',
    og_image: '',
    twitter_card: 'summary_large_image',
  },
};

export const APP_CONFIG = {
  name: DEFAULT_BRANDING.app_name,
  version: packageJson.version,
  copyright: `© ${currentYear}, ${DEFAULT_BRANDING.app_copyright}.`,
  meta: {
    title: DEFAULT_BRANDING.meta.title,
    description: DEFAULT_BRANDING.meta.description,
  },
  branding: DEFAULT_BRANDING,
} as const;
