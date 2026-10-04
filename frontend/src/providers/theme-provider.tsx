"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/theme";
import { ManagedStorefrontTheme } from './managed-storefront-theme';
import type { PublicTheme } from '@/lib/storefront-theme-css';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider> & { managedTheme?: PublicTheme | null };

export function ThemeProvider({ children, managedTheme, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={managedTheme?.enabled ? managedTheme.darkMode : DEFAULT_THEME}
      storageKey={THEME_STORAGE_KEY}
      enableSystem={false}
      {...props}
    >
      <ManagedStorefrontTheme />
      {children}
    </NextThemesProvider>
  );
}
