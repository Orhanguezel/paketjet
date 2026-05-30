'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import CommissionRateCard from './commission-rate-card';
import ListingCreditPricingCard from './listing-credit-pricing-card';
import PlansManager from './plans-manager';

export default function CommissionSettingsClient() {
  const t = useAdminT('admin.commission-settings');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Tabs defaultValue="commission">
        <TabsList>
          <TabsTrigger value="commission">{t('tabs.commission')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('tabs.pricing')}</TabsTrigger>
          <TabsTrigger value="plans">{t('tabs.plans')}</TabsTrigger>
        </TabsList>

        <TabsContent value="commission" className="mt-4 space-y-6">
          <CommissionRateCard />
        </TabsContent>

        <TabsContent value="pricing" className="mt-4 space-y-6">
          <ListingCreditPricingCard />
        </TabsContent>

        <TabsContent value="plans" className="mt-4 space-y-6">
          <PlansManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
