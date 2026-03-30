// =============================================================
// FILE: homepage-hero-structured-form.tsx
// PaketJet — homepage_hero structured editor
// Arka plan, başlık, CTA ve video döngü ayarları
// =============================================================

"use client";

import React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const homepageHeroSchema = z
  .object({
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    bgImage: z.string().trim().optional(),
    bgImageDark: z.string().trim().optional(),
    bgOverlayOpacity: z.number().min(0).max(1).optional(),
    ctaLabel: z.string().trim().optional(),
    ctaPath: z.string().trim().optional(),
    ctaSecondaryLabel: z.string().trim().optional(),
    ctaSecondaryPath: z.string().trim().optional(),
    videoLoops: z.number().int().min(1).optional(),
    videoPauseMs: z.number().int().min(0).optional(),
    videoFadeMs: z.number().int().min(0).optional(),
  })
  .passthrough();

export type HomepageHeroFormState = z.infer<typeof homepageHeroSchema>;

const EMPTY: HomepageHeroFormState = {
  title: "", subtitle: "", bgImage: "", bgImageDark: "",
  bgOverlayOpacity: 0.55, ctaLabel: "", ctaPath: "",
  ctaSecondaryLabel: "", ctaSecondaryPath: "",
  videoLoops: 2, videoPauseMs: 8000, videoFadeMs: 1000,
};

export function homepageHeroObjToForm(v: any): HomepageHeroFormState {
  if (!v || typeof v !== "object") return EMPTY;
  const parsed = homepageHeroSchema.safeParse(v);
  return parsed.success ? { ...EMPTY, ...parsed.data } : EMPTY;
}

export function homepageHeroFormToObj(s: HomepageHeroFormState) {
  return { ...s };
}

export type HomepageHeroStructuredFormProps = {
  value: any;
  onChange: (next: HomepageHeroFormState) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
};

export const HomepageHeroStructuredForm: React.FC<HomepageHeroStructuredFormProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const form = homepageHeroObjToForm(value);

  const text = (key: keyof HomepageHeroFormState, label: string, placeholder?: string, opts?: { colSpan2?: boolean }) => (
    <div className={`space-y-2 ${opts?.colSpan2 ? "md:col-span-2" : ""}`} key={key}>
      <Label htmlFor={`hero-${key}`} className="text-sm">{label}</Label>
      <Input
        id={`hero-${key}`}
        className="h-8"
        value={String(form[key] ?? "")}
        placeholder={placeholder}
        onChange={(e) => onChange({ ...form, [key]: e.target.value })}
        disabled={disabled}
      />
    </div>
  );

  const num = (key: keyof HomepageHeroFormState, label: string, help?: string, opts?: { step?: number; min?: number; max?: number }) => (
    <div className="space-y-2" key={key}>
      <Label htmlFor={`hero-${key}`} className="text-sm">{label}</Label>
      <Input
        id={`hero-${key}`}
        type="number"
        className="h-8"
        step={opts?.step ?? 1}
        min={opts?.min ?? 0}
        max={opts?.max}
        value={String(form[key] ?? "")}
        onChange={(e) => onChange({ ...form, [key]: e.target.value === "" ? undefined : Number(e.target.value) })}
        disabled={disabled}
      />
      {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* İçerik */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">İçerik</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {text("title", "Başlık", "Ör: Kargo Göndermek Artık Çok Kolay", { colSpan2: true })}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-subtitle" className="text-sm">Alt Başlık</Label>
            <Textarea
              id="hero-subtitle"
              rows={2}
              value={String(form.subtitle ?? "")}
              onChange={(e) => onChange({ ...form, subtitle: e.target.value })}
              disabled={disabled}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Görsel */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Arka Plan Görseli</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {text("bgImage", "Arka Plan (Light)", "/uploads/media/hero/arkaplan.gif")}
          {text("bgImageDark", "Arka Plan (Dark)", "/uploads/media/hero/arkaplan.gif")}
          {num("bgOverlayOpacity", "Overlay Opaklık", "0-1 arası (0.55 önerilen)", { step: 0.05, min: 0, max: 1 })}
        </div>
      </div>

      <Separator />

      {/* CTA Butonları */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">CTA Butonları</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {text("ctaLabel", "Birincil Buton Metni", "KARGO GÖNDER")}
          {text("ctaPath", "Birincil Buton Linki", "/ilan-ver")}
          {text("ctaSecondaryLabel", "İkincil Buton Metni", "İLANLARI GÖR")}
          {text("ctaSecondaryPath", "İkincil Buton Linki", "/ilanlar")}
        </div>
      </div>

      <Separator />

      {/* Video Döngü Ayarları */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Video Döngü Ayarları</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {num("videoLoops", "Tur Sayısı", "Video kaç tur oynasın", { min: 1, max: 10 })}
          {num("videoPauseMs", "Duraklama (ms)", "Son karede bekleme süresi", { min: 0, step: 1000 })}
          {num("videoFadeMs", "Geçiş Süresi (ms)", "Fade in/out süresi", { min: 0, step: 100 })}
        </div>
      </div>
    </div>
  );
};

HomepageHeroStructuredForm.displayName = "HomepageHeroStructuredForm";
