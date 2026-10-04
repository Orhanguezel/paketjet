type ThemeColors = Record<string, string>;
export type PublicTheme = {
  enabled: boolean;
  colors: ThemeColors;
  typography: { fontHeading: string; fontBody: string };
  radius: string;
  darkMode: 'light' | 'dark' | 'system';
};

const isHex = (value: string | undefined) => Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));
function themeFontStack(value: string) {
  const font = value.trim().toLowerCase();
  if (font.startsWith('dm sans')) return 'var(--font-dm-sans), system-ui, sans-serif';
  if (font === 'georgia, serif') return 'Georgia, serif';
  return 'system-ui, sans-serif';
}

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

export function storefrontThemeCss(theme: PublicTheme) {
  if (!theme.enabled) return '';
  const c = theme.colors;
  const names = ['primary', 'primaryDark', 'accent', 'background', 'surfaceBase', 'surfaceRaised',
    'surfaceMuted', 'textStrong', 'textBody', 'textMuted', 'border', 'borderLight', 'navBg',
    'navFg', 'footerBg', 'footerFg', 'success', 'warning', 'danger',
    'surfaceDarkBg', 'surfaceDarkText', 'surfaceDarkHeading'];
  if (names.some((name) => !isHex(c[name]))) return '';
  if (!['0rem', '0.3rem', '0.375rem', '0.5rem', '0.75rem', '1rem', '1.5rem'].includes(theme.radius)) return '';
  const light: Record<string, string> = {
    '--col-brand': hsl(c.primary), '--col-brand-dark': hsl(c.primaryDark),
    '--col-brand-light': hsl(c.accent), '--col-brand-xlight': hsl(c.surfaceMuted),
    '--col-blue': hsl(c.primary), '--col-blue-soft': hsl(c.accent),
    '--col-blue-xsoft': hsl(c.surfaceMuted), '--col-accent': hsl(c.primary),
    '--col-accent-dark': hsl(c.primaryDark), '--col-accent-light': hsl(c.accent),
    '--col-cta': hsl(c.primary), '--col-cta-dark': hsl(c.primaryDark),
    '--col-cta-light': hsl(c.accent), '--col-foreground': hsl(c.textStrong),
    '--col-muted': hsl(c.textBody), '--col-faint': hsl(c.textMuted),
    '--col-border': hsl(c.border), '--col-border-soft': hsl(c.borderLight),
    '--col-surface': hsl(c.surfaceRaised), '--col-bg': hsl(c.background),
    '--col-bg-alt': hsl(c.surfaceBase), '--col-navy': hsl(c.surfaceDarkBg),
    '--col-navy-mid': hsl(c.surfaceDarkBg), '--col-navy-soft': hsl(c.surfaceDarkText),
    '--col-panel-ink': hsl(c.textStrong), '--col-panel-surface': hsl(c.surfaceRaised),
    '--col-panel-idle': hsl(c.surfaceMuted),
    '--col-panel-accent': hsl(c.primary), '--col-success': hsl(c.success),
    '--col-success-bg': hsl(c.surfaceMuted), '--col-danger': hsl(c.danger),
    '--col-danger-bg': hsl(c.surfaceMuted), '--col-warning': hsl(c.warning),
    '--col-info': hsl(c.primary), '--col-panel-bg-from': hsl(c.surfaceMuted),
    '--col-panel-bg-to': hsl(c.accent),
    '--color-action': c.primary, '--color-navy': c.surfaceDarkBg, '--color-accent': c.primary,
    '--color-background': c.background, '--color-bg-alt': c.surfaceBase,
    '--color-surface': c.surfaceRaised, '--color-foreground': c.textStrong,
    '--color-muted': c.textBody, '--color-faint': c.textMuted,
    '--color-border': c.border, '--color-border-soft': c.borderLight,
    '--color-warning': c.warning, '--color-danger': c.danger,
    '--color-navy-mid': `color-mix(in srgb, ${c.navBg} 75%, ${c.textStrong})`,
    '--design-mist': c.background, '--design-ice': c.surfaceBase,
    '--design-lilac': c.accent, '--design-ink': c.textStrong,
    '--managed-nav-bg': c.navBg, '--managed-nav-fg': c.navFg,
    '--design-line': c.border, '--design-footer': c.footerBg,
    '--design-on-dark': c.footerFg, '--design-heading-dark': c.surfaceDarkHeading,
    '--design-muted-dark': c.surfaceDarkText,
    '--design-glass': `color-mix(in srgb, ${c.surfaceRaised} 80%, transparent)`,
    '--design-shadow': `0 14px 50px color-mix(in srgb, ${c.textStrong} 8%, transparent)`,
    '--font-sans': themeFontStack(theme.typography.fontBody),
    '--pj-font-heading': themeFontStack(theme.typography.fontHeading), '--radius': theme.radius,
  };
  const dark: Record<string, string> = {
    '--col-brand': hsl(c.primary), '--col-brand-dark': hsl(c.primaryDark),
    '--col-brand-light': hsl(c.surfaceMuted), '--col-brand-xlight': hsl(c.surfaceDarkBg),
    '--col-blue': hsl(c.primary), '--col-blue-soft': hsl(c.accent),
    '--col-blue-xsoft': hsl(c.surfaceMuted), '--col-accent': hsl(c.primary),
    '--col-accent-dark': hsl(c.primaryDark), '--col-accent-light': hsl(c.surfaceMuted),
    '--col-cta': hsl(c.primary), '--col-cta-dark': hsl(c.primaryDark),
    '--col-cta-light': hsl(c.surfaceMuted), '--col-foreground': hsl(c.surfaceDarkText),
    '--col-muted': hsl(c.textMuted), '--col-faint': hsl(c.textMuted),
    '--col-border': hsl(c.border), '--col-border-soft': hsl(c.borderLight),
    '--col-surface': hsl(c.surfaceDarkBg), '--col-bg': hsl(c.surfaceDarkBg),
    '--col-bg-alt': hsl(c.navBg), '--col-navy': hsl(c.surfaceDarkBg),
    '--col-navy-mid': hsl(c.navBg), '--col-navy-soft': hsl(c.surfaceDarkText),
    '--col-panel-ink': hsl(c.surfaceDarkText), '--col-panel-surface': hsl(c.navBg),
    '--col-panel-idle': hsl(c.surfaceMuted), '--col-panel-accent': hsl(c.primary),
    '--col-success': hsl(c.success), '--col-success-bg': hsl(c.surfaceMuted),
    '--col-danger': hsl(c.danger), '--col-danger-bg': hsl(c.surfaceMuted),
    '--col-warning': hsl(c.warning), '--col-info': hsl(c.primary),
    '--col-panel-bg-from': hsl(c.surfaceDarkBg), '--col-panel-bg-to': hsl(c.navBg),
    '--color-action': c.primary, '--color-brand': c.primary, '--color-brand-dark': c.primaryDark,
    '--color-background': c.surfaceDarkBg, '--color-bg-alt': c.navBg,
    '--color-surface': c.navBg, '--color-foreground': c.surfaceDarkText,
    '--color-muted': c.textMuted, '--color-faint': c.textMuted,
    '--color-border': c.border, '--color-border-soft': c.borderLight,
    '--color-navy': c.surfaceDarkBg, '--color-warning': c.warning,
    '--design-mist': c.surfaceDarkBg, '--design-ice': c.navBg,
    '--design-lilac': c.surfaceMuted, '--design-ink': c.surfaceDarkText,
    '--design-line': c.border, '--design-footer': c.footerBg,
    '--design-on-dark': c.footerFg, '--design-heading-dark': c.surfaceDarkHeading,
    '--design-muted-dark': c.surfaceDarkText,
    '--design-glass': `color-mix(in srgb, ${c.navBg} 85%, transparent)`,
    '--managed-nav-bg': c.surfaceDarkBg, '--managed-nav-fg': c.surfaceDarkText,
    '--pj-font-heading': themeFontStack(theme.typography.fontHeading), '--font-sans': themeFontStack(theme.typography.fontBody),
    '--radius': theme.radius,
  };
  const declarations = (vars: Record<string, string>) => Object.entries(vars).map(([key, value]) => `${key}:${value};`).join('');
  return `:root:not([data-theme="dark"]){${declarations(light)}}:root[data-theme="dark"]{${declarations(dark)}}`;
}
