'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { IdentityStatus } from '@/integrations/shared';
import { useListIdentityDocumentsQuery, useReviewIdentityDocumentMutation } from '@/integrations/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import IdentityImage from './identity-image';

const STATUS_TABS: { key: IdentityStatus | ''; label: string }[] = [
  { key: 'pending', label: 'Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
  { key: 'rejected', label: 'Reddedilen' },
  { key: '', label: 'Tümü' },
];

const STATUS_LABEL: Record<IdentityStatus, string> = { pending: 'İnceleniyor', approved: 'Onaylandı', rejected: 'Reddedildi' };

function statusVariant(status: IdentityStatus) {
  if (status === 'pending') return 'secondary' as const;
  if (status === 'approved') return 'default' as const;
  return 'destructive' as const;
}

export default function AdminIdentityClient() {
  const [statusFilter, setStatusFilter] = useState<IdentityStatus | ''>('pending');
  const { data = [], isLoading } = useListIdentityDocumentsQuery(statusFilter ? { status: statusFilter } : undefined);
  const [review, { isLoading: saving }] = useReviewIdentityDocumentMutation();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  async function submit(userId: string, status: 'approved' | 'rejected') {
    if (status === 'rejected' && !reason.trim()) {
      toast.error('Ret nedeni zorunludur; kullanıcı bunu profilinde görür.');
      return;
    }
    try {
      await review({ userId, status, reject_reason: status === 'rejected' ? reason.trim() : undefined }).unwrap();
      toast.success(status === 'approved' ? 'Kimlik onaylandı.' : 'Kimlik reddedildi.');
      setRejectingId(null);
      setReason('');
    } catch {
      toast.error('İşlem başarısız.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Kimlik doğrulama</h1>
        <p className="text-sm text-muted-foreground">
          Kullanıcıların yüklediği kimlik ön yüzlerini inceleyin. Görseller yalnız bu ekrandan açılır ve her açılış kayda geçer.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Button key={tab.key || 'all'} size="sm" variant={statusFilter === tab.key ? 'default' : 'outline'} onClick={() => setStatusFilter(tab.key)}>
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="animate-pulse py-12 text-center text-sm text-muted-foreground">Yükleniyor...</div>
      ) : data.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Kayıt bulunamadı.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((d) => (
            <div key={d.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant(d.status)}>{STATUS_LABEL[d.status]}</Badge>
                <span className="text-xs text-muted-foreground">Yüklendi: {new Date(d.updated_at).toLocaleString('tr-TR')}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{d.full_name || 'İsimsiz kullanıcı'}</p>
                <p className="text-xs text-muted-foreground">{d.email}</p>
              </div>
              <IdentityImage key={d.updated_at} userId={d.user_id} />
              {d.status === 'rejected' && d.reject_reason && <p className="text-sm text-destructive">Ret nedeni: {d.reject_reason}</p>}
              {rejectingId === d.user_id ? (
                <div className="space-y-2">
                  <Textarea rows={2} maxLength={255} placeholder="Örn. Görsel bulanık, kimliğin tamamı görünmüyor." value={reason} onChange={(e) => setReason(e.target.value)} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" disabled={saving} onClick={() => submit(d.user_id, 'rejected')}>Reddet</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setReason(''); }}>Vazgeç</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {d.status !== 'approved' && <Button size="sm" disabled={saving} onClick={() => submit(d.user_id, 'approved')}>Onayla</Button>}
                  {d.status !== 'rejected' && <Button size="sm" variant="outline" onClick={() => { setRejectingId(d.user_id); setReason(''); }}>Reddet…</Button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
