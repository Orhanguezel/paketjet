"use client";

import { useEffect, useState } from "react";
import {
  adminCreateFaq,
  adminDeleteFaq,
  adminListFaqs,
  adminUpdateFaq,
  type AdminFaq,
} from "@/modules/admin/admin.service";

const EMPTY_FORM = { locale: "tr", category: "genel", question: "", answer: "", is_published: 1 };

export default function AdminSssPage() {
  const [rows, setRows] = useState<AdminFaq[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);

  async function load() {
    setRows(await adminListFaqs({ locale: "tr", limit: 100 }));
  }

  useEffect(() => {
    load().catch(() => setRows([]));
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await adminCreateFaq(form);
    setForm(EMPTY_FORM);
    await load();
  }

  async function togglePublished(row: AdminFaq) {
    await adminUpdateFaq(row.id, { locale: row.locale, is_published: row.is_published ? 0 : 1 });
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">SSS Yönetimi</h1>
        <p className="text-sm text-muted">Sık sorulan soruları ekleyin, güncelleyin ve yayına alın.</p>
      </div>
      <form onSubmit={handleCreate} className="rounded-2xl border border-border-soft bg-surface p-5 space-y-4">
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required placeholder="Soru" className="w-full rounded-xl border border-border px-4 py-3 bg-background" />
        <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required rows={5} placeholder="Cevap" className="w-full rounded-xl border border-border px-4 py-3 bg-background" />
        <button className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">SSS Ekle</button>
      </form>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-border-soft bg-surface p-4">
            <p className="font-bold text-foreground">{row.question}</p>
            <p className="mt-2 text-sm text-muted">{row.answer}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => togglePublished(row)} className="rounded-lg border border-border px-3 py-2 text-sm">
                {row.is_published ? "Yayından Kaldır" : "Yayına Al"}
              </button>
              <button onClick={() => adminDeleteFaq(row.id).then(load)} className="rounded-lg border border-danger px-3 py-2 text-sm text-danger">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
