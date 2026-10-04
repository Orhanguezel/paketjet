'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { THEME_STORAGE_KEY } from '@/lib/theme';

type ThemeColors = Record<string, string>;
type PublicTheme = {
  enabled: boolean;
  colors: ThemeColors;
  typography: { fontHeading: string; fontBody: string };
  radius: string;
  darkMode: 'light' | 'dark' | 'system';
};

const isHex = (value: string | undefined) => Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));
const safeFont = (value: string) => /^[\w\s,'".-]{1,200}$/.test(value) ? value : 'DM Sans, system-ui, sans-serif';

function hsl(hex: string) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const max = Math.max(...channels), min = Math.min(...channels);
  const delta = max - min;
  const light = (max + min) / 2;
  let hue = 0, saturation = 0;
  if (delta) {
    saturation = delta / (1 - Math.abs(2 * light - 1));
    switch (max) {
      case channels[0]: hue = ((channels[1] - channels[2]) / delta) % 6; break;
      case channels[1]: hue = (channels[2] - channels[0]) / delta + 2; break;
      default: hue = (channels[0] - channels[1]) / delta + 4;
    }
    hue *= 60;
  }
  return `${Math.round((hue + 360) % 360)} ${Math.round(saturation * 100)}% ${Math.round(light * 100)}%`;
}

function applyTheme(theme: PublicTheme) {
  const old = document.getElementById('managed-storefront-theme');
  old?.remove();
  if (!theme.enabled) return;
  const c = theme.colors;
  const names = ['primary', 'primaryDark', 'accent', 'background', 'surfaceBase', 'surfaceRaised',
    'surfaceMuted', 'textStrong', 'textBody', 'textMuted', 'border', 'borderLight', 'navBg',
    'navFg', 'footerBg', 'footerFg', 'success', 'warning', 'danger'];
  if (names.some((name) => !isHex(c[name]))) return;
  const light: Record<string, string> = {
    '--col-brand': hsl(c.primary), '--col-brand-dark': hsl(c.primaryDark),
    '--col-brand-light': hsl(c.accent), '--col-brand-xlight': hsl(c.surfaceMuted),
    '--col-cta': hsl(c.primary), '--col-cta-dark': hsl(c.primaryDark),
    '--col-cta-light': hsl(c.accent), '--col-foreground': hsl(c.textStrong),
    '--col-muted': hsl(c.textBody), '--col-faint': hsl(c.textMuted),
    '--col-border': hsl(c.border), '--col-border-soft': hsl(c.borderLight),
    '--col-surface': hsl(c.surfaceRaised), '--col-bg': hsl(c.background),
    '--col-bg-alt': hsl(c.surfaceBase), '--col-navy': hsl(c.navBg),
    '--col-panel-ink': hsl(c.textStrong), '--col-panel-surface': hsl(c.surfaceRaised),
    '--col-panel-idle': hsl(c.surfaceMuted),
    '--col-panel-accent': hsl(c.primary), '--col-success': hsl(c.success),
    '--color-action': c.primary, '--color-navy': c.navBg, '--color-accent': c.primary,
    '--color-background': c.background, '--color-bg-alt': c.surfaceBase,
    '--color-surface': c.surfaceRaised, '--color-foreground': c.textStrong,
    '--color-muted': c.textBody, '--color-faint': c.textMuted,
    '--color-border': c.border, '--color-border-soft': c.borderLight,
    '--color-warning': c.warning, '--color-danger': c.danger,
    '--design-mist': c.background, '--design-ice': c.surfaceBase,
    '--design-lilac': c.accent, '--design-ink': c.textStrong,
    '--managed-nav-fg': c.navFg,
    '--design-line': c.border, '--design-footer': c.footerBg,
    '--design-on-dark': c.footerFg, '--font-sans': safeFont(theme.typography.fontBody),
    '--pj-font-heading': safeFont(theme.typography.fontHeading), '--radius': theme.radius,
  };
  const dark: Record<string, string> = {
    '--col-brand': hsl(c.primary), '--col-brand-dark': hsl(c.primaryDark),
    '--col-cta': hsl(c.primary), '--col-cta-dark': hsl(c.primaryDark),
    '--color-action': c.primary, '--color-brand': c.primary, '--color-brand-dark': c.primaryDark,
    '--pj-font-heading': safeFont(theme.typography.fontHeading), '--font-sans': safeFont(theme.typography.fontBody),
    '--radius': theme.radius,
  };
  const declarations = (vars: Record<string, string>) => Object.entries(vars).map(([key, value]) => `${key}:${value};`).join('');
  const style = document.createElement('style');
  style.id = 'managed-storefront-theme';
  style.textContent = `:root:not([data-theme="dark"]){${declarations(light)}}:root[data-theme="dark"]{${declarations(dark)}}`;
  document.head.append(style);
}

export function ManagedStorefrontTheme() {
  const { setTheme } = useTheme();
  useEffect(() => {
    let closed = false;
    async function refresh() {
      try {
        const response = await fetch('/api/theme/storefront', { cache: 'no-store' });
        if (!response.ok || closed) return;
        const theme = await response.json() as PublicTheme;
        applyTheme(theme);
        if (theme.enabled && !localStorage.getItem(THEME_STORAGE_KEY)) setTheme(theme.darkMode);
      } catch { /* Keep the compiled site theme when the API is unavailable. */ }
    }
    void refresh();
    window.addEventListener('focus', refresh);
    return () => { closed = true; window.removeEventListener('focus', refresh); };
  }, [setTheme]);
  return null;
}
