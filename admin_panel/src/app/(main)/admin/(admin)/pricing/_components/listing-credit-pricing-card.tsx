'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  useBulkUpsertSiteSettingsAdminMutation,
  useGetSiteSettingAdminByKeyQuery,
} from '@/integrations/hooks';

const PRICE_KEY = 'pricing.listing_credit_price';
const PACKAGES_KEY = 'pricing.credit_packages';
const LOCALE = 'tr';

type CreditPackageForm = {
  key: string;
  credits: string;
  price: string;
};

type CreditPackageValue = {
  key?: unknown;
  credits?: unknown;
  price?: unknown;
};

function toPackageRows(value: unknown): CreditPackageForm[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = item as CreditPackageValue;
    return {
      key: String(row.key ?? `package-${index + 1}`),
      credits: String(row.credits ?? ''),
      price: String(row.price ?? ''),
    };
  });
}

function toPackageValues(rows: CreditPackageForm[]) {
  return rows
    .map((row) => ({
      key: row.key.trim(),
      credits: Number(row.credits),
      price: Number(row.price),
    }))
    .filter((row) => row.key && Number.isFinite(row.credits) && Number.isFinite(row.price));
}

export default function ListingCreditPricingCard() {
  const t = useAdminT('admin.pricing.pricing');
  const priceQ = useGetSiteSettingAdminByKeyQuery({ key: PRICE_KEY, locale: LOCALE });
  const packagesQ = useGetSiteSettingAdminByKeyQuery({ key: PACKAGES_KEY, locale: LOCALE });
  const [saveSettings, saveState] = useBulkUpsertSiteSettingsAdminMutation();

  const [price, setPrice] = React.useState('');
  const [packages, setPackages] = React.useState<CreditPackageForm[]>([]);

  React.useEffect(() => {
    if (priceQ.data) setPrice(String(priceQ.data.value ?? ''));
  }, [priceQ.data]);

  React.useEffect(() => {
    if (packagesQ.data) setPackages(toPackageRows(packagesQ.data.value));
  }, [packagesQ.data]);

  function updatePackage(index: number, patch: Partial<CreditPackageForm>) {
    setPackages((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addPackage() {
    setPackages((current) => [...current, { key: `package-${current.length + 1}`, credits: '', price: '' }]);
  }

  function removePackage(index: number) {
    setPackages((current) => current.filter((_, i) => i !== index));
  }

  async function handleSave() {
    const priceNumber = Number(price);
    const packageValues = toPackageValues(packages);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      toast.error(t('invalidPrice'));
      return;
    }

    try {
      await saveSettings({
        items: [
          { key: PRICE_KEY, value: priceNumber },
          { key: PACKAGES_KEY, value: packageValues },
        ],
      }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    }
  }

  const isLoading = priceQ.isLoading || packagesQ.isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {priceQ.isError || packagesQ.isError ? (
          <p className="text-sm text-destructive">{t('loadError')}</p>
        ) : null}

        <div className="max-w-xs space-y-2">
          <Label htmlFor="listing-credit-price">{t('priceLabel')}</Label>
          <Input
            id="listing-credit-price"
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t('pricePlaceholder')}
          />
          <p className="text-xs text-muted-foreground">{t('priceHelp')}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">{t('packagesTitle')}</h3>
              <p className="text-xs text-muted-foreground">{t('packagesDescription')}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPackage}>
              {t('addPackage')}
            </Button>
          </div>

          <div className="space-y-2">
            {packages.map((pack, index) => (
              <div key={`${pack.key}-${index}`} className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_120px_120px_auto]">
                <Input
                  value={pack.key}
                  onChange={(e) => updatePackage(index, { key: e.target.value })}
                  placeholder={t('packageKeyPlaceholder')}
                />
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={pack.credits}
                  onChange={(e) => updatePackage(index, { credits: e.target.value })}
                  placeholder={t('creditsPlaceholder')}
                />
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={pack.price}
                  onChange={(e) => updatePackage(index, { price: e.target.value })}
                  placeholder={t('packagePricePlaceholder')}
                />
                <Button type="button" variant="ghost" onClick={() => removePackage(index)}>
                  {t('removePackage')}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading || saveState.isLoading}>
          {t('saveButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
