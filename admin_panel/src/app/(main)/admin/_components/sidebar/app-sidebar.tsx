'use client';
import { APP_NAME } from '@/lib/app-brand';

// =============================================================
// FILE: src/app/(main)/admin/_components/sidebar/app-sidebar.tsx
// FINAL — RTK/Redux uyumlu (zustand yok)
// - NavMain: NavGroup[] alır (senin nav-main.tsx böyle)
// =============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Headset } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { buildAdminSidebarItems } from '@/navigation/sidebar/sidebar-items';
import type { NavGroup } from '@/navigation/sidebar/sidebar-items';
import type { AdminSidebarRole } from '@/navigation/sidebar/sidebar-items';

import { useAdminUiCopy } from '@/app/(main)/admin/_components/common/use-admin-ui-copy';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import type { TranslateFn } from '@/i18n';
import { normalizeMeFromStatus, cleanAppName } from '@/integrations/shared';

import { useMemo } from 'react';
import { NavMain } from './nav-main';
import { useAdminSettings } from '../admin-settings-provider';
import { useStatusQuery, useGetMyProfileQuery } from '@/integrations/hooks';

type Role = 'admin' | string;

type SidebarMe = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  roles?: Role[];
};

function hasRole(me: SidebarMe, role: Role) {
  if (me.role === role) return true;
  const rs = Array.isArray(me.roles) ? me.roles : [];
  return rs.includes(role);
}



export function AppSidebar({
  me,
  appName,
  variant,
  collapsible,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  me: SidebarMe;
  appName?: string;
}) {
  const { copy } = useAdminUiCopy();
  const pathname = usePathname() ?? '/admin/dashboard';
  const t = useAdminT();

  // Admin settings override for page titles
  const { pageMeta, branding } = useAdminSettings();
  const baseName = (copy.app_name || branding?.app_name || appName || '').trim();

  // ✅ Get real user data
  const { data: statusData } = useStatusQuery();
  const { data: profileData } = useGetMyProfileQuery();

  const currentUser = useMemo(() => {
    const s = statusData?.user;
    const statusMe = normalizeMeFromStatus(statusData as any);
    const statusRole = statusMe?.isAdmin ? 'admin' : (statusMe?.role || s?.role);
    return {
      id: s?.id || me?.id || 'me',
      name: profileData?.full_name || s?.email?.split('@')[0] || me?.name || 'Admin',
      email: s?.email || me?.email || 'admin',
      role: statusRole || me?.role || 'admin',
      avatar: profileData?.avatar_url || me?.avatar || '',
      roles: statusRole ? [statusRole] : (me?.roles || [me?.role || 'admin']),
    };
  }, [statusData, profileData, me]);

  const wrappedT: TranslateFn = (key, params, fallback) => {
    // Check pageMeta override for sidebar items.
    if (
      typeof key === 'string' &&
      (key.startsWith('admin.dashboard.items.') || key.startsWith('admin.sidebar.items.'))
    ) {
      const itemKey = key
        .replace('admin.dashboard.items.', '')
        .replace('admin.sidebar.items.', '');
      // Check if pageMeta has this key and a title
      if (pageMeta?.[itemKey]?.title) {
        return pageMeta[itemKey].title;
      }
    }
    return t(key, params, fallback);
  };

  // ✅ admin ise tüm menu, değilse sadece dashboard
  const sidebarRole: AdminSidebarRole = hasRole(currentUser as any, 'admin') ? 'admin' : 'seller';
  const groupsForMe: NavGroup[] = buildAdminSidebarItems(copy.nav, wrappedT, sidebarRole);
  const primaryUrls = ['/admin/dashboard', '/admin/ilanlar', '/admin/ilan-purchases', '/admin/payments', '/admin/users', '/admin/identity', '/admin/pages', '/admin/site-settings'];
  const allItems = groupsForMe.flatMap((group) => group.items);
  const primaryItems = primaryUrls.flatMap((url) => allItems.filter((item) => item.url === url));
  const secondaryGroups = groupsForMe.map((group) => ({ ...group, items: group.items.filter((item) => !primaryUrls.includes(item.url)) })).filter((group) => group.items.length > 0);
  // ✅ Clean app name for header
  const cleanedName = cleanAppName(baseName) || APP_NAME || 'Panel';
  const panelSub = sidebarRole === 'admin' 
    ? t('sidebar.adminPanel', undefined, 'Admin Panel') 
    : t('sidebar.carrierPanel', undefined, 'Taşıyıcı Panel');

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader className="admin-sidebar-header">
        <Link prefetch={false} href="/admin/dashboard" className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-icon">
            {branding?.logo_icon || branding?.logo ? (
              <img
                src={branding.logo_icon || branding.logo}
                alt={cleanedName}
                className="size-7 object-contain"
              />
            ) : (
              <span className="text-xs font-bold">
                {cleanedName.slice(0, 1)}
              </span>
            )}
          </div>
          <div className="admin-sidebar-brand-copy">
            <strong>{cleanedName}</strong>
            <small>{panelSub}</small>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="admin-sidebar-content">
        <NavMain items={[{ id: 0, items: primaryItems }]} showQuickCreate={false} />
        {secondaryGroups.length > 0 && <details key={pathname} open={secondaryGroups.some((group) => group.items.some((item) => pathname === item.url || pathname.startsWith(`${item.url}/`)))} className="admin-sidebar-more"><summary>Diğer yönetim <ChevronDown size={15} /></summary><NavMain items={secondaryGroups} showQuickCreate={false} /></details>}
      </SidebarContent>

      <SidebarFooter className="admin-sidebar-footer">
        {sidebarRole === 'admin' && <Link href="/admin/support" className="admin-sidebar-support"><Headset size={20} /><span><strong>Destek ekibi</strong><small>Talepleri ve yanıtları görüntüle</small></span><span className="admin-sidebar-support-cta">Destek taleplerini aç →</span></Link>}
      </SidebarFooter>
    </Sidebar>
  );
}
