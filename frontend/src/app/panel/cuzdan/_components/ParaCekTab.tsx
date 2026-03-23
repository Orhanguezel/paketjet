"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyBank } from "@/modules/carrier-bank/carrier-bank.service";
import { createWithdrawal, getMyWithdrawals } from "@/modules/withdrawal/withdrawal.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import type { CarrierBankAccount } from "@/modules/carrier-bank/carrier-bank.type";
import type { WithdrawalRequest } from "@/modules/withdrawal/withdrawal.type";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ROUTES } from "@/config/routes";

const STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor",
  processing: "İşleniyor",
  completed: "Tamamlandı",
  rejected: "Reddedildi",
};

const STATUS_COLOR: Record<string, "warning" | "brand" | "success" | "danger"> = {
  pending: "warning",
  processing: "brand",
  completed: "success",
  rejected: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ParaCekTab({ onWithdraw }: { onWithdraw: () => void }) {
  const { user } = useAuthStore();
  const [bank, setBank] = useState<CarrierBankAccount | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getMyBank(), getMyWithdrawals()])
      .then(([b, w]) => {
        setBank(b);
        setWithdrawals(w.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw() {
    setError("");
    setSuccess(false);
    const val = parseFloat(amount);
    if (!val || val <= 0) return setError("Geçerli bir tutar giriniz.");
    // Backend will check balance, but we could too if we had it here
    
    setSaving(true);
    try {
      await createWithdrawal(val);
      setSuccess(true);
      setAmount("");
      onWithdraw(); // trigger bakiye refresh in parent
      getMyWithdrawals().then(w => setWithdrawals(w.data));
    } catch (err: any) {
      const msg = err?.message === "insufficient_balance" ? "Yetersiz bakiye." : "Talebiniz kaydedilemedi.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Current Bank Account */}
      <div className="bg-surface rounded-xl border border-border-soft p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">Çekim Yapılacak Banka Hesabı</h3>
        {bank ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono font-bold text-brand">{bank.iban}</p>
              <p className="text-xs text-muted font-medium mt-0.5">{bank.account_holder} · {bank.bank_name}</p>
            </div>
            <Link href="/panel/tasiyici" className="text-xs font-bold text-muted hover:underline">
               Değiştir
            </Link>
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-border-soft rounded-lg">
             <p className="text-xs text-muted mb-3">Henüz bir banka hesabı eklemediniz.</p>
             <Link href="/panel/tasiyici" className="text-xs font-bold px-4 py-2 bg-bg-alt border border-border rounded-lg text-foreground hover:bg-border-soft transition-colors">
                Banka Hesabı Ekle
             </Link>
          </div>
        )}
      </div>

      {/* Withdrawal Form */}
      {bank && (
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Yeni Çekim Talebi</h3>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Çekilecek Tutar (₺)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                error={error}
              />
            </div>
            <Button onClick={handleWithdraw} loading={saving}>İstekte Bulun</Button>
          </div>
          {success && <p className="text-xs text-success font-bold mt-2">✓ Talebiniz alındı. Admin onayından sonra hesabınıza aktarılacaktır.</p>}
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 px-1">Çekim Geçmişi</h3>
        {withdrawals.length === 0 ? (
          <p className="text-xs text-muted text-center py-6">Henüz bir çekim talebiniz yok.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {withdrawals.map((w) => (
              <div key={w.id} className="bg-surface rounded-xl border border-border-soft p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">₺{w.amount}</p>
                  <p className="text-[10px] text-muted font-medium mt-0.5">{formatDate(w.requested_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge color={STATUS_COLOR[w.status]}>{STATUS_LABEL[w.status]}</Badge>
                  {w.admin_notes && <p className="text-[10px] text-danger mt-1 italic max-w-[150px] truncate" title={w.admin_notes}>"{w.admin_notes}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
