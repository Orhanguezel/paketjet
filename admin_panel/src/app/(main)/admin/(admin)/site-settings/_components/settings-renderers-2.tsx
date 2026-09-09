'use client';
// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/admin-site-settings-detail-client.tsx
// =============================================================
import * as React from 'react';
import { coerceSiteSettingsDetailValue } from '@/integrations/shared';
import { ContactInfoStructuredForm, contactFormToObj, contactObjToForm, type ContactInfoFormState } from '../tabs/structured/contact-info-structured-form';
import { SocialsStructuredForm, socialsFormToObj, socialsObjToForm, type SocialsFormState } from '../tabs/structured/socials-structured-form';
import { AppLocalesStructuredForm, appLocalesObjToForm, appLocalesFormToObj } from '../tabs/structured/app-locales-structured-form';
import {type StructuredRenderProps} from './settings-renderers-1';
export const AppLocalesStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const items = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value);
    return appLocalesObjToForm(Array.isArray(v) ? v : []);
  }, [value]);

  return (
    <AppLocalesStructuredForm
      value={items}
      onChange={(next) => setValue(appLocalesFormToObj(next))}
      disabled={!!disabled}
    />
  );
};
export const ContactStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const base = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value) ?? {};
    return typeof v === 'object' && v ? v : {};
  }, [value]);

  const seed = React.useMemo(
    () => ({ phone: '', email: '', address: '', whatsapp: '' }) as any,
    [],
  );
  const [form, setForm] = React.useState<ContactInfoFormState>(() => contactObjToForm(base, seed));

  React.useEffect(() => setForm(contactObjToForm(base, seed)), [base, seed]);

  const handleChange = (next: ContactInfoFormState) => {
    setForm(next);
    setValue(contactFormToObj(next));
  };

  return (
    <ContactInfoStructuredForm
      value={form}
      onChange={handleChange}
      errors={{}}
      disabled={!!disabled}
      seed={seed}
    />
  );
};
export const SocialsStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const base = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value) ?? {};
    return typeof v === 'object' && v ? v : {};
  }, [value]);

  const seed = React.useMemo(
    () => ({ instagram: '', facebook: '', linkedin: '', youtube: '', x: '' }) as any,
    [],
  );
  const [form, setForm] = React.useState<SocialsFormState>(() => socialsObjToForm(base, seed));

  React.useEffect(() => setForm(socialsObjToForm(base, seed)), [base, seed]);

  const handleChange = (next: SocialsFormState) => {
    setForm(next);
    setValue(socialsFormToObj(next));
  };

  return (
    <SocialsStructuredForm
      value={form}
      onChange={handleChange}
      errors={{}}
      disabled={!!disabled}
      seed={seed}
    />
  );
};
