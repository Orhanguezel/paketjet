"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListWallets, adminListWalletTx, adminAdjustWallet, type AdminWallet, type WalletTransaction } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminPagination, AdminEmptyState, AdminListSkeleton } from "@/components/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const LIMIT = 20;

const TX_COLOR: Record<string, "success" | "danger" | "brand" | "muted"> = {
  credit: "success", debit: "danger", refund: "brand",
};

export default function AdminWalletPage() {
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminWallet | null>(null);
  const [txList, setTxList] = useState<WalletTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDesc, setAdjustDesc] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try { setWallets(await adminListWallets({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function openDetail(w: AdminWallet) {
    setSelected(w);
    setTxLoading(true);
    try { setTxList(await adminListWalletTx(w.id, { limit: 50 })); }
    catch (e) { console.error(e); } finally { setTxLoading(false); }
  }

  async function handleAdjust() {
    if (!selected || !adjustAmount) return;
    setAdjusting(true);
    try {
      await adminAdjustWallet(selected.user_id, parseFloat(adjustAmount), adjustDesc || "Admin ayarlama");
      setAdjustOpen(false);
      setAdjustAmount("");
      setAdjustDesc("");
      await load(page);
      await openDetail(selected);
    } catch (e) { console.error(e); } finally { setAdjusting(false); }
  }

  const totalPages = Math.ceil(wallets.length / LIMIT);

  return (
    <div>
      <AdminPageHeader title="Cuzdan Yonetimi" subtitle={`${wallets.length} cuzdan`} />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {loading ? <AdminListSkeleton /> : wallets.length === 0 ? <AdminEmptyState message="Cuzdan bulunamadi." /> : (
            <div className="flex flex-col gap-2">
              {wallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => openDetail(w)}
                  className={`text-left bg-surface rounded-xl border p-4 transition-colors ${
                    selected?.id === w.id ? "border-brand" : "border-border-soft hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{w.user_name ?? w.user_email ?? "—"}</p>
                      <p className="text-xs text-muted">{w.user_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₺{w.balance}</p>
                      <p className="text-xs text-muted">Toplam: ₺{w.total_earnings}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {selected && (
          <div className="w-[420px] shrink-0 bg-surface rounded-xl border border-border-soft p-5 self-start sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">{selected.user_name ?? selected.user_email}</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground text-lg">&times;</button>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="bg-bg-alt rounded-lg p-3 flex-1 text-center">
                <p className="text-xs text-muted">Bakiye</p>
                <p className="font-bold text-foreground">₺{selected.balance}</p>
              </div>
              <div className="bg-bg-alt rounded-lg p-3 flex-1 text-center">
                <p className="text-xs text-muted">Toplam Kazanc</p>
                <p className="font-bold text-foreground">₺{selected.total_earnings}</p>
              </div>
            </div>

            <Button size="sm" variant="secondary" onClick={() => setAdjustOpen(!adjustOpen)} className="mb-4 w-full">
              Bakiye Ayarla
            </Button>

            {adjustOpen && (
              <div className="bg-bg-alt rounded-lg p-3 mb-4 flex flex-col gap-2">
                <input type="number" step="0.01" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Miktar (negatif = dusur)" className="px-3 py-1.5 text-sm bg-surface border border-border-soft rounded-lg text-foreground" />
                <input type="text" value={adjustDesc} onChange={(e) => setAdjustDesc(e.target.value)}
                  placeholder="Aciklama" className="px-3 py-1.5 text-sm bg-surface border border-border-soft rounded-lg text-foreground" />
                <Button size="sm" loading={adjusting} onClick={handleAdjust}>Uygula</Button>
              </div>
            )}

            <h3 className="font-semibold text-sm text-foreground mb-2">Son Islemler</h3>
            {txLoading ? <AdminListSkeleton count={3} lines={1} /> : txList.length === 0 ? (
              <p className="text-xs text-muted">Islem yok.</p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
                {txList.map((tx) => (
                  <div key={tx.id} className="bg-bg-alt rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Badge color={TX_COLOR[tx.type] ?? "muted"}>{tx.type}</Badge>
                        <span className="text-xs text-muted">{tx.purpose}</span>
                      </div>
                      {tx.description && <p className="text-xs text-faint mt-0.5">{tx.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${tx.type === "credit" ? "text-success" : "text-danger"}`}>
                        {tx.type === "credit" ? "+" : "-"}₺{tx.amount}
                      </p>
                      <p className="text-xs text-faint">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
