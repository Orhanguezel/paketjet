'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useListIlanlarAdminQuery } from '@/integrations/hooks';
import { Card } from '@/components/ui/card';
import type { IlanStatus } from '@/integrations/shared';

const statusText: Record<IlanStatus, string> = {
  active: 'Yayında', pending_approval: 'İncelemede', paused: 'Duraklatıldı',
  sold: 'Satıldı', expired: 'Süresi doldu', cancelled: 'İptal', removed: 'Arşivlendi',
};
const vehicleText = { car: 'Otomobil', van: 'Kamyonet', truck: 'Kamyon', motorcycle: 'Motosiklet', other: 'Diğer' };

export function DashboardLatestListings() {
  const query = useListIlanlarAdminQuery({ page: 1 });
  const listings = query.data?.data.slice(0, 5) ?? [];
  return <Card className="admin-dashboard-panel admin-listings-panel">
    <div className="admin-panel-heading"><div><h2>Son ilanlar</h2><p>En son oluşturulan rota ilanları</p></div><Link href="/admin/ilanlar" className="admin-panel-link">Tüm ilanları gör <ArrowUpRight size={16} /></Link></div>
    {query.isError ? <p role="alert" className="admin-panel-message">İlanlar yüklenemedi.</p> : query.isLoading ? <p className="admin-panel-message">İlanlar yükleniyor…</p> : listings.length === 0 ? <p className="admin-panel-message">Henüz ilan yok.</p> : <div className="admin-table-scroll"><table className="admin-dashboard-table">
      <thead><tr><th>Rota</th><th>Araç ve kapasite</th><th>Fiyat</th><th>Hareket</th><th>Durum</th></tr></thead>
      <tbody>{listings.map((listing) => <tr key={listing.id}>
        <td><strong>{listing.from_city} → {listing.to_city}</strong><small>{listing.carrier_name || 'İlan sahibi'}</small></td>
        <td>{vehicleText[listing.vehicle_type]}<small>{Number(listing.available_capacity_kg).toLocaleString('tr-TR')} kg müsait</small></td>
        <td>{Number(listing.price_per_kg).toLocaleString('tr-TR')} TL/kg</td>
        <td>{new Date(listing.departure_date).toLocaleDateString('tr-TR')}</td>
        <td><span className={`admin-status admin-status-${listing.status}`}>{statusText[listing.status] || listing.status}</span></td>
      </tr>)}</tbody>
    </table></div>}
  </Card>;
}
