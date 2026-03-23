"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminCreateCustomPage } from "@/modules/admin/admin.service";

export default function AdminYeniSayfaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    module_key: "kurumsal",
    locale: "tr",
    title: "",
    slug: "",
    summary: "",
    content: "",
    meta_title: "",
    meta_description: "",
    is_published: 1,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const row = await adminCreateCustomPage(form);
    router.push(`/admin/sayfalar/${row.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">Yeni Sayfa</h1>
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Başlık" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="Slug" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.module_key} onChange={(e) => setForm({ ...form, module_key: e.target.value })} placeholder="Module key" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} placeholder="Özet" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} placeholder="HTML içerik" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="Meta title" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={3} placeholder="Meta description" className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <button className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">Sayfayı Oluştur</button>
    </form>
  );
}
