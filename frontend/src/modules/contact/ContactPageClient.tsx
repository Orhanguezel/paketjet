"use client";

import { useState } from "react";
import { createContact } from "./contact.service";
import type { ContactFormData } from "./contact.type";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactPageClient() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDone(null);
    try {
      await createContact(form);
      setForm(INITIAL_FORM);
      setDone("Mesajınız alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-foreground">İletişim</h1>
        <p className="text-lg text-muted">Kurumsal talepler, iş birlikleri ve genel iletişim için bize yazın.</p>
      </div>
      <div className="mb-14 grid gap-4 sm:grid-cols-2">
        <div className="bg-surface border border-border-soft rounded-2xl p-6">
          <div className="text-2xl mb-2">✉️</div>
          <h3 className="font-semibold text-foreground mb-1">E-posta</h3>
          <p className="text-sm text-muted mb-3">Genellikle 1 iş günü içinde yanıt veririz.</p>
          <a href="mailto:destek@paketjet.com" className="text-sm text-brand font-medium hover:underline">destek@paketjet.com</a>
        </div>
        <div className="bg-surface border border-border-soft rounded-2xl p-6">
          <div className="text-2xl mb-2">💬</div>
          <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
          <p className="text-sm text-muted mb-3">Hızlı sorularınız için doğrudan yazın.</p>
          <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="text-sm text-brand font-medium hover:underline">+90 500 000 00 00</a>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border-soft bg-surface p-6 shadow-sm mb-24">
        <h2 className="mb-6 text-xl font-bold text-foreground">İletişim Formu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Ad Soyad" className="rounded-xl border border-border px-4 py-3 bg-background" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" placeholder="E-posta" className="rounded-xl border border-border px-4 py-3 bg-background" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="Telefon" className="rounded-xl border border-border px-4 py-3 bg-background" />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Konu" className="rounded-xl border border-border px-4 py-3 bg-background" />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} placeholder="Mesajınız" className="sm:col-span-2 rounded-xl border border-border px-4 py-3 bg-background" />
        </div>
        {done ? <p className="mt-4 text-sm text-brand">{done}</p> : null}
        <button disabled={saving} className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">
          {saving ? "Gönderiliyor..." : "Mesajı Gönder"}
        </button>
      </form>
    </div>
  );
}
