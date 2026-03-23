"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminDeleteTicket, adminGetTicket, adminUpdateTicket, type AdminSupportTicket } from "@/modules/admin/admin.service";

export default function AdminDestekDetayPage() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<AdminSupportTicket | null>(null);

  useEffect(() => {
    adminGetTicket(params.id).then(setTicket).catch(() => setTicket(null));
  }, [params.id]);

  async function savePatch(patch: Partial<AdminSupportTicket>) {
    const updated = await adminUpdateTicket(params.id, patch);
    setTicket(updated);
  }

  async function remove() {
    if (!confirm("Talebi silmek istiyor musunuz?")) return;
    await adminDeleteTicket(params.id);
    setTicket(null);
  }

  if (!ticket) return <p className="text-sm text-muted">Talep yükleniyor veya bulunamadı.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">{ticket.subject}</h1>
      <div className="rounded-2xl border border-border-soft bg-surface p-5">
        <p className="text-sm text-muted">{ticket.name} · {ticket.email}</p>
        <p className="mt-4 whitespace-pre-wrap text-sm text-foreground">{ticket.message}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <select value={ticket.status} onChange={(e) => savePatch({ status: e.target.value })} className="rounded-xl border border-border px-4 py-3 bg-surface">
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>
        <select value={ticket.priority} onChange={(e) => savePatch({ priority: e.target.value })} className="rounded-xl border border-border px-4 py-3 bg-surface">
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>
      </div>
      <textarea value={ticket.admin_note || ""} onChange={(e) => setTicket({ ...ticket, admin_note: e.target.value })} rows={5} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <div className="flex gap-2">
        <button onClick={() => savePatch({ admin_note: ticket.admin_note || null })} className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">Notu Kaydet</button>
        <button onClick={remove} className="rounded-xl border border-danger px-5 py-3 text-sm font-bold text-danger">Sil</button>
      </div>
    </div>
  );
}
