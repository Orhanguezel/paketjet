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

interface ContactInfo {
  company_name?: string;
  phone?: string;
  phone_2?: string;
  email?: string;
  email_2?: string;
  address?: string;
  city?: string;
  country?: string;
  working_hours?: string;
  maps_embed_url?: string;
}

export function ContactPageClient({ contactInfo }: { contactInfo?: ContactInfo | null }) {
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
        <p className="text-lg text-muted">
          Kurumsal talepler, is birlikleri ve operasyonel destek icin PaketJet ekibiyle dogrudan iletisime gecin.
        </p>
      </div>
      <div className="mb-14 grid gap-4 sm:grid-cols-2">
        <div className="bg-surface border border-border-soft rounded-2xl p-6">
          <div className="mb-2 text-2xl">✉️</div>
          <h3 className="font-semibold text-foreground mb-1">E-posta</h3>
          <p className="text-sm text-muted mb-3">Genellikle 1 is gunu icinde yanit veririz.</p>
          <a href={`mailto:${contactInfo?.email_2 ?? contactInfo?.email ?? "destek@paketjet.com"}`} className="text-sm text-brand font-medium hover:underline">
            {contactInfo?.email_2 ?? contactInfo?.email ?? "destek@paketjet.com"}
          </a>
        </div>
        <div className="bg-surface border border-border-soft rounded-2xl p-6">
          <div className="mb-2 text-2xl">💬</div>
          <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
          <p className="text-sm text-muted mb-3">Hizli sorulariniz icin dogrudan yazin.</p>
          <a
            href={`https://wa.me/${(contactInfo?.phone_2 ?? contactInfo?.phone ?? "+905000000000").replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand font-medium hover:underline"
          >
            {contactInfo?.phone_2 ?? contactInfo?.phone ?? "+90 500 000 00 00"}
          </a>
        </div>
      </div>
      <div className="mb-10 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-border-soft bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Ofis Bilgileri</h2>
          <div className="mt-5 space-y-4 text-sm text-muted">
            <p><span className="font-semibold text-foreground">Sirket:</span> {contactInfo?.company_name ?? "PaketJet Teknoloji A.S."}</p>
            <p><span className="font-semibold text-foreground">Adres:</span> {contactInfo?.address ?? "Cankaya, Ankara, Turkiye"}</p>
            <p><span className="font-semibold text-foreground">Telefon:</span> {contactInfo?.phone ?? "+90 312 000 00 00"}</p>
            <p><span className="font-semibold text-foreground">Calisma Saatleri:</span> {contactInfo?.working_hours ?? "Pazartesi - Cuma: 09:00 - 18:00"}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border-soft bg-surface">
          <iframe
            title="PaketJet ofis konumu"
            src={contactInfo?.maps_embed_url ?? "https://www.google.com/maps?q=Çankaya,Ankara,Turkey&output=embed"}
            className="h-full min-h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
