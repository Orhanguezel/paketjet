'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import GatewaysCard from './gateways-card';
import BankDetailsCard from './bank-details-card';

export default function PaymentSettingsClient() {
  const t = useAdminT('admin.payment-settings');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Tabs defaultValue="gateways">
        <TabsList>
          <TabsTrigger value="gateways">{t('tabs.gateways')}</TabsTrigger>
          <TabsTrigger value="bank">{t('tabs.bank')}</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="mt-4 space-y-6">
          <GatewaysCard />
        </TabsContent>

        <TabsContent value="bank" className="mt-4 space-y-6">
          <BankDetailsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
