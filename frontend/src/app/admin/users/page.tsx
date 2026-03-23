"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListUsers, adminSetUserActive, type AdminUser } from "@/modules/admin/admin.service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

const ROLE_LABEL: Record<string, string> = {
  admin:     "Admin",
  moderator: "Moderatör",
  carrier:   "Taşıyıcı",
  customer:  "Müşteri",
};

const ROLE_COLOR: Record<string, "brand" | "warning" | "success" | "muted"> = {
  admin:     "brand",
  moderator: "warning",
  carrier:   "success",
  customer:  "muted",
};

const LIMIT = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await adminListUsers({ page: p, limit: LIMIT });
      setUsers(res);
      setTotal(res.length);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function toggleActive(u: AdminUser) {
    setActionId(u.id);
    try { await adminSetUserActive(u.id, !u.is_active); await load(page); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Kullanıcılar</h1>
        <p className="text-sm text-muted">{total} kullanıcı</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4,5].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="bg-surface rounded-xl border border-border-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-brand-xlight flex items-center justify-center text-brand font-bold text-sm shrink-0">
                {(u.full_name ?? u.email)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground truncate">{u.full_name ?? u.email}</p>
                  <Badge color={ROLE_COLOR[u.role] ?? "muted"}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </Badge>
                  {!u.is_active && <Badge color="danger">Pasif</Badge>}
                </div>
                <p className="text-xs text-muted">{u.email} · ₺{u.wallet_balance}</p>
              </div>
              <Button
                size="sm"
                variant={u.is_active ? "secondary" : "success"}
                loading={actionId === u.id}
                onClick={() => toggleActive(u)}
              >
                {u.is_active ? "Pasif Et" : "Aktif Et"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Önceki</Button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki →</Button>
        </div>
      )}
    </div>
  );
}
