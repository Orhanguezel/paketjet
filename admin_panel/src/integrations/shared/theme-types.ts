// =============================================================
// FILE: src/integrations/shared/theme-types.ts
// =============================================================
import type { ThemeDarkMode, ThemeRadius } from "./theme-admin-types";

export type ColorTokens = {
  primary: string;
  primaryDark: string;
  accent: string;
  background: string;
  surfaceBase: string;
  surfaceRaised: string;
  surfaceMuted: string;
  border: string;
  borderLight: string;
  textStrong: string;
  textBody: string;
  textMuted: string;
  navBg: string;
  navFg: string;
  surfaceDarkBg: string;
  surfaceDarkHeading: string;
  surfaceDarkText: string;
  footerBg: string;
  footerFg: string;
  success: string;
  warning: string;
  danger: string;
};

export type ThemeTypography = {
  fontHeading: string;
  fontBody: string;
};

export type ThemeConfig = {
  colors: ColorTokens;
  typography: ThemeTypography;
  radius: ThemeRadius;
  darkMode: ThemeDarkMode;
};
export type ThemeScope = "storefront" | "admin-panel";
export type ScopedThemeConfig = ThemeConfig & { enabled: boolean };

export type ThemeUpdateInput = Partial<ThemeConfig>;

export const COLOR_TOKEN_LABELS: Record<keyof ColorTokens, { label: string; group: string }> = {
  primary: { label: "Ana renk", group: "Marka" },
  primaryDark: { label: "Vurgu / üzerine gelme", group: "Marka" },
  accent: { label: "Açık vurgu", group: "Marka" },
  success: { label: "Başarılı", group: "Durum" },
  warning: { label: "Uyarı", group: "Durum" },
  danger: { label: "Hata", group: "Durum" },
  background: { label: "Sayfa zemini", group: "Yüzeyler" },
  surfaceBase: { label: "İkincil zemin", group: "Yüzeyler" },
  surfaceRaised: { label: "Kart zemini", group: "Yüzeyler" },
  surfaceMuted: { label: "Soluk zemin", group: "Yüzeyler" },
  border: { label: "Kenarlık", group: "Yüzeyler" },
  borderLight: { label: "Hafif kenarlık", group: "Yüzeyler" },
  textStrong: { label: "Başlık metni", group: "Metin" },
  textBody: { label: "Gövde metni", group: "Metin" },
  textMuted: { label: "İkincil metin", group: "Metin" },
  navBg: { label: "Menü zemini", group: "Gezinme ve alt alan" },
  navFg: { label: "Menü metni", group: "Gezinme ve alt alan" },
  surfaceDarkBg: { label: "Koyu bölüm zemini", group: "Gezinme ve alt alan" },
  surfaceDarkHeading: { label: "Koyu bölüm başlığı", group: "Gezinme ve alt alan" },
  surfaceDarkText: { label: "Koyu bölüm metni", group: "Gezinme ve alt alan" },
  footerBg: { label: "Alt alan zemini", group: "Gezinme ve alt alan" },
  footerFg: { label: "Alt alan metni", group: "Gezinme ve alt alan" },
};

export const RADIUS_OPTIONS: Array<{ value: ThemeRadius; label: string }> = [
  { value: "0rem", label: "None" },
  { value: "0.3rem", label: "Small" },
  { value: "0.375rem", label: "Default" },
  { value: "0.5rem", label: "Medium" },
  { value: "0.75rem", label: "Large" },
  { value: "1rem", label: "XL" },
  { value: "1.5rem", label: "2XL" },
];
