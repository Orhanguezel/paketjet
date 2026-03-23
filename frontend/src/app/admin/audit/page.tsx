"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListRequestLogs, adminListAuthEvents, type AuditLog, type AuthEvent } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminListSkeleton, AdminEmptyState, AdminPagination } from "@/components/admin";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const LIMIT = 30;

function statusColor(code: number): "success" | "warning" | "danger" | "muted" {
  if (code < 300) return "success";
  if (code < 400) return "warning";
  if (code < 500) return "danger";
  return "danger";
}

const EVENT_COLOR: Record<string, "success" | "danger" | "brand" | "warning" | "muted"> = {
  login: "success", register: "brand", logout: "muted", failed_login: "danger", password_reset: "warning",
};

export default function AdminAuditPage() {
  const [tab, setTab] = useState<"requests" | "auth">("requests");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async (p: number) => {
    setLoading(true);
    try { setLogs(await adminListRequestLogs({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadAuth = useCallback(async (p: number) => {
    setLoading(true);
    try { setEvents(await adminListAuthEvents({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    if (tab === "requests") loadRequests(page);
    else loadAuth(page);
  }, [tab, page, loadRequests, loadAuth]);

  const TABS = [
    { key: "requests" as const, label: "Istek Loglari" },
    { key: "auth" as const, label: "Auth Olaylari" },
  ];

  return (
    <div>
      <AdminPageHeader title="Denetim Kayitlari" />

      <div className="flex items-center gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-brand text-white" : "bg-bg-alt text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <AdminListSkeleton count={8} lines={1} /> : tab === "requests" ? (
        logs.length === 0 ? <AdminEmptyState message="Log bulunamadi." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-border-soft">
                  <th className="pb-2 font-medium">Metod</th>
                  <th className="pb-2 font-medium">Path</th>
                  <th className="pb-2 font-medium">Durum</th>
                  <th className="pb-2 font-medium">Sure</th>
                  <th className="pb-2 font-medium">IP</th>
                  <th className="pb-2 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-border-soft/50 hover:bg-bg-alt/50">
                    <td className="py-2"><Badge color="muted">{l.method}</Badge></td>
                    <td className="py-2 text-foreground font-mono text-xs truncate max-w-xs">{l.path}</td>
                    <td className="py-2"><Badge color={statusColor(l.status_code)}>{l.status_code}</Badge></td>
                    <td className="py-2 text-muted">{l.duration_ms ? `${l.duration_ms}ms` : "—"}</td>
                    <td className="py-2 text-muted text-xs">{l.ip ?? "—"}</td>
                    <td className="py-2 text-faint text-xs">{formatDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        events.length === 0 ? <AdminEmptyState message="Auth olayi bulunamadi." /> : (
          <div className="flex flex-col gap-2">
            {events.map((e) => (
              <div key={e.id} className="bg-surface rounded-xl border border-border-soft p-3 flex items-center gap-3">
                <Badge color={EVENT_COLOR[e.event_type] ?? "muted"}>{e.event_type}</Badge>
                <span className="text-sm text-foreground">{e.user_id?.slice(0, 8) ?? "—"}</span>
                <span className="text-xs text-muted flex-1 truncate">{e.user_agent ?? ""}</span>
                <span className="text-xs text-muted">{e.ip ?? ""}</span>
                <span className="text-xs text-faint shrink-0">{formatDate(e.created_at)}</span>
              </div>
            ))}
          </div>
        )
      )}

      <AdminPagination
        page={page}
        totalPages={Math.ceil((tab === "requests" ? logs.length : events.length) / LIMIT)}
        onPageChange={setPage}
      />
    </div>
  );
}
