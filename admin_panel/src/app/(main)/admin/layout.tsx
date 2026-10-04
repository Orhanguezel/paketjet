// =============================================================
// FILE: src/app/(main)/admin/layout.tsx
// FINAL — Admin Layout (NO SSR fetch) — Auth gate via RTK client guard
// =============================================================

import type { ReactNode } from 'react';

import { AppSidebar } from '@/app/(main)/admin/_components/sidebar/app-sidebar';

import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { AccountSwitcher } from './_components/sidebar/account-switcher';
import { AdminFooter } from './_components/sidebar/admin-footer';
import { AdminBrandTitle } from './_components/sidebar/admin-brand-title';
import { ThemeSwitcher } from './_components/sidebar/theme-switcher';
import { AdminPage } from '@/components/admin/admin-page';

import AdminAuthGate from './_components/admin-auth-gate';
import { AdminSettingsProvider } from './_components/admin-settings-provider';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AdminAuthGate>
      <AdminSettingsProvider>
        {/* Gate inside; when ok, render layout */}
        <SidebarProvider defaultOpen>
          <AppSidebar
            // variant/collapsible artık redux DOM-preferences ile client'ta yönetilecek
            // Sidebar komponentin prop zorunluluğu varsa default ver:
            variant="inset"
            collapsible="icon"
            me={{
              id: 'me',
              name: 'Admin',
              email: 'admin',
              role: 'admin',
              roles: ['admin'],
              avatar: '',
            }}
          />

          <SidebarInset
            className={cn(
              'admin-workspace flex min-w-0 flex-col',
            )}
          >
            <header
              className={cn(
                'sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 rounded-t-[inherit] border-b bg-background/95 backdrop-blur-md',
              )}
            >
              <div className="flex w-full items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-1 lg:gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                  />
                  <AdminBrandTitle />
                </div>

                <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  {/* AccountSwitcher me bilgisini AdminAuthGate hydrate edecek; burada placeholder */}
                  <AccountSwitcher me={{ id: 'me', email: 'admin', role: 'admin' }} />
                </div>
              </div>
            </header>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 min-w-0 overflow-auto p-4 md:p-6">
                <AdminPage>{children}</AdminPage>
              </div>
              <AdminFooter />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AdminSettingsProvider>
    </AdminAuthGate>
  );
}
