'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useGetCommissionRateQuery,
  useUpdateCommissionRateMutation,
} from '@/integrations/hooks';

export default function CommissionRateCard() {
  const t = useAdminT('admin.commission-settings.commission');

  const commissionQ = useGetCommissionRateQuery();
  const [updateRate, updateState] = useUpdateCommissionRateMutation();

  const [rate, setRate] = React.useState('');

  React.useEffect(() => {
    if (commissionQ.data) {
      setRate(String(commissionQ.data.rate));
    }
  }, [commissionQ.data]);

  async function handleSave() {
    const num = parseFloat(rate);
    if (isNaN(num) || num < 0 || num > 100) return;
    try {
      await updateRate({ rate: num }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('loadError'));
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {commissionQ.isError ? (
            <p className="text-sm text-destructive">{t('loadError')}</p>
          ) : null}

          <div className="max-w-xs space-y-2">
            <Label htmlFor="commission-rate">{t('rateLabel')}</Label>
            <Input
              id="commission-rate"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={t('ratePlaceholder')}
            />
            <p className="text-xs text-muted-foreground">{t('rateHelp')}</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateState.isLoading || commissionQ.isLoading}
          >
            {t('saveButton')}
          </Button>
        </CardContent>
      </Card>

      {/* Fallback chain bilgisi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('fallbackChain.title')}</CardTitle>
          <CardDescription>{t('fallbackChain.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1 text-sm text-muted-foreground">
            <li>{t('fallbackChain.step1')}</li>
            <li>{t('fallbackChain.step2')}</li>
            <li className="font-medium text-foreground">{t('fallbackChain.step3')}</li>
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
