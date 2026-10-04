import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";

import type { ThemeDarkMode } from "@/integrations/shared/theme-admin-types";
import type { ColorTokens, ThemeConfig } from "@/integrations/shared/theme-types";
import { COLOR_TOKEN_LABELS } from "@/integrations/shared/theme-types";

export const THEME_FONT_HEADING_PLACEHOLDER = "DM Sans, system-ui, sans-serif";
export const THEME_FONT_BODY_PLACEHOLDER = "DM Sans, system-ui, sans-serif";
export const THEME_FONT_OPTIONS = [
  { value: "DM Sans, system-ui, sans-serif", label: "DM Sans" },
  { value: "system-ui, sans-serif", label: "Sistem yazı tipi" },
  { value: "Georgia, serif", label: "Georgia" },
] as const;
const supportedFont = (value: string) => value.startsWith("DM Sans")
  ? THEME_FONT_OPTIONS[0].value
  : THEME_FONT_OPTIONS.find((option) => option.value === value)?.value ?? THEME_FONT_OPTIONS[0].value;
export const THEME_COLOR_HEX_PLACEHOLDER = "#000000";
export const THEME_RADIUS_PREVIEW_SIZES = ["sm", "md", "lg"] as const;

export type ThemeDarkModeOption = {
  value: ThemeDarkMode;
  icon: LucideIcon;
  labelKey: "darkModeLight" | "darkModeDark" | "darkModeSystem";
};

export const THEME_DARK_MODE_OPTIONS: ThemeDarkModeOption[] = [
  { value: "light", icon: Sun, labelKey: "darkModeLight" },
  { value: "dark", icon: Moon, labelKey: "darkModeDark" },
  { value: "system", icon: Monitor, labelKey: "darkModeSystem" },
];

export function toThemeDraft(theme: ThemeConfig): ThemeConfig {
  return {
    colors: { ...theme.colors },
    typography: {
      fontHeading: supportedFont(theme.typography.fontHeading),
      fontBody: supportedFont(theme.typography.fontBody),
    },
    radius: theme.radius,
    darkMode: theme.darkMode,
  };
}

export function groupThemeColorTokens(): Map<string, Array<keyof ColorTokens>> {
  const groups = new Map<string, Array<keyof ColorTokens>>();

  for (const [key, meta] of Object.entries(COLOR_TOKEN_LABELS)) {
    const group = meta.group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)?.push(key as keyof ColorTokens);
  }

  return groups;
}
