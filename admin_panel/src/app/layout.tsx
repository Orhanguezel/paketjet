// =============================================================
// FILE: src/app/layout.tsx
// RootLayout — DB'den branding config ile dinamik metadata
// - generateMetadata() ile SSR'da DB'den meta bilgileri çekilir
// - ThemeBootScript runs before interactive via next/script
// - suppressHydrationWarning on html + body to tolerate extension-added attrs
// =============================================================
import { PANEL_URL } from '@/lib/app-brand';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

import { Toaster } from '@/components/ui/sonner';
import { fontVars } from '@/lib/fonts/registry';
import { PREFERENCE_DEFAULTS } from '@/lib/preferences/preferences-config';
import { fetchBrandingConfig, getServerApiUrl } from '@/server/fetch-branding';
import type { ScopedThemeConfig } from '@/integrations/shared/theme-types';
import { managedAdminThemeCss } from '@/lib/managed-admin-theme';

import StoreProvider from '@/stores/provider';
import { ManagedThemeRuntime } from './managed-theme-runtime';
import { PreferencesStoreProvider } from '@/stores/preferences/preferences-provider';
import { LocaleProvider } from '@/i18n/locale-provider';

import './globals.css';

function toTwitterCard(value: string): 'summary' | 'summary_large_image' | 'app' | 'player' {
  if (value === 'summary' || value === 'app' || value === 'player') return value;
  return 'summary_large_image';
}

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingConfig();
  const icon = [branding.favicon_16, branding.favicon_32]
    .filter(Boolean)
    .map((url, index) => ({
      url,
      sizes: index === 0 ? '16x16' : '32x32',
    }));
  const apple = branding.apple_touch_icon || undefined;
  const shortcut = branding.logo_icon || branding.favicon_32 || branding.favicon_16 || undefined;

  return {
    metadataBase: new URL(branding.meta.og_url || PANEL_URL || 'http://localhost'),
    title: branding.meta.title,
    description: branding.meta.description,
    icons: {
      ...(icon.length ? { icon } : {}),
      ...(shortcut ? { shortcut } : {}),
      ...(apple ? { apple } : {}),
    },
    openGraph: {
      type: 'website',
      url: branding.meta.og_url,
      title: branding.meta.og_title,
      description: branding.meta.og_description,
      images: [branding.meta.og_image],
    },
    twitter: {
      card: toTwitterCard(branding.meta.twitter_card),
      title: branding.meta.og_title,
      description: branding.meta.og_description,
      images: [branding.meta.og_image],
    },
  };
}

export async function generateViewport() {
  const [branding, managedTheme] = await Promise.all([fetchBrandingConfig(), fetchAdminTheme()]);

  return {
    themeColor: managedTheme?.enabled ? managedTheme.colors.primary : branding.theme_color,
  };
}

async function fetchAdminTheme(): Promise<ScopedThemeConfig | null> {
  try {
    const response = await fetch(`${getServerApiUrl()}/theme/admin-panel`, { next: { revalidate: 30 } });
    return response.ok ? (await response.json()) as ScopedThemeConfig : null;
  } catch {
    return null;
  }
}

function ThemeBootInlineScript({ managedMode }: { managedMode: string | null }) {
  const {
    theme_mode,
    theme_preset,
    content_layout,
    navbar_style,
    sidebar_variant,
    sidebar_collapsible,
    font,
  } = PREFERENCE_DEFAULTS;

  const code = `
(function () {
  try {
    var d = document.documentElement;

    // cookie reader helper
    function ck(n) {
      var m = document.cookie.match(new RegExp('(?:^|;\\\\s*)' + n + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    }

    // theme mode (cookie → localStorage → default)
    var mode = ${JSON.stringify(managedMode)} || ck('theme_mode') || (function(){try{return localStorage.getItem('theme_mode')}catch(e){return null}})() || ${JSON.stringify(theme_mode)};
    if (mode === 'system') mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (mode === 'dark') d.classList.add('dark');
    else d.classList.remove('dark');

    // theme preset
    d.dataset.themePreset = ck('theme_preset') || ${JSON.stringify(theme_preset)};

    // layout & font from cookies or defaults
    d.dataset.contentLayout = ck('content_layout') || ${JSON.stringify(content_layout)};
    d.dataset.navbarStyle = ck('navbar_style') || ${JSON.stringify(navbar_style)};
    d.dataset.sidebarVariant = ck('sidebar_variant') || ${JSON.stringify(sidebar_variant)};
    d.dataset.sidebarCollapsible = ck('sidebar_collapsible') || ${JSON.stringify(sidebar_collapsible)};
    d.dataset.font = ck('font') || ${JSON.stringify(font)};

  } catch (e) {}
})();
`;

  return (
    <Script id="theme-boot" strategy="beforeInteractive">
      {code}
    </Script>
  );
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [branding, managedTheme] = await Promise.all([fetchBrandingConfig(), fetchAdminTheme()]);
  const themeCss = managedTheme ? managedAdminThemeCss(managedTheme) : '';

  const { theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible, font } =
    PREFERENCE_DEFAULTS;

  return (
    <html
      lang={branding.html_lang}
      suppressHydrationWarning
      className={fontVars}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {themeCss && <style id="managed-admin-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <ThemeBootInlineScript managedMode={managedTheme?.enabled ? managedTheme.darkMode : null} />
        <ManagedThemeRuntime />

        <StoreProvider>
          <PreferencesStoreProvider>
            <LocaleProvider>
              {children}
              <Toaster />
            </LocaleProvider>
          </PreferencesStoreProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
