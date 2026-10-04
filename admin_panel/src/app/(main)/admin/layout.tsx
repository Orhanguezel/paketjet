// =============================================================
// FILE: src/app/(main)/admin/layout.tsx
// FINAL — Admin Layout (NO SSR fetch) — Auth gate via RTK client guard
// =============================================================

import type { ReactNode } from 'react';

import { AppSidebar } from '@/app/(main)/admin/_components/sidebar/app-sidebar';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { AdminFooter } from './_components/sidebar/admin-footer';
import { AdminPage } from '@/components/admin/admin-page';
import { AdminTopbar } from './_components/admin-topbar';

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
            <AdminTopbar />

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
