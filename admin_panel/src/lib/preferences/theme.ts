// src/lib/preferences/theme.ts

export const THEME_MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((o) => o.value);
export type ThemeMode = (typeof THEME_MODE_VALUES)[number];

export const THEME_PRESET_OPTIONS = [{ label: "Default", value: "default" }] as const;
export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((preset) => preset.value);
export type ThemePreset = "default";
