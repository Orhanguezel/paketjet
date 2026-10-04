import type { ScopedThemeConfig } from "@/integrations/shared/theme-types";

const managedProperties = [
  "--primary",
  "--primary-foreground",
  "--ring",
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--secondary",
  "--accent",
  "--border",
  "--input",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--destructive",
  "--radius",
] as const;

function foregroundFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "#101b38" : "#ffffff";
}

export function applyManagedAdminTheme(theme: ScopedThemeConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const property of managedProperties) root.style.removeProperty(property);
  document.body.style.removeProperty("--font-sans");
  root.style.removeProperty("--pj-font-heading");
  if (!theme.enabled) return;
  const color = theme.colors;
  const dark = root.classList.contains("dark");
  const vars: Record<string, string> = dark
    ? {
        "--primary": `color-mix(in srgb, ${color.primary} 45%, white)`,
        "--primary-foreground": "#101b38",
        "--ring": color.primary,
        "--background": `color-mix(in srgb, ${color.background} 5%, #0e1422)`,
        "--foreground": "#f4f5fa",
        "--card": `color-mix(in srgb, ${color.surfaceRaised} 7%, #171f30)`,
        "--card-foreground": "#f4f5fa",
        "--popover": "#171f30",
        "--popover-foreground": "#f4f5fa",
        "--muted": "#202a3d",
        "--muted-foreground": "#aeb9d0",
        "--secondary": "#252a40",
        "--accent": `color-mix(in srgb, ${color.accent} 12%, #302550)`,
        "--border": "#33405b",
        "--input": "#3a4760",
        "--sidebar": `color-mix(in srgb, ${color.navBg} 8%, #0a1020)`,
        "--sidebar-foreground": "#f3f4ff",
        "--sidebar-primary": color.primary,
        "--sidebar-primary-foreground": foregroundFor(color.primary),
        "--sidebar-accent": "#202d4d",
        "--sidebar-accent-foreground": "#f3f4ff",
        "--sidebar-border": "#263556",
        "--sidebar-ring": color.primary,
        "--destructive": color.danger,
        "--radius": theme.radius,
      }
    : {
        "--primary": color.primary,
        "--primary-foreground": foregroundFor(color.primary),
        "--ring": color.primary,
        "--background": color.background,
        "--foreground": color.textStrong,
        "--card": color.surfaceRaised,
        "--card-foreground": color.textStrong,
        "--popover": color.surfaceRaised,
        "--popover-foreground": color.textStrong,
        "--muted": color.surfaceBase,
        "--muted-foreground": color.textMuted,
        "--secondary": color.surfaceMuted,
        "--accent": color.accent,
        "--border": color.border,
        "--input": color.borderLight,
        "--sidebar": color.navBg,
        "--sidebar-foreground": color.navFg,
        "--sidebar-primary": color.primary,
        "--sidebar-primary-foreground": foregroundFor(color.primary),
        "--sidebar-accent": color.surfaceDarkBg,
        "--sidebar-accent-foreground": color.surfaceDarkText,
        "--sidebar-border": color.border,
        "--sidebar-ring": color.primary,
        "--destructive": color.danger,
        "--radius": theme.radius,
      };
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  document.body.style.setProperty("--font-sans", theme.typography.fontBody);
  root.style.setProperty("--pj-font-heading", theme.typography.fontHeading);
}
