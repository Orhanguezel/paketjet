"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetScopedThemeQuery, useUpdateScopedThemeMutation } from "@/integrations/hooks";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { applyThemeMode } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { useAdminSettings } from "../admin-settings-provider";

export function ThemeSwitcher() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const { saveAdminConfig } = useAdminSettings();
  const { data: managedTheme } = useGetScopedThemeQuery("admin-panel");
  const [updateManagedTheme] = useUpdateScopedThemeMutation();

  const handleValueChange = async () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    applyThemeMode(newTheme);
    setThemeMode(newTheme);
    persistPreference("theme_mode", newTheme);
    if (managedTheme?.enabled) {
      try {
        await updateManagedTheme({ scope: "admin-panel", draft: { darkMode: newTheme } }).unwrap();
      } catch {
        applyThemeMode(themeMode);
        setThemeMode(themeMode);
      }
    } else saveAdminConfig();
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="admin-theme-button"
      aria-label={themeMode === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      onClick={handleValueChange}
    >
      {themeMode === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
