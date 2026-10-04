import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";

import type { ThemeDarkMode } from "@/integrations/shared/theme-admin-types";
import type { ColorTokens, ThemeConfig } from "@/integrations/shared/theme-types";
import { COLOR_TOKEN_LABELS, DEFAULT_THEME_CONFIG } from "@/integrations/shared/theme-types";

export const THEME_FONT_HEADING_PLACEHOLDER = "Syne, system-ui, sans-serif";
export const THEME_FONT_BODY_PLACEHOLDER = "DM Sans, system-ui, sans-serif";
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

export function toThemeDraft(theme: Partial<ThemeConfig> | null | undefined): ThemeConfig {
  return {
    colors: { ...DEFAULT_THEME_CONFIG.colors, ...(theme?.colors ?? {}) },
    typography: { ...DEFAULT_THEME_CONFIG.typography, ...(theme?.typography ?? {}) },
    radius: theme?.radius || DEFAULT_THEME_CONFIG.radius,
    darkMode: theme?.darkMode || DEFAULT_THEME_CONFIG.darkMode,
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
