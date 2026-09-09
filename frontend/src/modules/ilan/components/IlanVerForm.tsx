"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createIlan, getOwnedIlan, updateIlan } from "@/modules/ilan/ilan.service";
import type { CreateIlanInput } from "@/modules/ilan/ilan.type";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import { initialListing, localListingTime, listingPayload, validateListingStep } from "../ilan-wizard";
import { RouteFields, DetailFields, ContactFields } from "./wizard/ListingFields";
import ListingResult from "./wizard/ListingResult";
import ListingSteps from "./wizard/ListingSteps";
import { ListingSummary, ListingReview } from "./wizard/ListingSummary";
const headings = ["Yolculuğun nereden nereye?", "Aracını ve yolculuğunu anlat", "Sana nasıl ulaşılabilir?", "İlanına son bir kez göz at"];
const descriptions = [
  "İl, ilçe, köy veya açık adres yazabilirsin.",
  "Taşımayı düşündüğün paketler için aracını ve uygun alanı anlat.",
  "Bilgilerin hazırsa kontrol et; gerekirse bu ilana özel düzenle.",
  "Bilgilerini kontrol et. Hazır olduğunda incelemeye gönder.",
];
export default function IlanVerForm({ onSuccess, editId }: { onSuccess?: () => void; editId?: string } = {}) {
  const [form, setForm] = useState<CreateIlanInput>(() => ({
    ...initialListing,
    contact_phone: useAuthStore.getState().user?.phone ?? "",
    contact_email: useAuthStore.getState().user?.email ?? "",
    contact_name: useAuthStore.getState().user?.full_name ?? "",
  }));
  const [departure, setDeparture] = useState(""),
    [arrival, setArrival] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false),
    [loading, setLoading] = useState(!!editId),
    [loadFailed, setLoadFailed] = useState(false),
    [step, setStep] = useState(0);
  const submitLock = useRef(false),
    heading = useRef<HTMLHeadingElement>(null),
    moved = useRef(false),
    formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!editId) return;
    let alive = true;
    getOwnedIlan(editId)
      .then((i) => {
        if (!alive) return;
        if (["sold", "removed"].includes(i.status)) throw new Error("closed");
        setForm({
          from_location: i.from_location,
          to_location: i.to_location,
          from_city: i.from_city,
          to_city: i.to_city,
          from_district: i.from_district ?? "",
          to_district: i.to_district ?? "",
          departure_date: i.departure_date,
          vehicle_type: i.vehicle_type,
          title: i.title ?? "",
          description: i.description ?? "",
          contact_phone: i.contact_phone ?? "",
          contact_email: i.contact_email ?? "",
          contact_name: i.contact_name ?? "",
          contact_address: i.contact_address ?? "",
        });
        setDeparture(localListingTime(i.departure_date));
        setArrival(i.arrival_date ? localListingTime(i.arrival_date) : "");
      })
      .catch(() => {
        if (alive) {
          setError("İlan yüklenemedi veya düzenlemeye kapalı.");
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [editId]);
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step, success]);
  function go(next: number) {
    if (busy) return;
    setError("");
    moved.current = true;
    setStep(next);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitLock.current) return;
    setError("");
    if (step < 3) {
      const message = validateListingStep(step, form, departure, arrival);
      if (message) {
        setError(message);
        return;
      }
      if (!formRef.current?.reportValidity()) return;
      go(step + 1);
      return;
    }
    for (let index = 0; index < 3; index++) {
      const message = validateListingStep(index, form, departure, arrival);
      if (message) {
        go(index);
        setError(message);
        return;
      }
    }
    submitLock.current = true;
    setBusy(true);
    try {
      const data = listingPayload(form, departure, arrival);
      if (editId) await updateIlan(editId, data);
      else await createIlan(data);
      setSuccess(true);
    } catch (e) {
      setError(
        (e as { code?: string }).code === "payment_pending"
          ? "Bu ilan için ödeme bekleniyor. Düzenleme şu anda yapılamıyor."
          : "İlan kaydedilemedi. Bilgilerin korundu; yeniden deneyebilirsin.",
      );
    } finally {
      setBusy(false);
      submitLock.current = false;
    }
  }
  if (loading) return <p role="status">İlan yükleniyor…</p>;
  if (loadFailed)
    return (
      <div role="alert" className="listing-panel">
        <p>{error}</p>
        <Link href={ROUTES.panel.ilanlarim} className="mt-5 inline-flex text-brand">
          İlanlarıma dön
        </Link>
      </div>
    );
  if (success) return <ListingResult headingRef={heading} onSuccess={onSuccess}/>;
  return (
    <div className="listing-wizard">
      <ListingSteps step={step} busy={busy} onStep={go}/>
      <div className="listing-workspace">
        <form ref={formRef} onSubmit={submit} noValidate className="listing-panel" aria-busy={busy}>
          <fieldset disabled={busy} className="min-w-0">
            <div className="listing-step-content" key={step}>
              <h2 ref={heading} tabIndex={-1}>
                {headings[step]}
              </h2>
              <p className="listing-step-description">{descriptions[step]}</p>
              {error && (
                <p role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger-bg p-4 text-sm text-danger">
                  {error}
                </p>
              )}
              {step === 0 && (
                <RouteFields form={form} setForm={setForm} departure={departure} arrival={arrival} setDeparture={setDeparture} setArrival={setArrival} />
              )}{" "}
              {step === 1 && <DetailFields form={form} setForm={setForm} />} {step === 2 && <ContactFields form={form} setForm={setForm} />}{" "}
              {step === 3 && <ListingReview form={form} departure={departure} arrival={arrival} onEdit={go} />}
            </div>
            <div className="listing-controls">
              <div>
                {step > 0 ? (
                  <button type="button" onClick={() => go(step - 1)} className="listing-back">
                    <ArrowLeft size={18} />
                    Geri
                  </button>
                ) : (
                  <span className="text-sm text-muted">1 / 4</span>
                )}
              </div>
              <button type="submit" className="listing-next" disabled={busy}>
                {busy ? "Gönderiliyor…" : step === 3 ? "İncelemeye gönder" : "Devam et"}
                {!busy && <ArrowRight size={18} />}
              </button>
            </div>
          </fieldset>
        </form>
        <ListingSummary form={form} departure={departure} />
      </div>
    </div>
  );
}
