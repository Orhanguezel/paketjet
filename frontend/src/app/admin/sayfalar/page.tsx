"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminDeleteCustomPage, adminListCustomPages, type AdminCustomPage } from "@/modules/admin/admin.service";

export default function AdminSayfalarPage() {
  const [rows, setRows] = useState<AdminCustomPage[]>([]);

  useEffect(() => {
    adminListCustomPages({ locale: "tr", limit: 100 }).then(setRows).catch(() => setRows([]));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu sayfayı silmek istiyor musunuz?")) return;
    await adminDeleteCustomPage(id);
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Sayfalar</h1>
          <p className="text-sm text-muted">Kurumsal ve yasal sayfaları yönetin.</p>
        </div>
        <Link href="/admin/sayfalar/yeni" className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white">Yeni Sayfa</Link>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-2xl border border-border-soft bg-surface p-4">
            <div>
              <p className="font-bold text-foreground">{row.title}</p>
              <p className="text-sm text-muted">{row.module_key} · /{row.slug} · sıra {row.display_order}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/sayfalar/${row.id}`} className="rounded-lg border border-border px-3 py-2 text-sm">Düzenle</Link>
              <button onClick={() => handleDelete(row.id)} className="rounded-lg border border-danger px-3 py-2 text-sm text-danger">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
