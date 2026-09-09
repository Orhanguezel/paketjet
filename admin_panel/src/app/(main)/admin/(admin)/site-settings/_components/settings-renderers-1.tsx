'use client';
// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/admin-site-settings-detail-client.tsx
// =============================================================
import * as React from 'react';
import { Input } from '@/components/ui/input';
import type { SettingValue } from '@/integrations/shared';
import { coerceSiteSettingsDetailValue } from '@/integrations/shared';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';
import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/admin-json-editor';
import { SeoStructuredForm } from '../tabs/structured/seo-structured-form';
import { SeoPagesStructuredForm, seoPagesObjToForm, seoPagesFormToObj } from '../tabs/structured/seo-pages-structured-form';
import { HeroStructuredForm, heroObjToForm, heroFormToObj } from '../tabs/structured/hero-structured-form';
import { BackgroundsStructuredForm, type BackgroundItem } from '../tabs/structured/home-backgrounds-structured-form';
export type StructuredRenderProps = {
  value: SettingValue;
  setValue: (next: any) => void;
  disabled?: boolean;
  settingKey: string;
  locale: string;
};
export const JsonStructuredRenderer: React.FC<StructuredRenderProps> = ({ value, setValue, disabled }) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const v = coerceSiteSettingsDetailValue(value ?? {});

  // Plain string values (e.g. email, phone, URL) — render a simple text input
  // so the user doesn't need to type JSON quotes
  if (typeof v === 'string') {
    return (
      <div className="space-y-3">
        <div className="rounded-md border p-3 text-sm text-muted-foreground">
          {t('admin.siteSettings.detail.structuredJson.noRenderer')}
        </div>
        <Input
          value={v}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="font-mono"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3 text-sm text-muted-foreground">
        {t('admin.siteSettings.detail.structuredJson.noRenderer')}
      </div>

      <AdminJsonEditor
        label={t('admin.siteSettings.detail.structuredJson.label')}
        value={v ?? {}}
        onChange={(next) => setValue(next)}
        disabled={disabled}
        helperText={t('admin.siteSettings.detail.structuredJson.helperText')}
        height={340}
      />
    </div>
  );
};
export const SeoStructuredRenderer: React.FC<StructuredRenderProps> = (p) => (
  <SeoStructuredForm
    settingKey={p.settingKey}
    locale={p.locale}
    value={p.value}
    setValue={p.setValue}
    disabled={p.disabled}
  />
);
export const HeroStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const data = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value);
    return heroObjToForm(v && typeof v === "object" ? v : {});
  }, [value]);

  return (
    <HeroStructuredForm
      value={data}
      onChange={(next) => setValue(heroFormToObj(next))}
      disabled={!!disabled}
    />
  );
};
export const BackgroundsStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const data = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value);
    return (Array.isArray(v) ? v : []) as BackgroundItem[];
  }, [value]);

  return (
    <BackgroundsStructuredForm
      value={data}
      onChange={(next) => setValue(next)}
      disabled={!!disabled}
    />
  );
};
export const SeoPagesStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const data = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value);
    return seoPagesObjToForm(v && typeof v === 'object' ? v : {});
  }, [value]);

  return (
    <SeoPagesStructuredForm
      value={data}
      onChange={(next) => setValue(seoPagesFormToObj(next))}
      disabled={!!disabled}
    />
  );
};
