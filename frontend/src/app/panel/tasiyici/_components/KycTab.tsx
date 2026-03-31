"use client";
import { useState, useEffect } from "react";
import { getKycStatus, uploadKycDocument, deleteKycDocument } from "@/modules/carrier-kyc/carrier-kyc.service";
import type { KycStatusResponse, KycDocumentType, KycDocument } from "@/modules/carrier-kyc/carrier-kyc.type";
import { KYC_DOC_TYPE_LABELS, KYC_STATUS_LABELS, KYC_DOC_STATUS_LABELS } from "@/modules/carrier-kyc/carrier-kyc.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const DOC_TYPES: KycDocumentType[] = ["identity_front", "identity_back", "tax_certificate", "address_proof", "iban_document"];

const STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "muted"> = {
  not_submitted: "muted",
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function KycTab() {
  const [kyc, setKyc] = useState<KycStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [docType, setDocType] = useState<KycDocumentType>("identity_front");
  const [file, setFile] = useState<File | null>(null);
  const [tcIdentity, setTcIdentity] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");

  async function refresh() {
    try {
      const data = await getKycStatus();
      setKyc(data);
      if (data.tc_identity) setTcIdentity(data.tc_identity);
      if (data.tax_number) setTaxNumber(data.tax_number);
      if (data.tax_office) setTaxOffice(data.tax_office);
      if (data.legal_company_title) setCompanyTitle(data.legal_company_title);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadKycDocument({
        document_type: docType,
        file,
        tc_identity: tcIdentity || undefined,
        tax_number: taxNumber || undefined,
        tax_office: taxOffice || undefined,
        legal_company_title: companyTitle || undefined,
      });
      setFile(null);
      await refresh();
    } catch (e) {
      setError((e as Error).message || "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu belgeyi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteKycDocument(id);
      await refresh();
    } catch (e) {
      setError((e as Error).message || "Silme başarısız");
    }
  }

  if (loading) {
    return <div className="text-muted text-sm text-center py-12 animate-pulse">KYC bilgileri yükleniyor...</div>;
  }

  const status = kyc?.kyc_status ?? "not_submitted";
  const docs = kyc?.documents ?? [];

  return (
    <div className="space-y-6">
      {/* Durum Kartları */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl border border-border-soft p-4 text-center">
          <Badge color={STATUS_COLOR[status]}>{KYC_STATUS_LABELS[status]}</Badge>
          <p className="text-xs text-muted mt-1">Doğrulama Durumu</p>
        </div>
        <div className="bg-surface rounded-xl border border-border-soft p-4 text-center">
          <p className="text-lg font-bold text-foreground">{kyc?.approved_count ?? 0} / {kyc?.document_count ?? 0}</p>
          <p className="text-xs text-muted">Onaylanan Belge</p>
        </div>
        <div className="bg-surface rounded-xl border border-border-soft p-4 text-center">
          <Badge color={kyc?.iyzico_sub_merchant_key ? "success" : "muted"}>
            {kyc?.iyzico_sub_merchant_key ? "Aktif" : "Pasif"}
          </Badge>
          <p className="text-xs text-muted mt-1">Ödeme Altyapısı</p>
        </div>
      </div>

      {/* Uyarılar */}
      {status === "not_submitted" && (
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-sm text-foreground">
          İlan açabilmek için kimlik doğrulamanızı tamamlamanız gerekiyor. Lütfen aşağıdaki formu doldurun.
        </div>
      )}
      {status === "rejected" && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 text-sm text-danger">
          Doğrulama başvurunuz reddedildi. Lütfen reddedilen belgeleri kontrol edip tekrar yükleyin.
        </div>
      )}
      {status === "approved" && (
        <div className="bg-success/5 border border-success/20 rounded-xl p-4 text-sm text-success">
          Doğrulamanız onaylanmıştır. İlan açabilirsiniz.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sol: Form */}
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Belge Yükle</h3>
          <div className="space-y-3">
            <Input label="TC Kimlik No" maxLength={11} value={tcIdentity} onChange={(e) => setTcIdentity(e.target.value)} placeholder="12345678901" />
            <Input label="Vergi Numarası (opsiyonel)" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} placeholder="1234567890" />
            <Input label="Vergi Dairesi (opsiyonel)" value={taxOffice} onChange={(e) => setTaxOffice(e.target.value)} placeholder="Kadıköy" />
            <Input label="Şirket Ünvanı (opsiyonel)" value={companyTitle} onChange={(e) => setCompanyTitle(e.target.value)} placeholder="ABC Lojistik Ltd. Şti." />

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Belge Türü</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as KycDocumentType)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-bg-alt text-foreground text-sm outline-none focus:border-brand"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>{KYC_DOC_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Dosya (PDF, JPG, PNG — max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand/10 file:text-brand file:font-semibold file:text-xs"
              />
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}

            <Button onClick={handleUpload} loading={uploading} disabled={!file}>
              Belge Yükle
            </Button>
          </div>
        </div>

        {/* Sağ: Yüklenen Belgeler */}
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Yüklenen Belgeler</h3>
          {docs.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">Henüz belge yüklenmedi.</p>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-bg-alt">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{KYC_DOC_TYPE_LABELS[doc.document_type]}</p>
                    <p className="text-xs text-muted truncate">{doc.original_name}</p>
                    {doc.status === "rejected" && doc.admin_note && (
                      <p className="text-xs text-danger mt-1">Red sebebi: {doc.admin_note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge color={STATUS_COLOR[doc.status]}>{KYC_DOC_STATUS_LABELS[doc.status]}</Badge>
                    {doc.status === "pending" && (
                      <button onClick={() => handleDelete(doc.id)} className="text-xs text-danger hover:underline">Sil</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
