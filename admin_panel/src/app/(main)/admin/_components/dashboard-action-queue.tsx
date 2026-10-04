'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardCheck, CreditCard, FileText, Search, Users } from 'lucide-react';
import { useListIlanlarAdminQuery, useListPaymentOperationsQuery } from '@/integrations/hooks';
import { Card } from '@/components/ui/card';

type QueueItem = { id: string; title: string; detail: string; date: string; url: string; kind: 'payment' | 'refund' | 'listing' };

export function DashboardActionQueue() {
  const review = useListPaymentOperationsQuery({ page: 1, state: 'review' });
  const refunds = useListPaymentOperationsQuery({ page: 1, state: 'refund_pending' });
  const listings = useListIlanlarAdminQuery({ page: 1, status: 'pending_approval' });
  const items: QueueItem[] = [
    ...(review.data?.data ?? []).map((item) => ({ id: item.payment_ref, title: 'Ödeme inceleme', detail: `${item.payment_ref.slice(0, 12)} · ${Number(item.amount).toLocaleString('tr-TR')} TL`, date: item.created_at, url: '/admin/payments', kind: 'payment' as const })),
    ...(refunds.data?.data ?? []).map((item) => ({ id: item.payment_ref, title: 'İade bekliyor', detail: `${item.payment_ref.slice(0, 12)} · ${Number(item.amount).toLocaleString('tr-TR')} TL`, date: item.created_at, url: '/admin/payments', kind: 'refund' as const })),
    ...(listings.data?.data ?? []).map((item) => ({ id: item.id, title: 'İlan inceleme', detail: `${item.from_city} → ${item.to_city}`, date: item.created_at, url: '/admin/ilanlar', kind: 'listing' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const total = (review.data?.total ?? 0) + (refunds.data?.total ?? 0) + (listings.data?.total ?? 0);
  const loading = review.isLoading || refunds.isLoading || listings.isLoading;
  const error = review.isError || refunds.isError || listings.isError;

  return <div className="admin-dashboard-aside">
    <Card className="admin-dashboard-panel admin-queue-panel">
      <div className="admin-panel-heading"><div className="admin-heading-with-count"><h2>İşlem kuyruğu</h2>{!loading && !error && <span className="admin-queue-count">{total}</span>}</div><Link href="/admin/payments" className="admin-panel-link">Ödemeler <ArrowRight size={16} /></Link></div>
      {error ? <p role="alert" className="admin-panel-message">İnceleme kayıtları yüklenemedi.</p> : loading ? <p className="admin-panel-message">İşlemler yükleniyor…</p> : items.length === 0 ? <p className="admin-panel-message">İncelenecek işlem yok.</p> : <ul className="admin-queue-list">{items.map((item) => {
        const Icon = item.kind === 'listing' ? FileText : item.kind === 'refund' ? ClipboardCheck : CreditCard;
        return <li key={`${item.kind}-${item.id}`}><Link href={item.url} className="admin-queue-item"><span className={`admin-queue-icon admin-queue-icon-${item.kind}`}><Icon size={17} /></span><span className="admin-queue-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="admin-queue-action">İncele</span></Link></li>;
      })}</ul>}
    </Card>
    <Card className="admin-dashboard-panel admin-quick-panel"><h2>Hızlı işlemler</h2><div className="admin-quick-links">
      <Link href="/admin/ilanlar"><span><FileText size={18} /> İlanları incele</span><ArrowRight size={16} /></Link>
      <Link href="/admin/users"><span><Users size={18} /> Kullanıcı ara</span><ArrowRight size={16} /></Link>
      <Link href="/admin/payments"><span><CreditCard size={18} /> Ödemeleri kontrol et</span><ArrowRight size={16} /></Link>
      <Link href="/admin/reports"><span><Search size={18} /> Raporları görüntüle</span><ArrowRight size={16} /></Link>
    </div></Card>
  </div>;
}
