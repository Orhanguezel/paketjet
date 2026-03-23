"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIlan, updateIlan } from "@/modules/ilan/ilan.service";
import type { CreateIlanInput, VehicleType } from "@/modules/ilan/ilan.type";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "car",        label: "Otomobil" },
  { value: "van",        label: "Minivan" },
  { value: "truck",      label: "Kamyon" },
  { value: "motorcycle", label: "Motosiklet" },
  { value: "other",      label: "Diğer" },
];

type FormData = Partial<CreateIlanInput>;

export default function IlanDuzenlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getIlan(id)
      .then((ilan) => {
        setForm({
          from_city:          ilan.from_city,
          to_city:            ilan.to_city,
          from_district:      ilan.from_district ?? "",
          to_district:        ilan.to_district ?? "",
          vehicle_type:       ilan.vehicle_type,
          departure_date:     ilan.departure_date?.slice(0, 16) ?? "",
          arrival_date:       ilan.arrival_date?.slice(0, 16) ?? "",
          total_capacity_kg:  parseFloat(ilan.total_capacity_kg),
          price_per_kg:       parseFloat(ilan.price_per_kg),
          is_negotiable:      ilan.is_negotiable,
          title:              ilan.title ?? "",
          description:        ilan.description ?? "",
          contact_phone:      ilan.contact_phone,
          contact_email:      ilan.contact_email ?? "",
        });
      })
      .catch(() => setError("İlan yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  function update(patch: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateIlan(id, form);
      router.push("/panel/tasiyici");
    } catch {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-48 bg-bg-alt rounded" />
        <div className="h-64 bg-bg-alt rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg hover:bg-bg-alt transition-colors text-muted"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-extrabold text-foreground">İlan Düzenle</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-lg">
        {/* Güzergah */}
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Güzergah</h2>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Kalkış Şehri *"
                value={form.from_city ?? ""}
                onChange={(e) => update({ from_city: e.target.value })}
                required
              />
              <Input
                label="Varış Şehri *"
                value={form.to_city ?? ""}
                onChange={(e) => update({ to_city: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Kalkış İlçesi"
                value={form.from_district ?? ""}
                onChange={(e) => update({ from_district: e.target.value })}
              />
              <Input
                label="Varış İlçesi"
                value={form.to_district ?? ""}
                onChange={(e) => update({ to_district: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Araç Tipi</label>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_OPTIONS.map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => update({ vehicle_type: v.value })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                      form.vehicle_type === v.value
                        ? "bg-brand text-white border-brand"
                        : "border-border text-muted hover:border-brand hover:text-brand"
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kapasite & Tarih */}
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Kapasite & Tarih</h2>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Toplam Kapasite (kg) *"
                type="number"
                min="0.1"
                step="0.1"
                value={form.total_capacity_kg ?? ""}
                onChange={(e) => update({ total_capacity_kg: parseFloat(e.target.value) })}
                required
              />
              <Input
                label="Fiyat (₺/kg) *"
                type="number"
                min="0.1"
                step="0.01"
                value={form.price_per_kg ?? ""}
                onChange={(e) => update({ price_per_kg: parseFloat(e.target.value) })}
                required
              />
            </div>
            <Input
              label="Kalkış Tarihi & Saati *"
              type="datetime-local"
              value={form.departure_date ?? ""}
              onChange={(e) => update({ departure_date: e.target.value })}
              required
            />
            <Input
              label="Tahmini Varış (isteğe bağlı)"
              type="datetime-local"
              value={form.arrival_date ?? ""}
              onChange={(e) => update({ arrival_date: e.target.value })}
            />
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_negotiable === 1}
                onChange={(e) => update({ is_negotiable: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded accent-brand"
              />
              <span className="text-sm text-foreground">Fiyat pazarlıklı</span>
            </label>
          </div>
        </div>

        {/* İletişim & Açıklama */}
        <div className="bg-surface rounded-xl border border-border-soft p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">İletişim & Detaylar</h2>
          <div className="flex flex-col gap-3">
            <Input
              label="Telefon *"
              type="tel"
              value={form.contact_phone ?? ""}
              onChange={(e) => update({ contact_phone: e.target.value })}
              required
            />
            <Input
              label="E-posta (isteğe bağlı)"
              type="email"
              value={form.contact_email ?? ""}
              onChange={(e) => update({ contact_email: e.target.value })}
            />
            <Input
              label="İlan Başlığı (isteğe bağlı)"
              value={form.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
            />
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Açıklama</label>
              <textarea
                value={form.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-faint bg-background outline-none focus:ring-2 focus:ring-brand/30 transition resize-none"
                placeholder="Taşıyabileceğiniz eşya türleri, özel notlar…"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit" loading={saving}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
