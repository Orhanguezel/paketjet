"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminGetCustomPage, adminUpdateCustomPage } from "@/modules/admin/admin.service";

export default function AdminSayfaDetayPage() {
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState({
    locale: "tr",
    title: "",
    slug: "",
    module_key: "kurumsal",
    summary: "",
    content: "",
    meta_title: "",
    meta_description: "",
    is_published: 1,
  });

  useEffect(() => {
    adminGetCustomPage(params.id, "tr").then((row) => {
      setForm({
        locale: row.locale,
        title: row.title,
        slug: row.slug,
        module_key: row.module_key,
        summary: row.summary || "",
        content: row.content || "",
        meta_title: row.meta_title || "",
        meta_description: row.meta_description || "",
        is_published: row.is_published,
      });
    });
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await adminUpdateCustomPage(params.id, form);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">Sayfa Düzenle</h1>
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.module_key} onChange={(e) => setForm({ ...form, module_key: e.target.value })} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={3} className="w-full rounded-xl border border-border px-4 py-3 bg-surface" />
      <button className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">Kaydet</button>
    </form>
  );
}
