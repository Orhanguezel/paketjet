import type { ScopedThemeConfig } from "@/integrations/shared/theme-types";

export function themeFontStack(value: string) {
  const font = value.trim().toLowerCase();
  if (font.startsWith("dm sans")) return "var(--font-dm-sans), system-ui, sans-serif";
  if (font === "georgia, serif") return "Georgia, serif";
  return "system-ui, sans-serif";
}

function foregroundFor(hex: string, light: string, dark: string) {
  const [r, g, b] = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? dark : light;
}

function validTheme(theme: ScopedThemeConfig) {
  return Object.values(theme.colors).every((value) => /^#[0-9a-fA-F]{6}$/.test(value))
    && /^[\w\s,'".-]{1,200}$/.test(theme.typography.fontBody)
    && /^[\w\s,'".-]{1,200}$/.test(theme.typography.fontHeading)
    && ["0rem", "0.3rem", "0.375rem", "0.5rem", "0.75rem", "1rem", "1.5rem"].includes(theme.radius);
}

function adminThemeVars(theme: ScopedThemeConfig, dark: boolean): Record<string, string> {
  const color = theme.colors;
  const onPrimary = foregroundFor(color.primary, color.surfaceRaised, color.textStrong);
  const chart = {
    "--chart-1": color.primary,
    "--chart-2": color.primaryDark,
    "--chart-3": color.success,
    "--chart-4": color.warning,
    "--chart-5": color.danger,
  };
  const vars: Record<string, string> = dark
    ? {
        "--primary": `color-mix(in srgb, ${color.primary} 55%, ${color.surfaceRaised})`,
        "--primary-foreground": color.surfaceDarkBg,
        "--ring": color.primary,
        "--background": color.surfaceDarkBg,
        "--foreground": color.surfaceDarkText,
        "--card": `color-mix(in srgb, ${color.surfaceDarkBg} 90%, ${color.surfaceDarkText})`,
        "--card-foreground": color.surfaceDarkText,
        "--popover": `color-mix(in srgb, ${color.surfaceDarkBg} 90%, ${color.surfaceDarkText})`,
        "--popover-foreground": color.surfaceDarkText,
        "--muted": `color-mix(in srgb, ${color.surfaceDarkBg} 80%, ${color.surfaceDarkText})`,
        "--muted-foreground": `color-mix(in srgb, ${color.surfaceDarkText} 70%, ${color.surfaceDarkBg})`,
        "--secondary": `color-mix(in srgb, ${color.surfaceDarkBg} 75%, ${color.surfaceDarkHeading})`,
        "--secondary-foreground": color.surfaceDarkText,
        "--accent": `color-mix(in srgb, ${color.surfaceDarkBg} 78%, ${color.accent})`,
        "--accent-foreground": color.surfaceDarkHeading,
        "--border": `color-mix(in srgb, ${color.surfaceDarkBg} 68%, ${color.surfaceDarkText})`,
        "--input": `color-mix(in srgb, ${color.surfaceDarkBg} 60%, ${color.surfaceDarkText})`,
        "--sidebar": color.surfaceDarkBg,
        "--sidebar-foreground": color.surfaceDarkText,
        "--sidebar-primary": color.primary,
        "--sidebar-primary-foreground": onPrimary,
        "--sidebar-accent": `color-mix(in srgb, ${color.surfaceDarkBg} 75%, ${color.surfaceDarkHeading})`,
        "--sidebar-accent-foreground": color.surfaceDarkText,
        "--sidebar-border": `color-mix(in srgb, ${color.surfaceDarkBg} 72%, ${color.surfaceDarkText})`,
        "--sidebar-ring": color.primary,
        "--destructive": color.danger,
        "--radius": theme.radius,
      }
    : {
        "--primary": color.primary,
        "--primary-foreground": onPrimary,
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
        "--secondary-foreground": color.textStrong,
        "--accent": color.accent,
        "--accent-foreground": color.primaryDark,
        "--border": color.border,
        "--input": color.borderLight,
        "--sidebar": color.navBg,
        "--sidebar-foreground": color.navFg,
        "--sidebar-primary": color.primary,
        "--sidebar-primary-foreground": onPrimary,
        "--sidebar-accent": color.surfaceDarkBg,
        "--sidebar-accent-foreground": color.surfaceDarkText,
        "--sidebar-border": color.border,
        "--sidebar-ring": color.primary,
        "--destructive": color.danger,
        "--radius": theme.radius,
      };
  Object.assign(vars, chart);
  vars["--success"] = color.success;
  vars["--warning"] = color.warning;
  vars["--danger"] = color.danger;
  vars["--preview-light-bg"] = color.surfaceRaised;
  vars["--preview-light-fg"] = color.textStrong;
  vars["--preview-dark-bg"] = color.surfaceDarkBg;
  vars["--preview-dark-fg"] = color.surfaceDarkText;
  vars["--font-sans"] = themeFontStack(theme.typography.fontBody);
  vars["--pj-font-heading"] = themeFontStack(theme.typography.fontHeading);
  return vars;
}

export function managedAdminThemeCss(theme: ScopedThemeConfig) {
  if (!theme.enabled || !validTheme(theme)) return "";
  const declarations = (vars: Record<string, string>) =>
    Object.entries(vars).map(([key, value]) => `${key}:${value};`).join("");
  return `html:root{${declarations(adminThemeVars(theme, false))}}html:root.dark{${declarations(adminThemeVars(theme, true))}}`;
}

export function applyManagedAdminTheme(theme: ScopedThemeConfig) {
  if (typeof document === "undefined") return;
  const css = managedAdminThemeCss(theme);
  const old = document.getElementById("managed-admin-theme");
  if (old?.textContent === css) return;
  old?.remove();
  if (!css) return;
  const style = document.createElement("style");
  style.id = "managed-admin-theme";
  style.textContent = css;
  document.head.append(style);
}
