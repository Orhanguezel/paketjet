'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import {
  defaultIyzicoSettings,
  defaultPayTRSettings,
  IYZICO_SANDBOX_URL,
  IYZICO_PRODUCTION_URL,
  type IyzicoSettings,
  type PayTRSettings,
} from '@/integrations/shared';
import {
  useListSiteSettingsAdminQuery,
  useBulkUpsertSiteSettingsAdminMutation,
} from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

function parseSettingValue(value: string): string {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseBoolSetting(value: string): boolean {
  try {
    const v = JSON.parse(value);
    return v === true || v === 'true' || v === '1';
  } catch {
    return false;
  }
}

export default function GatewaysCard() {
  const t = useAdminT('admin.payment-settings.gateways');

  const settingsQ = useListSiteSettingsAdminQuery(undefined);
  const [bulkUpsert, bulkState] = useBulkUpsertSiteSettingsAdminMutation();

  const [iyzico, setIyzico] = React.useState<IyzicoSettings>(defaultIyzicoSettings());
  const [paytr, setPaytr] = React.useState<PayTRSettings>(defaultPayTRSettings());

  // Hydrate from site_settings
  React.useEffect(() => {
    if (!settingsQ.data) return;
    const settings = settingsQ.data as Array<{ key: string; value: string }>;
    const get = (key: string) => settings.find((s) => s.key === key)?.value;

    const iyzicoEnabled = get('integration.iyzico.enabled');
    const iyzicoApiKey = get('integration.iyzico.api_key');
    const iyzicoSecretKey = get('integration.iyzico.secret_key');
    const iyzicoBaseUrl = get('integration.iyzico.base_url');

    setIyzico({
      enabled: iyzicoEnabled ? parseBoolSetting(iyzicoEnabled) : false,
      api_key: iyzicoApiKey ? parseSettingValue(iyzicoApiKey) : '',
      secret_key: iyzicoSecretKey ? parseSettingValue(iyzicoSecretKey) : '',
      base_url: iyzicoBaseUrl ? parseSettingValue(iyzicoBaseUrl) : IYZICO_SANDBOX_URL,
      test_mode: iyzicoBaseUrl ? parseSettingValue(iyzicoBaseUrl).includes('sandbox') : true,
    });

    const paytrEnabled = get('integration.paytr.enabled');
    const paytrMerchantId = get('integration.paytr.merchant_id');
    const paytrMerchantKey = get('integration.paytr.merchant_key');
    const paytrMerchantSalt = get('integration.paytr.merchant_salt');

    setPaytr({
      enabled: paytrEnabled ? parseBoolSetting(paytrEnabled) : false,
      merchant_id: paytrMerchantId ? parseSettingValue(paytrMerchantId) : '',
      merchant_key: paytrMerchantKey ? parseSettingValue(paytrMerchantKey) : '',
      merchant_salt: paytrMerchantSalt ? parseSettingValue(paytrMerchantSalt) : '',
      test_mode: true,
    });
  }, [settingsQ.data]);

  async function handleSave() {
    try {
      const items = [
        { key: 'integration.iyzico.enabled', value: JSON.stringify(iyzico.enabled), locale: '*' },
        { key: 'integration.iyzico.api_key', value: JSON.stringify(iyzico.api_key), locale: '*' },
        { key: 'integration.iyzico.secret_key', value: JSON.stringify(iyzico.secret_key), locale: '*' },
        { key: 'integration.iyzico.base_url', value: JSON.stringify(iyzico.test_mode ? IYZICO_SANDBOX_URL : IYZICO_PRODUCTION_URL), locale: '*' },
        { key: 'integration.paytr.enabled', value: JSON.stringify(paytr.enabled), locale: '*' },
        { key: 'integration.paytr.merchant_id', value: JSON.stringify(paytr.merchant_id), locale: '*' },
        { key: 'integration.paytr.merchant_key', value: JSON.stringify(paytr.merchant_key), locale: '*' },
        { key: 'integration.paytr.merchant_salt', value: JSON.stringify(paytr.merchant_salt), locale: '*' },
      ];
      await bulkUpsert({ items }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('errorFallback'));
    }
  }

  const busy = bulkState.isLoading;

  return (
    <div className="space-y-6">
      {/* iyzico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('iyzico.title')}</CardTitle>
          <CardDescription>{t('iyzico.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={iyzico.enabled}
              onCheckedChange={(v) => setIyzico({ ...iyzico, enabled: v })}
            />
            <Label>{t('iyzico.enabledLabel')}</Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('iyzico.apiKeyLabel')}</Label>
              <Input
                value={iyzico.api_key}
                onChange={(e) => setIyzico({ ...iyzico, api_key: e.target.value })}
                placeholder={t('iyzico.apiKeyPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('iyzico.secretKeyLabel')}</Label>
              <Input
                type="password"
                value={iyzico.secret_key}
                onChange={(e) => setIyzico({ ...iyzico, secret_key: e.target.value })}
                placeholder={t('iyzico.secretKeyPlaceholder')}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={iyzico.test_mode}
              onCheckedChange={(v) =>
                setIyzico({
                  ...iyzico,
                  test_mode: v,
                  base_url: v ? IYZICO_SANDBOX_URL : IYZICO_PRODUCTION_URL,
                })
              }
            />
            <Label>{t('iyzico.testModeLabel')}</Label>
            <span className="text-xs text-muted-foreground">
              ({iyzico.test_mode ? t('iyzico.sandboxUrl') : t('iyzico.productionUrl')})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* PayTR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('paytr.title')}</CardTitle>
          <CardDescription>{t('paytr.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={paytr.enabled}
              onCheckedChange={(v) => setPaytr({ ...paytr, enabled: v })}
            />
            <Label>{t('paytr.enabledLabel')}</Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('paytr.merchantIdLabel')}</Label>
              <Input
                value={paytr.merchant_id}
                onChange={(e) => setPaytr({ ...paytr, merchant_id: e.target.value })}
                placeholder={t('paytr.merchantIdPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('paytr.merchantKeyLabel')}</Label>
              <Input
                type="password"
                value={paytr.merchant_key}
                onChange={(e) => setPaytr({ ...paytr, merchant_key: e.target.value })}
                placeholder={t('paytr.merchantKeyPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2 sm:max-w-xs">
            <Label>{t('paytr.merchantSaltLabel')}</Label>
            <Input
              type="password"
              value={paytr.merchant_salt}
              onChange={(e) => setPaytr({ ...paytr, merchant_salt: e.target.value })}
              placeholder={t('paytr.merchantSaltPlaceholder')}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={paytr.test_mode}
              onCheckedChange={(v) => setPaytr({ ...paytr, test_mode: v })}
            />
            <Label>{t('paytr.testModeLabel')}</Label>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button onClick={handleSave} disabled={busy}>
        {t('saveButton')}
      </Button>
    </div>
  );
}
