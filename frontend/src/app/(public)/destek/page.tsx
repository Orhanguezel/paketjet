"use client";

import { useEffect, useState } from "react";
import { listFaqs, createSupportTicket } from "@/modules/support/support.service";
import type { SupportFaq, SupportTicketCreateInput } from "@/modules/support/support.type";

const INITIAL_FORM: SupportTicketCreateInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  category: "genel",
};

export default function DestekPage() {
  const [faqs, setFaqs] = useState<SupportFaq[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    listFaqs({ locale: "tr", limit: 20 })
      .then(setFaqs)
      .catch(() => setFaqs([]));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDone(null);
    try {
      await createSupportTicket(form);
      setForm(INITIAL_FORM);
      setDone("Destek talebiniz alındı. Ekibimiz kısa süre içinde size dönüş yapacak.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <section className="bg-bg-alt border-b border-border-soft">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Destek Merkezi</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Sık sorulan sorular ve destek talebi</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Önce SSS bölümüne göz atın. Çözüm bulamazsanız aşağıdaki formdan destek talebi oluşturun.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="rounded-2xl border border-border-soft bg-surface p-5">
              <summary className="cursor-pointer list-none text-base font-bold text-foreground">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-border-soft bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-extrabold">Destek Talebi Oluştur</h2>
          <div className="mt-5 grid gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Ad Soyad" className="rounded-xl border border-border px-4 py-3 bg-background" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" placeholder="E-posta" className="rounded-xl border border-border px-4 py-3 bg-background" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicketCreateInput["category"] })} className="rounded-xl border border-border px-4 py-3 bg-background">
              <option value="genel">Genel</option>
              <option value="kargo">Kargo</option>
              <option value="odeme">Ödeme</option>
              <option value="hesap">Hesap</option>
              <option value="teknik">Teknik</option>
            </select>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Konu" className="rounded-xl border border-border px-4 py-3 bg-background" />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} placeholder="Sorununuzu veya talebinizi yazın" className="rounded-xl border border-border px-4 py-3 bg-background" />
          </div>
          {done ? <p className="mt-4 text-sm text-brand">{done}</p> : null}
          <button disabled={saving} className="mt-6 w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">
            {saving ? "Gönderiliyor..." : "Talebi Gönder"}
          </button>
        </form>
      </section>
    </div>
  );
}
