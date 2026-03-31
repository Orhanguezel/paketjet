'use client';

import { useState } from 'react';
import { useListDisputesQuery, useResolveDisputeMutation } from '@/integrations/endpoints/admin/disputes-admin-endpoints';
import { DISPUTE_STATUS_LABEL } from '@/integrations/shared/disputes';
import type { DisputeStatus } from '@/integrations/shared/disputes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const STATUS_TABS: { key: string; label: string }[] = [
  { key: '', label: 'Tümü' },
  { key: 'open', label: 'Açık' },
  { key: 'under_review', label: 'İnceleniyor' },
  { key: 'resolved', label: 'Çözüldü' },
  { key: 'closed', label: 'Kapatıldı' },
];

function statusVariant(status: DisputeStatus) {
  if (status === 'open') return 'destructive' as const;
  if (status === 'under_review') return 'secondary' as const;
  if (status === 'resolved') return 'default' as const;
  return 'outline' as const;
}

export default function AdminDisputesClient() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useListDisputesQuery({ status: statusFilter || undefined, page });
  const [resolve] = useResolveDisputeMutation();

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  const disputes = data?.data ?? [];
  const total = data?.total ?? 0;

  async function handleResolve(id: string, status: 'resolved' | 'closed') {
    if (!resolution.trim()) { toast.error('Çözüm açıklaması zorunludur.'); return; }
    try {
      await resolve({ id, resolution, status }).unwrap();
      toast.success('Anlaşmazlık güncellendi.');
      setResolvingId(null);
      setResolution('');
      refetch();
    } catch {
      toast.error('İşlem başarısız.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Anlaşmazlıklar</h1>
        <p className="text-sm text-muted-foreground">Taşıyıcı-müşteri anlaşmazlıklarını yönetin.</p>
      </div>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse py-12 text-center">Yükleniyor...</div>
      ) : disputes.length === 0 ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Anlaşmazlık bulunamadı.</div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusVariant(d.status)}>{DISPUTE_STATUS_LABEL[d.status]}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-sm font-medium">{d.opener_name ?? 'Kullanıcı'} ({d.opener_email})</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Booking: {d.booking_id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Sebep:</p>
                <p className="text-sm">{d.reason}</p>
              </div>

              {d.resolution && (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-600 mb-1">Çözüm:</p>
                  <p className="text-sm">{d.resolution}</p>
                </div>
              )}

              {['open', 'under_review'].includes(d.status) && (
                <>
                  {resolvingId === d.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Çözüm açıklamanızı yazın..."
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleResolve(d.id, 'resolved')}>Çözüldü Olarak İşaretle</Button>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(d.id, 'closed')}>Kapat</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setResolvingId(null); setResolution(''); }}>Vazgeç</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setResolvingId(d.id)}>Yanıtla</Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
          <span className="text-sm text-muted-foreground py-2">Sayfa {page}</span>
          <Button variant="outline" size="sm" disabled={disputes.length < 20} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
        </div>
      )}
    </div>
  );
}
