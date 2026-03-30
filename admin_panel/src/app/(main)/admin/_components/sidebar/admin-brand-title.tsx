'use client';

import { useStatusQuery } from '@/integrations/hooks';
import { normalizeMeFromStatus, cleanAppName } from '@/integrations/shared';
import { useAdminSettings } from '../admin-settings-provider';

import { useAdminT } from '../common/use-admin-t';

export function AdminBrandTitle() {
  const { branding } = useAdminSettings();
  const statusQ = useStatusQuery();
  const t = useAdminT();
  const me = normalizeMeFromStatus(statusQ.data as any);
  const isAdmin = me?.isAdmin === true;
  const appName = branding?.app_name || '';
  const cleanedName = cleanAppName(appName) || 'PaketJet';
  const panelType = isAdmin 
    ? t('sidebar.adminPanel', undefined, 'Admin') 
    : t('sidebar.carrierPanel', undefined, 'Taşıyıcı');

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-semibold tracking-tight hidden sm:block text-foreground">
        {cleanedName}
      </h2>
      <span className="text-[10px] bg-sidebar-accent/50 text-muted-foreground px-1.5 py-0.5 rounded border border-border font-medium uppercase tracking-widest">
        {panelType}
      </span>
    </div>
  );
}
