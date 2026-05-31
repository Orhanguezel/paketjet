'use client';

// Yeni model (2026-05-30): komisyon YOK. Bu sayfa yalnızca İlan/Kontör fiyatlandırması.
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import ListingCreditPricingCard from './listing-credit-pricing-card';

export default function PricingClient() {
  const t = useAdminT('admin.pricing');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <ListingCreditPricingCard />
    </div>
  );
}
