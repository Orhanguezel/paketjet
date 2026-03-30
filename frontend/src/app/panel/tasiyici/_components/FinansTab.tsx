"use client";
import { useState, useEffect } from "react";
import { getTransactions } from "@/modules/wallet/wallet.service";
import { getMyBank, upsertMyBank, deleteMyBank } from "@/modules/carrier-bank/carrier-bank.service";
import { carrierBankSchema, type CarrierBankFormData } from "@/modules/carrier-bank/carrier-bank.schema";
import type { WalletTransaction } from "@/modules/wallet/wallet.type";
import type { CarrierBankAccount } from "@/modules/carrier-bank/carrier-bank.type";
import type { CarrierDashboard } from "@/modules/dashboard/dashboard.service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
  dashboard: CarrierDashboard | null;
}

export default function FinansTab({ dashboard }: Props) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [bank, setBank] = useState<CarrierBankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [editBank, setEditBank] = useState(false);
  const [bankForm, setBankForm] = useState<CarrierBankFormData>({ iban: "", account_holder: "", bank_name: "" });
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});
  const [bankSaving, setBankSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getTransactions(1, { purpose: "booking_earning" }),
      getMyBank(),
    ])
      .then(([txRes, bankRes]) => {
        setTransactions(txRes.data);
        if (bankRes && bankRes.iban) {
          setBank(bankRes);
          setBankForm({ iban: bankRes.iban, account_holder: bankRes.account_holder, bank_name: bankRes.bank_name });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleBankSave() {
    setBankErrors({});
    const result = carrierBankSchema.safeParse(bankForm);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(e => { errs[e.path[0] as string] = e.message; });
      setBankErrors(errs);
      return;
    }
    setBankSaving(true);
    try {
      const saved = await upsertMyBank(result.data);
      setBank(saved);
      setEditBank(false);
    } catch (e) { console.error(e); }
    finally { setBankSaving(false); }
  }

  async function handleBankDelete() {
    if (!confirm("Banka hesap bilgilerinizi silmek istediğinize emin misiniz?")) return;
    setBankSaving(true);
    try {
      await deleteMyBank();
      setBank(null);
      setBankForm({ iban: "", account_holder: "", bank_name: "" });
      setEditBank(false);
    } catch (e) { console.error(e); }
    finally { setBankSaving(false); }
  }

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Bekleyen Kazanç Banner */}
      {dashboard && dashboard.pending_earnings > 0 && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl p-4">
          <p className="text-sm font-semibold text-brand">
            Bakiyenize henüz yansımayan {dashboard.pending_earnings_count} taşımanız var
          </p>
          <p className="text-2xl font-extrabold text-brand mt-1">
            ₺{dashboard.pending_earnings.toFixed(2)}
          </p>
          <p className="text-xs text-muted mt-1">
            Teslim onaylandığında cüzdanınıza aktarılacak.
          </p>
        </div>
      )}

      {/* Banka Hesabım */}
      <div className="bg-surface rounded-xl border border-border-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Banka Hesabım</h3>
          {bank && !editBank && (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditBank(true)}>Düzenle</Button>
              <Button size="sm" variant="danger" loading={bankSaving} onClick={handleBankDelete}>Sil</Button>
            </div>
          )}
        </div>

        {!bank && !editBank && (
          <div className="text-center py-4">
            <p className="text-sm text-muted mb-3">Para çekimi için banka hesap bilgilerinizi ekleyin.</p>
            <Button size="sm" variant="primary" onClick={() => setEditBank(true)}>Banka Hesabı Ekle</Button>
          </div>
        )}

        {(editBank || (!bank && editBank)) && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">IBAN</label>
              <input
                type="text"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                value={bankForm.iban}
                onChange={e => setBankForm(f => ({ ...f, iban: e.target.value.replace(/\s/g, "").toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-alt text-foreground text-sm focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
                maxLength={26}
              />
              {bankErrors.iban && <p className="text-xs text-danger mt-1">{bankErrors.iban}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Hesap Sahibi</label>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={bankForm.account_holder}
                onChange={e => setBankForm(f => ({ ...f, account_holder: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-alt text-foreground text-sm focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
              />
              {bankErrors.account_holder && <p className="text-xs text-danger mt-1">{bankErrors.account_holder}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Banka Adı</label>
              <input
                type="text"
                placeholder="örn. Garanti Bankası"
                value={bankForm.bank_name}
                onChange={e => setBankForm(f => ({ ...f, bank_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-alt text-foreground text-sm focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
              />
              {bankErrors.bank_name && <p className="text-xs text-danger mt-1">{bankErrors.bank_name}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="success" loading={bankSaving} onClick={handleBankSave}>Kaydet</Button>
              <Button size="sm" variant="secondary" onClick={() => { setEditBank(false); setBankErrors({}); }}>Vazgeç</Button>
            </div>
          </div>
        )}

        {bank && !editBank && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted">IBAN</p>
              <p className="text-sm font-mono font-semibold text-foreground">{bank.iban}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Hesap Sahibi</p>
              <p className="text-sm font-semibold text-foreground">{bank.account_holder}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Banka</p>
              <p className="text-sm font-semibold text-foreground">{bank.bank_name}</p>
            </div>
            {bank.is_verified === 1 && (
              <div className="col-span-full"><Badge color="success">Doğrulanmış</Badge></div>
            )}
          </div>
        )}
      </div>

      {/* Alınan Ödemeler */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Alınan Ödemeler</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p className="text-sm">Henüz alınan ödeme yok.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-surface rounded-lg border border-border-soft p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{tx.description ?? "Taşıma kazancı"}</p>
                  <p className="text-xs text-muted">{formatDate(tx.created_at)}</p>
                </div>
                <p className="text-sm font-bold text-success">+₺{tx.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
