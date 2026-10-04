import type { ThemeConfig } from './types';
import { DEFAULT_THEME } from './defaults';
import type { ThemeScope } from './schema';

const storefront: ThemeConfig = {
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    primary: '#542BD5', primaryDark: '#4221AD', accent: '#EEE9FF',
    background: '#F7F8FB', surfaceBase: '#F1F3F8', surfaceRaised: '#FFFFFF', surfaceMuted: '#F5F1FF',
    textStrong: '#101B38', textBody: '#62708A', textMuted: '#8791A5',
    border: '#D9DFEB', borderLight: '#E7EAF2',
    navBg: '#F7F8FF', navFg: '#101B38', footerBg: '#111B36', footerFg: '#F3F4FF',
    surfaceDarkBg: '#111B36', surfaceDarkText: '#E1E5F7', surfaceDarkHeading: '#A990FF',
  },
};

const admin: ThemeConfig = {
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    primary: '#542BD5', primaryDark: '#4221AD', accent: '#EEE9FF',
    background: '#F7F8FB', surfaceBase: '#F4F5F9', surfaceRaised: '#FFFFFF', surfaceMuted: '#F1EFFB',
    textStrong: '#101B38', textBody: '#34415F', textMuted: '#62708A',
    border: '#E1E5EE', borderLight: '#E8EBF2',
    navBg: '#111D39', navFg: '#F3F4FF', footerBg: '#111D39', footerFg: '#F3F4FF',
    surfaceDarkBg: '#111D39', surfaceDarkText: '#F3F4FF', surfaceDarkHeading: '#9D81FF',
  },
  radius: '0.75rem',
};

export const scopedThemeDefaults: Record<ThemeScope, ThemeConfig> = {
  storefront,
  'admin-panel': admin,
};
