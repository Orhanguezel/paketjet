'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { defaultBankDetails, type BankDetails } from '@/integrations/shared';
import {
  useGetSiteSettingAdminByKeyQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function BankDetailsCard() {
  const t = useAdminT('admin.payment-settings.bank');

  const bankQ = useGetSiteSettingAdminByKeyQuery({ key: 'bank_details', locale: 'tr' });
  const [updateSetting, updateState] = useUpdateSiteSettingAdminMutation();

  const [form, setForm] = React.useState<BankDetails>(defaultBankDetails());

  React.useEffect(() => {
    if (!bankQ.data) return;
    try {
      const row = bankQ.data as { value?: string };
      if (row.value) {
        const parsed = JSON.parse(row.value) as BankDetails;
        setForm({
          iban: parsed.iban ?? '',
          account_name: parsed.account_name ?? '',
          bank_name: parsed.bank_name ?? '',
          description: parsed.description ?? '',
        });
      }
    } catch {
      // keep defaults
    }
  }, [bankQ.data]);

  async function handleSave() {
    try {
      await updateSetting({
        key: 'bank_details',
        locale: 'tr',
        value: JSON.stringify(form),
      }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('errorFallback'));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankQ.isError ? (
          <p className="text-sm text-destructive">{t('loadError')}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('ibanLabel')}</Label>
            <Input
              value={form.iban}
              onChange={(e) => setForm({ ...form, iban: e.target.value })}
              placeholder={t('ibanPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('accountNameLabel')}</Label>
            <Input
              value={form.account_name}
              onChange={(e) => setForm({ ...form, account_name: e.target.value })}
              placeholder={t('accountNamePlaceholder')}
            />
          </div>
        </div>

        <div className="max-w-xs space-y-2">
          <Label>{t('bankNameLabel')}</Label>
          <Input
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
            placeholder={t('bankNamePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('descriptionLabel')}</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <Button onClick={handleSave} disabled={updateState.isLoading || bankQ.isLoading}>
          {t('saveButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
