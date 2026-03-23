"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminListTickets, type AdminSupportTicket } from "@/modules/admin/admin.service";

export default function AdminDestekPage() {
  const [rows, setRows] = useState<AdminSupportTicket[]>([]);

  useEffect(() => {
    adminListTickets({ limit: 100 }).then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Destek Talepleri</h1>
          <p className="text-sm text-muted">Kullanıcı destek taleplerini yönetin.</p>
        </div>
        <Link href="/admin/destek/sss" className="rounded-xl border border-border px-4 py-2 text-sm font-bold">SSS Yönetimi</Link>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <Link key={row.id} href={`/admin/destek/${row.id}`} className="block rounded-2xl border border-border-soft bg-surface p-4 transition hover:border-brand">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">{row.subject}</p>
                <p className="text-sm text-muted">{row.name} · {row.email}</p>
              </div>
              <div className="text-right text-sm text-muted">
                <p>{row.status}</p>
                <p>{row.priority}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
