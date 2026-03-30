// =============================================================
// FILE: brand-media-tab.tsx
// Logo & Favicon yönetimi
// =============================================================

'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import {
  useGetSiteSettingAdminByKeyQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';
import {
  SITE_SETTINGS_BRAND_MEDIA_ITEMS,
  type SiteSettingsBrandMediaData,
  buildSiteSettingsBrandMediaLegacyValue,
  extractSiteSettingsBrandMediaData,
  getSiteSettingsBrandMediaErrorMessage,
  mergeSiteSettingsBrandingConfig,
  normalizeSiteSettingsBrandingConfig,
} from '@/integrations/shared';

import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/admin-image-upload-field';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, RefreshCcw, Copy, ExternalLink } from 'lucide-react';

/* ── component ── */

export type BrandMediaTabProps = {
  locale: string;
  settingPrefix?: string;
};

type AdminBrandMediaData = {
  logo: string;
  logo_dark: string;
  logo_icon: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
};

export const BrandMediaTab: React.FC<BrandMediaTabProps> = ({ locale, settingPrefix }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const fullKey = `${settingPrefix || ''}site_logo`;
  const logoAlt = t('admin.siteSettings.brandMedia.inline.logoAlt');

  const { data, isLoading, isFetching, refetch } = useGetSiteSettingAdminByKeyQuery(
    { key: fullKey, locale: '*' },
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: adminConfigData,
    isLoading: isAdminConfigLoading,
    isFetching: isAdminConfigFetching,
    refetch: refetchAdminConfig,
  } = useGetSiteSettingAdminByKeyQuery(
    { key: 'ui_admin_config', locale: '*' },
    { refetchOnMountOrArgChange: true },
  );

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const busy = isLoading || isFetching || isAdminConfigLoading || isAdminConfigFetching || isSaving;

  const serverData = useMemo(() => extractSiteSettingsBrandMediaData(data, logoAlt), [data, logoAlt]);
  const [localData, setLocalData] = useState<SiteSettingsBrandMediaData | null>(null);

  React.useEffect(() => {
    if (data) setLocalData(extractSiteSettingsBrandMediaData(data, logoAlt));
  }, [data, logoAlt]);

  const current = localData ?? serverData;
  const serverAdminMedia = useMemo<AdminBrandMediaData>(() => {
    const branding = normalizeSiteSettingsBrandingConfig(adminConfigData);
    return {
      logo: branding.logo || '',
      logo_dark: branding.logo_dark || '',
      logo_icon: branding.logo_icon || '',
      favicon_16: branding.favicon_16 || '',
      favicon_32: branding.favicon_32 || '',
      apple_touch_icon: branding.apple_touch_icon || '',
    };
  }, [adminConfigData]);
  const [localAdminMedia, setLocalAdminMedia] = useState<AdminBrandMediaData | null>(null);

  React.useEffect(() => {
    if (adminConfigData) setLocalAdminMedia(serverAdminMedia);
  }, [adminConfigData, serverAdminMedia]);

  const currentAdminMedia = localAdminMedia ?? serverAdminMedia;

  const updateField = (field: keyof SiteSettingsBrandMediaData, value: string) => {
    setLocalData((prev) => ({ ...(prev ?? serverData), [field]: value }));
  };
  const updateAdminMediaField = (field: keyof AdminBrandMediaData, value: string) => {
    setLocalAdminMedia((prev) => ({ ...(prev ?? serverAdminMedia), [field]: value }));
  };

  const handleSave = async () => {
    if (!localData) return;
    try {
      await updateSetting({ key: fullKey, locale: '*', value: localData as any }).unwrap();
      // Also update legacy 'logo' key for backward compat
      const legacyKey = `${settingPrefix || ''}logo`;
      await updateSetting({
        key: legacyKey,
        locale: '*',
        value: buildSiteSettingsBrandMediaLegacyValue(localData) as any,
      }).unwrap();
      toast.success(t('admin.siteSettings.brandMedia.inline.saved'));
      await refetch();
    } catch (err: unknown) {
      toast.error(getSiteSettingsBrandMediaErrorMessage(err, t('admin.siteSettings.brandMedia.inline.saveError')));
    }
  };
  const handleSaveAdminMedia = async () => {
    if (!localAdminMedia) return;

    try {
      const branding = normalizeSiteSettingsBrandingConfig(adminConfigData);
      const merged = mergeSiteSettingsBrandingConfig(adminConfigData, {
        ...branding,
        ...localAdminMedia,
      });
      await updateSetting({ key: 'ui_admin_config', locale: '*', value: merged as any }).unwrap();
      toast.success(t('admin.siteSettings.brandMedia.inline.admin.saved'));
      await refetchAdminConfig();
    } catch (err: unknown) {
      toast.error(
        getSiteSettingsBrandMediaErrorMessage(err, t('admin.siteSettings.brandMedia.inline.admin.saveError')),
      );
    }
  };

  const isDirty = localData && JSON.stringify(localData) !== JSON.stringify(serverData);
  const isAdminDirty =
    localAdminMedia && JSON.stringify(localAdminMedia) !== JSON.stringify(serverAdminMedia);
  const adminMediaItems: Array<{ key: keyof AdminBrandMediaData; label: string }> = [
    { key: 'logo', label: t('admin.siteSettings.brandMedia.inline.admin.labels.logo') },
    { key: 'logo_dark', label: t('admin.siteSettings.brandMedia.inline.admin.labels.logoDark') },
    { key: 'logo_icon', label: t('admin.siteSettings.brandMedia.inline.admin.labels.logoIcon') },
    { key: 'favicon_16', label: t('admin.siteSettings.brandMedia.inline.admin.labels.favicon16') },
    { key: 'favicon_32', label: t('admin.siteSettings.brandMedia.inline.admin.labels.favicon32') },
    { key: 'apple_touch_icon', label: t('admin.siteSettings.brandMedia.inline.admin.labels.appleTouchIcon') },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{t('admin.siteSettings.brandMedia.inline.title')}</CardTitle>
            <div className="flex items-center gap-2">
              {busy && <Badge variant="outline">{t('admin.siteSettings.brandMedia.inline.loading')}</Badge>}
              {isDirty && <Badge variant="default">{t('admin.siteSettings.brandMedia.inline.dirty')}</Badge>}
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={busy || !isDirty}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                {t('admin.siteSettings.brandMedia.inline.save')}
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => refetch()} disabled={busy}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SITE_SETTINGS_BRAND_MEDIA_ITEMS.map((m) => {
              const value = current[m.field];
              const label = t(`admin.siteSettings.brandMedia.inline.labels.${m.labelKey}`);

              return (
                <div key={m.field} className="rounded-md border p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{label}</span>
                    {value && (
                      <button
                        type="button"
                        className="text-[10px] text-destructive hover:underline"
                        onClick={() => updateField(m.field, '')}
                        disabled={busy}
                      >
                        {t('admin.siteSettings.brandMedia.inline.remove')}
                      </button>
                    )}
                  </div>

                  {value ? (
                    <div className="relative aspect-square w-full max-w-30 mx-auto overflow-hidden rounded border bg-muted/20">
                      <img
                        src={value}
                        alt={label}
                        className="h-full w-full object-contain p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full max-w-30 mx-auto items-center justify-center rounded border bg-muted/20">
                      <span className="text-[10px] text-muted-foreground">{t('admin.siteSettings.brandMedia.inline.noImage')}</span>
                    </div>
                  )}

                  <AdminImageUploadField
                    label=""
                    bucket="public"
                    folder={m.folder}
                    metadata={{ field: m.field, scope: 'logo' }}
                    value={value || ''}
                    onChange={(url) => updateField(m.field, url)}
                    disabled={busy}
                    openLibraryHref="/admin/storage"
                    previewAspect="1x1"
                    previewObjectFit="contain"
                  />

                  {value && (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        readOnly
                        value={value}
                        className="flex-1 truncate rounded border bg-muted/30 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        type="button"
                        className="shrink-0 rounded p-0.5 hover:bg-muted"
                        title={t('admin.siteSettings.brandMedia.inline.copy')}
                        onClick={() => { navigator.clipboard.writeText(value); toast.success(t('admin.siteSettings.brandMedia.inline.urlCopied')); }}
                      >
                        <Copy className="size-3 text-muted-foreground" />
                      </button>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded p-0.5 hover:bg-muted"
                        title={t('admin.siteSettings.brandMedia.inline.openNewTab')}
                      >
                        <ExternalLink className="size-3 text-muted-foreground" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isDirty && (
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={handleSave} disabled={busy}>
                <Save className="mr-2 h-3.5 w-3.5" />
                {t('admin.siteSettings.brandMedia.inline.save')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">
              {t('admin.siteSettings.brandMedia.inline.admin.title')}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isAdminDirty ? (
                <Badge variant="default">{t('admin.siteSettings.brandMedia.inline.dirty')}</Badge>
              ) : null}
              <Button
                type="button"
                size="sm"
                onClick={handleSaveAdminMedia}
                disabled={busy || !isAdminDirty}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                {t('admin.siteSettings.brandMedia.inline.save')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => refetchAdminConfig()}
                disabled={busy}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t('admin.siteSettings.brandMedia.inline.admin.description')}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {adminMediaItems.map((item) => {
              const value = currentAdminMedia[item.key];
              return (
                <div key={item.key} className="rounded-md border p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{item.label}</span>
                    {value ? (
                      <button
                        type="button"
                        className="text-[10px] text-destructive hover:underline"
                        onClick={() => updateAdminMediaField(item.key, '')}
                        disabled={busy}
                      >
                        {t('admin.siteSettings.brandMedia.inline.remove')}
                      </button>
                    ) : null}
                  </div>
                  <AdminImageUploadField
                    label=""
                    bucket="public"
                    folder="logo"
                    metadata={{ field: item.key, scope: 'admin-branding' }}
                    value={value}
                    onChange={(url) => updateAdminMediaField(item.key, url)}
                    disabled={busy}
                    openLibraryHref="/admin/storage"
                    previewAspect="1x1"
                    previewObjectFit="contain"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

BrandMediaTab.displayName = 'BrandMediaTab';
