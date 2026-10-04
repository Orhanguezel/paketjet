"use client";

import { useEffect } from "react";

import type { ScopedThemeConfig } from "@/integrations/shared/theme-types";
import { applyManagedAdminTheme } from "@/lib/managed-admin-theme";

export function ManagedThemeRuntime() {
  useEffect(() => {
    let closed = false;
    async function refresh() {
      try {
        const response = await fetch("/api/theme/admin-panel", { cache: "no-store" });
        if (!response.ok || closed) return;
        applyManagedAdminTheme((await response.json()) as ScopedThemeConfig);
      } catch {
        /* Keep the existing panel theme if the public theme API is unavailable. */
      }
    }
    void refresh();
    window.addEventListener("focus", refresh);
    return () => {
      closed = true;
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return null;
}
