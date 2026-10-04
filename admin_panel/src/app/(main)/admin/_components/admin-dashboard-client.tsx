'use client';

import Link from 'next/link';
import { CreditCard, FileText, RefreshCcw, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCommerceSummaryQuery } from '@/integrations/hooks';
import { formatIlanPurchaseMoney } from '@/integrations/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminPageHeader } from '@/components/admin/admin-page';
import { DashboardActivity } from './dashboard-activity';
import { DashboardActionQueue } from './dashboard-action-queue';
import { DashboardLatestListings } from './dashboard-latest-listings';

export default function AdminDashboardClient() {
  const summary = useCommerceSummaryQuery();
  const data = summary.data;
  const revenue = data ? Number(data.listing_receipts) + Number(data.package_receipts) : null;
  const cards = [
    { label: 'Aktif ilanlar', value: data?.active_listings, note: 'Güncel gerçek ilan', url: '/admin/ilanlar', icon: FileText },
    { label: 'Satın almalar', value: data?.contact_sales, note: 'Tamamlanan iletişim erişimi', url: '/admin/ilan-purchases', icon: ShoppingCart },
    { label: 'Ödeme kuyruğu', value: data?.payment_queue, note: 'İnceleme ve bekleyen işlemler', url: '/admin/payments', icon: CreditCard },
    { label: 'Tahsilat', value: revenue === null || !Number.isFinite(revenue) ? undefined : formatIlanPurchaseMoney(revenue), note: 'Tamamlanan kart ve hak paketi', url: '/admin/payments', icon: TrendingUp },
  ];

  return <div className="admin-dashboard">
    <AdminPageHeader title="Genel bakış" description="PaketJet platformunun güncel durumu ve temel metrikler."
      actions={<Button onClick={() => window.location.reload()}><RefreshCcw size={17} />Yenile</Button>} />
    {summary.isError && <p role="alert" className="admin-panel-error">Özet verileri alınamadı. Yenileyip tekrar deneyin.</p>}
    <div className="admin-overview-grid">{cards.map(({ label, value, note, url, icon: Icon }) =>
      <Link key={label} href={url} className="admin-overview-link"><Card className="admin-overview-card">
        <span className="admin-overview-icon"><Icon size={22} /></span>
        <div><span className="admin-overview-label">{label}</span><strong className="admin-overview-value">{summary.isLoading || summary.isError ? '—' : value ?? '—'}</strong><small className="admin-overview-note">{note}</small></div>
      </Card></Link>)}</div>
    <div className="admin-dashboard-columns"><div className="admin-dashboard-primary"><DashboardActivity /><DashboardLatestListings /></div><DashboardActionQueue /></div>
  </div>;
}
