'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useListKycDocumentsQuery } from '@/integrations/endpoints/admin/carrier-kyc-admin-endpoints';
import { KYC_DOC_TYPE_LABEL, KYC_DOC_STATUS_LABEL } from '@/integrations/shared/carrier-kyc';
import type { KycDocumentStatus } from '@/integrations/shared/carrier-kyc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STATUS_TABS: { key: string; label: string }[] = [
  { key: 'pending', label: 'Bekleyen' },
  { key: 'approved', label: 'Onaylanan' },
  { key: 'rejected', label: 'Reddedilen' },
];

function statusVariant(status: KycDocumentStatus) {
  if (status === 'approved') return 'default' as const;
  if (status === 'rejected') return 'destructive' as const;
  return 'secondary' as const;
}

export default function AdminKycClient() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListKycDocumentsQuery({ status: statusFilter, page });

  const docs = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">KYC Doğrulama</h1>
        <p className="text-sm text-muted-foreground">Taşıyıcı kimlik doğrulama belgelerini yönetin.</p>
      </div>

      {/* Status tabs */}
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

      {/* Table */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse py-12 text-center">Yükleniyor...</div>
      ) : docs.length === 0 ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Bu kategoride belge bulunamadı.</div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Taşıyıcı</th>
                <th className="px-4 py-3 text-left font-medium">Belge Türü</th>
                <th className="px-4 py-3 text-left font-medium">Dosya</th>
                <th className="px-4 py-3 text-left font-medium">Durum</th>
                <th className="px-4 py-3 text-left font-medium">Tarih</th>
                <th className="px-4 py-3 text-left font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{doc.carrier_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{doc.carrier_email ?? doc.carrier_id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{KYC_DOC_TYPE_LABEL[doc.document_type] ?? doc.document_type}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[150px]">{doc.original_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(doc.status)}>{KYC_DOC_STATUS_LABEL[doc.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">{new Date(doc.created_at).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/kyc/${doc.carrier_id}`}>
                      <Button variant="outline" size="sm">İncele</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
          <span className="text-sm text-muted-foreground py-2">Sayfa {page}</span>
          <Button variant="outline" size="sm" disabled={docs.length < 20} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
        </div>
      )}
    </div>
  );
}
