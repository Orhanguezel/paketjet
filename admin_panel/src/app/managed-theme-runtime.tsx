"use client";

import { useEffect } from "react";

import type { ScopedThemeConfig } from "@/integrations/shared/theme-types";
import { applyManagedAdminTheme } from "@/lib/managed-admin-theme";

export function ManagedThemeRuntime() {
  useEffect(() => {
    let current: ScopedThemeConfig | null = null;
    let closed = false;
    async function refresh() {
      try {
        const response = await fetch("/api/theme/admin-panel", { cache: "no-store" });
        if (!response.ok || closed) return;
        current = (await response.json()) as ScopedThemeConfig;
        applyManagedAdminTheme(current);
      } catch {
        /* Keep the existing panel theme if the public theme API is unavailable. */
      }
    }
    const observer = new MutationObserver(() => {
      if (current) applyManagedAdminTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    void refresh();
    window.addEventListener("focus", refresh);
    return () => {
      closed = true;
      observer.disconnect();
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return null;
}
