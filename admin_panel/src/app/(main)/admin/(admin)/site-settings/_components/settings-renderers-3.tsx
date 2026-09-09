'use client';
// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/admin-site-settings-detail-client.tsx
// =============================================================
import * as React from 'react';
import { coerceSiteSettingsDetailValue } from '@/integrations/shared';
import { CompanyProfileStructuredForm, companyFormToObj, companyObjToForm, type CompanyProfileFormState } from '../tabs/structured/company-profile-structured-form';
import { UiHeaderStructuredForm, uiHeaderFormToObj, uiHeaderObjToForm, type UiHeaderFormState } from '../tabs/structured/ui-header-structured-form';
import {type StructuredRenderProps} from './settings-renderers-1';
export const CompanyStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const base = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value) ?? {};
    return typeof v === 'object' && v ? v : {};
  }, [value]);

  const seed = React.useMemo(
    () => ({ company_name: 'guezelwebdesign', slogan: '', about: '' }) as any,
    [],
  );

  const [form, setForm] = React.useState<CompanyProfileFormState>(() =>
    companyObjToForm(base, seed),
  );
  React.useEffect(() => setForm(companyObjToForm(base, seed)), [base, seed]);

  const handleChange = (next: CompanyProfileFormState) => {
    setForm(next);
    setValue(companyFormToObj(next));
  };

  return (
    <CompanyProfileStructuredForm
      value={form}
      onChange={handleChange}
      errors={{}}
      disabled={!!disabled}
      seed={seed}
    />
  );
};
export const UiHeaderStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const base = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value) ?? {};
    return typeof v === 'object' && v ? v : {};
  }, [value]);

  const seed = React.useMemo(
    () =>
      ({
        nav_home: 'Home',
        nav_products: 'Products',
        nav_services: 'Services',
        nav_contact: 'Contact',
        cta_label: 'Get Offer',
      }) as any,
    [],
  );

  const [form, setForm] = React.useState<UiHeaderFormState>(() => uiHeaderObjToForm(base, seed));
  React.useEffect(() => setForm(uiHeaderObjToForm(base, seed)), [base, seed]);

  const handleChange = (next: UiHeaderFormState) => {
    setForm(next);
    setValue(uiHeaderFormToObj(next));
  };

  return (
    <UiHeaderStructuredForm
      value={form}
      onChange={handleChange}
      errors={{}}
      disabled={!!disabled}
      seed={seed}
    />
  );
};
