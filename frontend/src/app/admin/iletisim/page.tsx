"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListContacts, adminMarkContactRead, adminDeleteContact, type ContactMessage } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminPagination, AdminEmptyState, AdminListSkeleton } from "@/components/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const LIMIT = 20;

export default function AdminContactsPage() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try { setRows(await adminListContacts({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function markRead(id: string) {
    setActionId(id);
    try { await adminMarkContactRead(id); await load(page); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu mesaji silmek istiyor musunuz?")) return;
    setActionId(id);
    try {
      await adminDeleteContact(id);
      if (selected?.id === id) setSelected(null);
      await load(page);
    } catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(rows.length / LIMIT);

  return (
    <div>
      <AdminPageHeader title="Iletisim Mesajlari" subtitle={`${rows.length} mesaj`} />

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0">
          {loading ? <AdminListSkeleton /> : rows.length === 0 ? <AdminEmptyState message="Henuz iletisim mesaji yok." /> : (
            <div className="flex flex-col gap-2">
              {rows.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`text-left bg-surface rounded-xl border p-4 transition-colors ${
                    selected?.id === m.id ? "border-brand" : "border-border-soft hover:border-border"
                  } ${!m.is_read ? "ring-2 ring-brand/20" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground truncate">{m.name}</span>
                    {!m.is_read && <Badge color="brand">Yeni</Badge>}
                    {m.subject && <span className="text-xs text-muted truncate">— {m.subject}</span>}
                  </div>
                  <p className="text-xs text-muted truncate">{m.message}</p>
                  <p className="text-xs text-faint mt-1">{m.email} · {formatDate(m.created_at)}</p>
                </button>
              ))}
            </div>
          )}
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-96 shrink-0 bg-surface rounded-xl border border-border-soft p-5 self-start sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground text-lg">&times;</button>
            </div>
            <p className="text-sm text-muted mb-1">{selected.email}</p>
            {selected.phone && <p className="text-sm text-muted mb-1">{selected.phone}</p>}
            {selected.subject && <p className="text-sm font-medium text-foreground mb-3">{selected.subject}</p>}
            <div className="bg-bg-alt rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap mb-4">{selected.message}</div>
            <p className="text-xs text-faint mb-4">{formatDate(selected.created_at)}</p>
            <div className="flex gap-2">
              {!selected.is_read && (
                <Button size="sm" variant="secondary" loading={actionId === selected.id} onClick={() => markRead(selected.id)}>
                  Okundu
                </Button>
              )}
              <Button size="sm" variant="danger" loading={actionId === selected.id} onClick={() => handleDelete(selected.id)}>
                Sil
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
