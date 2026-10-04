'use client';

import Link from 'next/link';
import { ClipboardList, CreditCard, FileCheck2, RefreshCcw, Truck } from 'lucide-react';
import { useCommerceSummaryQuery } from '@/integrations/hooks';
import { formatIlanPurchaseMoney } from '@/integrations/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminPageHeader } from '@/components/admin/admin-page';

export default function AdminDashboardClient() {
  const query = useCommerceSummaryQuery();
  const data = query.data;
  const cards = [
    { label: 'Güncel gerçek ilan', value: data?.active_listings, url: '/admin/ilanlar', icon: Truck },
    { label: 'Açılan iletişim', value: data?.contact_sales, url: '/admin/ilan-purchases', icon: FileCheck2 },
    { label: 'İnceleme bekleyen ilan', value: data?.moderation, url: '/admin/ilanlar', icon: ClipboardList },
    { label: 'Ödeme inceleme kuyruğu', value: data?.payment_queue, url: '/admin/payments', icon: CreditCard },
    { label: 'Toplam gerçek ilan başvurusu', value: data?.submitted_listings_total, url: '/admin/ilanlar', icon: Truck },
    { label: 'Son 30 gün ilan başvurusu', value: data?.submitted_listings_30d, url: '/admin/ilanlar', icon: Truck },
    { label: 'Son 30 gün yayına alınan ilan', value: data?.published_listings_30d, url: '/admin/ilanlar', icon: FileCheck2 },
    { label: 'Kartla iletişim tahsilatı', value: data ? formatIlanPurchaseMoney(data.listing_receipts) : undefined, url: '/admin/ilan-purchases', icon: CreditCard },
    { label: 'Hak paketi tahsilatı', value: data ? formatIlanPurchaseMoney(data.package_receipts) : undefined, url: '/admin/payments', icon: CreditCard },
    { label: 'Kullanılan hak', value: data?.credit_spends, url: '/admin/credits', icon: FileCheck2 },
  ];

  return <div>
    <AdminPageHeader title="Genel bakış" description="Güncel ilanlar, iletişim erişimleri ve ödeme işlemleri."
      actions={<Button variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><RefreshCcw className={query.isFetching ? 'animate-spin' : ''} />Yenile</Button>} />
    {query.isError && <p role="alert" className="mb-4 rounded-lg border p-4">Özet alınamadı. Rakamlar yerine çizgi gösteriliyor; tekrar deneyin.</p>}
    <div className="admin-metric-grid">
      {cards.map(({ label, value, url, icon: Icon }) => <Link key={label} href={url} className="group block min-w-0">
        <Card className="admin-metric-card h-full transition-colors group-hover:border-primary">
          <div className="flex items-start justify-between gap-2"><span className="admin-metric-label">{label}</span><span className="admin-metric-icon"><Icon size={18} aria-hidden /></span></div>
          <strong className="admin-metric-value">{query.isError ? '—' : value ?? '—'}</strong>
        </Card>
      </Link>)}
    </div>
    <Card className="mt-6"><CardHeader><CardTitle className="text-lg">Rakamların kapsamı</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>İlan sayıları örnek ilanları dışlar. Başvuru, kaydedilen gerçek ilanı; yayına alınma, ilanın ilk onayını sayar. Son 30 gün UTC zamanına göredir. Güncel ilan yalnızca aktif ve çıkış tarihi geçmemiş ilanları içerir.</p>
        <p>Tahsilatlar, tamamlanan kart işlemlerinin toplamıdır. Hak ile iletişim açılması ayrıca gelir sayılmaz. Eski TL cüzdan bakiyeleri bu toplamlara dahil değildir.</p>
        <p>Ödeme kuyruğu başlatılan, bekleyen, inceleme ve iade bekleyen kayıtları içerir. Sağlayıcı kanıtı olmayan eski işlemler otomatik başarılı veya başarısız sayılmaz.</p>
        <Link className="inline-flex py-2 font-medium text-primary" href="/admin/payments">İnceleme kuyruğunu aç →</Link>
      </CardContent></Card>
  </div>;
}
