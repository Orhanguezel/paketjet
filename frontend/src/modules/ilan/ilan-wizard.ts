import { z } from "zod";
import type { CreateIlanInput } from "./ilan.type";
import { parseApiDate } from "@/lib/date";
export const wizardSteps = ["Rota ve tarih", "Araç ve detaylar", "İletişim", "Son kontrol"];
export const vehicleLabels = { car: "Otomobil", van: "Kamyonet", truck: "Kamyon", motorcycle: "Motosiklet", other: "Diğer" } as const;
export const initialListing: CreateIlanInput = {
  from_city: "",
  to_city: "",
  departure_date: "",
  vehicle_type: "car",
  contact_phone: "",
  title: "",
  description: "",
  contact_name: "",
  contact_email: "",
};
export function localListingTime(iso: string) {
  const date = parseApiDate(iso);
  return new Date(date.getTime() + 3 * 3600000).toISOString().slice(0, 16);
}
export function listingDate(value: string) {
  return new Date(`${value}:00+03:00`);
}
export function displayListingTime(value: string) {
  const date = listingDate(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(date)
    : "Tarih seçilmedi";
}
export function validateListingStep(step: number, form: CreateIlanInput, departure: string, arrival: string): string | null {
  if (step === 0) {
    if (!form.from_city.trim() || !form.to_city.trim()) return "Kalkış ve varış adreslerini yaz.";
    const start = listingDate(departure),
      end = arrival ? listingDate(arrival) : null;
    if (!departure || !Number.isFinite(start.getTime()) || start.getTime() <= Date.now()) return "Hareket tarihi gelecekte olmalı. Saatler Türkiye saatidir.";
    if (end && (!Number.isFinite(end.getTime()) || end < start)) return "Varış zamanı hareketten önce olamaz.";
  }
  if (step === 1 && ((form.title?.length ?? 0) > 255 || (form.description?.length ?? 0) > 4000))
    return "Başlık en fazla 255, açıklama en fazla 4000 karakter olabilir.";
  if (step === 2) {
    if (!form.contact_name?.trim()) return "İletişim için adını ve soyadını yaz.";
    if (!/^\+?[0-9 ()-]{10,25}$/.test(form.contact_phone.trim())) return "Geçerli bir telefon numarası yaz.";
    if (form.contact_email?.trim() && !z.email().safeParse(form.contact_email.trim()).success) return "Geçerli bir e-posta adresi yaz.";
  }
  return null;
}
export function listingPayload(form: CreateIlanInput, departure: string, arrival: string): CreateIlanInput {
  return {
    ...form,
    from_city: form.from_city.trim(),
    to_city: form.to_city.trim(),
    departure_date: listingDate(departure).toISOString(),
    arrival_date: arrival ? listingDate(arrival).toISOString() : null,
    contact_name: form.contact_name?.trim(),
    contact_phone: form.contact_phone.trim(),
    contact_email: form.contact_email?.trim() || null,
  };
}
