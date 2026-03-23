"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createIlan } from "@/modules/ilan/ilan.service";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import type { CreateIlanInput, VehicleType } from "@/modules/ilan/ilan.type";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchableSelect } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { TURKEY_CITIES } from "@/data/turkey-cities";
import { useAuthStore } from "@/modules/auth/auth.store";

const STEPS = ["Güzergah", "Kapasite & Tarih", "İletişim", "Önizleme"];

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "car",        label: "Otomobil" },
  { value: "van",        label: "Minivan" },
  { value: "truck",      label: "Kamyon" },
  { value: "motorcycle", label: "Motosiklet" },
  { value: "other",      label: "Diğer" },
];

type FormData = Partial<CreateIlanInput>;

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={cn(
          "flex-1 h-1.5 rounded-full transition-all",
          i < current ? "bg-brand" : i === current ? "bg-brand/50" : "bg-border-soft"
        )} />
      ))}
    </div>
  );
}

export default function IlanVerForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({ currency: "TRY", is_negotiable: 0, vehicle_type: "car" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(patch: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  const cityOptions = TURKEY_CITIES.map((city) => ({ value: city.value, label: city.label }));
  const fromDistricts = TURKEY_CITIES.find((city) => city.value === form.from_city)?.districts ?? [];
  const toDistricts = TURKEY_CITIES.find((city) => city.value === form.to_city)?.districts ?? [];
  const fromDistrictOptions = fromDistricts.map((district) => ({ value: district, label: district }));
  const toDistrictOptions = toDistricts.map((district) => ({ value: district, label: district }));

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const ilan = await createIlan(form as CreateIlanInput);
      router.push(ROUTES.ilanlar.detail(ilan.id));
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setError("Oturum suresi dolmus. Lutfen tekrar giris yapin.");
          router.push(`/giris?next=/ilan-ver`);
          return;
        }
        if (e.code === "ilan_limit_reached" || e.code === "plan_required") {
          setError(e.code);
        } else {
          setError(`Hata: ${e.code}`);
        }
      } else {
        setError("Ilan olusturulamadi. Lutfen tekrar deneyin.");
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-foreground">{STEPS[step]}</h2>
      </div>

      <StepIndicator current={step} total={STEPS.length} />

      <div className="bg-surface rounded-2xl border border-border-soft p-6">
        {/* Step 0: Route */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <SearchableSelect
                label="Kalkış Şehri *"
                options={cityOptions}
                value={form.from_city ?? ""}
                onChange={(value) => update({ from_city: value, from_district: "" })}
                placeholder="İl seçin"
              />
              <SearchableSelect
                label="Varış Şehri *"
                options={cityOptions}
                value={form.to_city ?? ""}
                onChange={(value) => update({ to_city: value, to_district: "" })}
                placeholder="İl seçin"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SearchableSelect
                label="Kalkış İlçesi"
                options={fromDistrictOptions}
                value={form.from_district ?? ""}
                onChange={(value) => update({ from_district: value })}
                placeholder="İlçe seçin"
                disabled={!form.from_city}
              />
              <SearchableSelect
                label="Varış İlçesi"
                options={toDistrictOptions}
                value={form.to_district ?? ""}
                onChange={(value) => update({ to_district: value })}
                placeholder="İlçe seçin"
                disabled={!form.to_city}
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
        )}

        {/* Step 1: Capacity & Date */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Toplam Kapasite (kg) *"
                type="number"
                min="0.1"
                step="0.1"
                value={form.total_capacity_kg ?? ""}
                onChange={(e) => update({ total_capacity_kg: parseFloat(e.target.value) })}
                placeholder="50"
              />
              <Input
                label="Fiyat (₺/kg) *"
                type="number"
                min="0.1"
                step="0.01"
                value={form.price_per_kg ?? ""}
                onChange={(e) => update({ price_per_kg: parseFloat(e.target.value) })}
                placeholder="5.00"
              />
            </div>
            <Input
              label="Kalkış Tarihi & Saati *"
              type="datetime-local"
              value={form.departure_date ?? ""}
              onChange={(e) => update({ departure_date: e.target.value })}
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
            <Input
              label="Açıklama (isteğe bağlı)"
              value={form.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Taşıyabileceğiniz eşya türleri, özel notlar…"
            />
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Telefon *"
              type="tel"
              value={form.contact_phone ?? (user?.phone || "")}
              onChange={(e) => update({ contact_phone: e.target.value })}
              placeholder="05xx xxx xx xx"
            />
            <Input
              label="E-posta (isteğe bağlı)"
              type="email"
              value={form.contact_email ?? (user?.email || "")}
              onChange={(e) => update({ contact_email: e.target.value })}
              placeholder="ornek@mail.com"
            />
            <Input
              label="İlan Başlığı (isteğe bağlı)"
              value={form.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="İstanbul'dan Ankara'ya eşya taşıyorum"
            />
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Güzergah", `${form.from_city} → ${form.to_city}`],
                ["Araç",     VEHICLE_OPTIONS.find((v) => v.value === form.vehicle_type)?.label ?? form.vehicle_type],
                ["Kapasite", `${form.total_capacity_kg} kg`],
                ["Fiyat",    `₺${form.price_per_kg}/kg${form.is_negotiable ? " (pazarlıklı)" : ""}`],
                ["Kalkış",   form.departure_date ? new Date(form.departure_date).toLocaleString("tr-TR") : "—"],
                ["Telefon",  form.contact_phone],
              ].map(([label, value]) => (
                <div key={label} className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {error === "ilan_limit_reached" && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                <p className="text-sm text-foreground font-semibold">Bu ay icin ilan limitinize ulastiniz.</p>
                <Link href="/panel/tasiyici?tab=abonelik" className="text-sm text-brand font-bold hover:underline mt-1 inline-block">
                  Planinizi yukseltmek icin tiklayin →
                </Link>
              </div>
            )}
            {error === "plan_required" && (
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
                <p className="text-sm text-foreground font-semibold">Ilan vermek icin bir plan satin almaniz gerekiyor.</p>
                <Link href="/panel/tasiyici?tab=abonelik" className="text-sm text-brand font-bold hover:underline mt-1 inline-block">
                  Planlari incele →
                </Link>
              </div>
            )}
            {error && error !== "ilan_limit_reached" && error !== "plan_required" && (
              <p className="text-sm text-danger">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={back}>← Geri</Button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <Button
            onClick={next}
            disabled={
              (step === 0 && (!form.from_city || !form.to_city)) ||
              (step === 1 && (!form.total_capacity_kg || !form.price_per_kg || !form.departure_date)) ||
              (step === 2 && !form.contact_phone)
            }
          >
            İleri →
          </Button>
        ) : (
          <Button onClick={submit} loading={submitting}>
            İlanı Yayınla
          </Button>
        )}
      </div>
    </div>
  );
}
