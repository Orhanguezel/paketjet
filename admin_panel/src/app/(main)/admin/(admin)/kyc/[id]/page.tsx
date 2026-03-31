'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCarrierKycQuery, useReviewKycDocumentMutation, useCreateSubMerchantMutation } from '@/integrations/endpoints/admin/carrier-kyc-admin-endpoints';
import { KYC_DOC_TYPE_LABEL, KYC_DOC_STATUS_LABEL, KYC_STATUS_LABEL } from '@/integrations/shared/carrier-kyc';
import type { KycDocumentStatus } from '@/integrations/shared/carrier-kyc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function statusVariant(status: KycDocumentStatus | string) {
  if (status === 'approved') return 'default' as const;
  if (status === 'rejected') return 'destructive' as const;
  return 'secondary' as const;
}

export default function KycDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: carrier, isLoading, refetch } = useGetCarrierKycQuery(id);
  const [review] = useReviewKycDocumentMutation();
  const [createSM, smState] = useCreateSubMerchantMutation();
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function handleReview(docId: string, status: 'approved' | 'rejected') {
    if (status === 'rejected' && !notes[docId]?.trim()) {
      toast.error('Red sebebi zorunludur.');
      return;
    }
    try {
      await review({ id: docId, status, admin_note: notes[docId] }).unwrap();
      toast.success(status === 'approved' ? 'Belge onaylandı.' : 'Belge reddedildi.');
      refetch();
    } catch {
      toast.error('İşlem başarısız.');
    }
  }

  async function handleCreateSubMerchant() {
    try {
      const res = await createSM(id).unwrap();
      toast.success(`Alt üye işyeri oluşturuldu: ${res.sub_merchant_key}`);
      refetch();
    } catch {
      toast.error('Alt üye işyeri oluşturulamadı.');
    }
  }

  if (isLoading) return <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">Yükleniyor...</div>;
  if (!carrier) return <div className="py-12 text-center text-sm text-muted-foreground">Taşıyıcı bulunamadı.</div>;

  const docs = carrier.documents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/kyc')}>← Geri</Button>
        <h1 className="text-xl font-bold tracking-tight">KYC Detayı</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sol: Taşıyıcı Bilgileri */}
        <div className="rounded-lg border p-5 space-y-3">
          <h2 className="text-sm font-bold">Taşıyıcı Bilgileri</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Ad:</span> {carrier.full_name ?? '—'}</p>
            <p><span className="text-muted-foreground">E-posta:</span> {carrier.email}</p>
            <p><span className="text-muted-foreground">Telefon:</span> {carrier.phone ?? '—'}</p>
            <p><span className="text-muted-foreground">TC Kimlik:</span> {carrier.tc_identity ? `${carrier.tc_identity.slice(0, 3)}****${carrier.tc_identity.slice(-2)}` : '—'}</p>
            <p><span className="text-muted-foreground">Vergi No:</span> {carrier.tax_number ?? '—'}</p>
            <p><span className="text-muted-foreground">Vergi Dairesi:</span> {carrier.tax_office ?? '—'}</p>
            <p><span className="text-muted-foreground">Şirket:</span> {carrier.legal_company_title ?? '—'}</p>
          </div>
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">KYC:</span>
              <Badge variant={statusVariant(carrier.kyc_status)}>{KYC_STATUS_LABEL[carrier.kyc_status]}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Iyzico:</span>
              {carrier.iyzico_sub_merchant_key ? (
                <code className="text-xs bg-muted px-2 py-0.5 rounded">{carrier.iyzico_sub_merchant_key}</code>
              ) : (
                <span className="text-xs text-muted-foreground">Yok</span>
              )}
            </div>
            {carrier.kyc_status === 'approved' && !carrier.iyzico_sub_merchant_key && (
              <Button size="sm" onClick={handleCreateSubMerchant} disabled={smState.isLoading}>
                Iyzico Alt Üye Oluştur
              </Button>
            )}
          </div>
        </div>

        {/* Sağ: Belgeler */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold">Belgeler ({docs.length})</h2>
          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Henüz belge yüklenmemiş.</p>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{KYC_DOC_TYPE_LABEL[doc.document_type]}</p>
                    <p className="text-xs text-muted-foreground">{doc.original_name} — {(doc.file_size / 1024).toFixed(0)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(doc.status)}>{KYC_DOC_STATUS_LABEL[doc.status]}</Badge>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? ''}${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      İndir
                    </a>
                  </div>
                </div>

                {doc.admin_note && (
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Not: {doc.admin_note}</p>
                )}

                {doc.status === 'pending' && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Admin notu (red için zorunlu)"
                        value={notes[doc.id] ?? ''}
                        onChange={(e) => setNotes((p) => ({ ...p, [doc.id]: e.target.value }))}
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" onClick={() => handleReview(doc.id, 'approved')}>Onayla</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReview(doc.id, 'rejected')}>Reddet</Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
