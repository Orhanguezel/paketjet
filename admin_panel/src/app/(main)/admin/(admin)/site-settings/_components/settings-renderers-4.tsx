'use client';
// =============================================================
// FILE: src/app/(main)/admin/(admin)/site-settings/_components/admin-site-settings-detail-client.tsx
// =============================================================
import * as React from 'react';
import { coerceSiteSettingsDetailValue } from '@/integrations/shared';
import { BusinessHoursStructuredForm, businessHoursFormToObj, businessHoursObjToForm, type BusinessHoursFormState } from '../tabs/structured/business-hours-structured-form';
import {type StructuredRenderProps} from './settings-renderers-1';
export const BusinessHoursStructuredRenderer: React.FC<StructuredRenderProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const base = React.useMemo(() => {
    const v = coerceSiteSettingsDetailValue(value);
    return Array.isArray(v) ? v : [];
  }, [value]);

  const seed = React.useMemo(
    () =>
      [
        { day: 'mon', open: '09:00', close: '18:00', closed: false },
        { day: 'tue', open: '09:00', close: '18:00', closed: false },
        { day: 'wed', open: '09:00', close: '18:00', closed: false },
        { day: 'thu', open: '09:00', close: '18:00', closed: false },
        { day: 'fri', open: '09:00', close: '18:00', closed: false },
        { day: 'sat', open: '10:00', close: '14:00', closed: false },
        { day: 'sun', open: '00:00', close: '00:00', closed: true },
      ] as any,
    [],
  );

  const [form, setForm] = React.useState<BusinessHoursFormState>(() =>
    businessHoursObjToForm(base, seed),
  );
  React.useEffect(() => setForm(businessHoursObjToForm(base, seed)), [base, seed]);

  const handleChange = (next: BusinessHoursFormState) => {
    setForm(next);
    setValue(businessHoursFormToObj(next));
  };

  return (
    <BusinessHoursStructuredForm
      value={form}
      onChange={handleChange}
      errors={{}}
      disabled={!!disabled}
      seed={seed}
    />
  );
};
