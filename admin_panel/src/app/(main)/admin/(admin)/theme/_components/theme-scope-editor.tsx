"use client";

import { useEffect, useState } from "react";

import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import {
  useGetScopedThemeQuery,
  useResetScopedThemeMutation,
  useUpdateScopedThemeMutation,
} from "@/integrations/hooks";
import type { ThemeConfig, ThemeScope } from "@/integrations/shared";
import { toThemeDraft } from "@/integrations/shared";
import { applyManagedAdminTheme } from "@/lib/managed-admin-theme";

import { ThemeFields } from "./theme-fields";
import { ThemePreview } from "./theme-preview";

const previewWords: Record<string, string> = {
  "preview.brandName": "PaketJet",
  "preview.navHome": "İlanlar",
  "preview.navProducts": "Nasıl çalışır",
  "preview.navContact": "Destek",
  "preview.headingText": "Örnek başlık",
  "preview.bodyText": "Kart ve metin rengi önizlemesi",
  "preview.mutedText": "İkincil açıklama",
  "preview.primaryButton": "Birincil işlem",
  "preview.accent": "İkincil işlem",
  "preview.darkSection": "Koyu bölüm",
  "preview.darkSectionText": "Koyu alan metni",
  "preview.copyright": "PaketJet alt alanı",
};
const previewText = ((key: string) => previewWords[key] ?? key) as Parameters<typeof ThemePreview>[0]["t"];

export function ThemeScopeEditor({ scope }: { scope: ThemeScope }) {
  const { data, isLoading, isError, refetch } = useGetScopedThemeQuery(scope);
  const [update, { isLoading: saving }] = useUpdateScopedThemeMutation();
  const [reset, { isLoading: resetting }] = useResetScopedThemeMutation();
  const [draft, setDraft] = useState<ThemeConfig | null>(null);
  const [saved, setSaved] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    if (data) {
      const next = toThemeDraft(data);
      setDraft(next);
      setSaved(JSON.stringify(next));
    }
  }, [data]);
  const dirty = Boolean(draft && saved && JSON.stringify(draft) !== saved);
  useUnsavedChanges(dirty);

  async function save() {
    if (!draft) return;
    if (Object.values(draft.colors).some((color) => !/^#[0-9a-fA-F]{6}$/.test(color))) {
      toast.error("Tüm renkler 6 haneli HEX kodu olmalı.");
      return;
    }
    try {
      const result = await update({ scope, draft }).unwrap();
      setDraft(toThemeDraft(result));
      setSaved(JSON.stringify(toThemeDraft(result)));
      if (scope === "admin-panel") applyManagedAdminTheme(result);
      toast.success("Tema kaydedildi. Açık sayfaları yenileyerek görünümü kontrol edebilirsiniz.");
    } catch {
      toast.error("Tema kaydedilemedi.");
    }
  }

  async function restore() {
    try {
      const result = await reset(scope).unwrap();
      setDraft(toThemeDraft(result));
      setSaved(JSON.stringify(toThemeDraft(result)));
      setConfirmReset(false);
      if (scope === "admin-panel") applyManagedAdminTheme(result);
      toast.success("Varsayılan tema geri yüklendi.");
    } catch {
      toast.error("Tema sıfırlanamadı.");
    }
  }

  if (isError)
    return (
      <div role="alert">
        Tema alınamadı. <Button onClick={() => refetch()}>Tekrar dene</Button>
      </div>
    );
  if (isLoading || !draft) return <p className="py-12 text-muted-foreground">Tema yükleniyor…</p>;
  const title = scope === "storefront" ? "PaketJet sitesi" : "Yönetim paneli";
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {scope === "storefront" ? "paketjet.com görünümü" : "panel.paketjet.com görünümü"}
              {data?.enabled ? " · Özelleştirilmiş tema etkin" : " · Kaydedilmiş tema yok; mevcut görünüm korunuyor"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {confirmReset ? (
              <>
                <span className="self-center text-sm">Varsayılanlara dönülsün mü?</span>
                <Button variant="outline" onClick={() => setConfirmReset(false)}>
                  Vazgeç
                </Button>
                <Button variant="destructive" onClick={restore} disabled={resetting}>
                  Sıfırla
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setConfirmReset(true)} disabled={saving || resetting}>
                <RotateCcw className="mr-2 size-4" />
                Varsayılanlara dön
              </Button>
            )}
            <Button onClick={save} disabled={!dirty || saving || resetting}>
              <Save className="mr-2 size-4" />
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <ThemeFields draft={draft} onChange={setDraft} scope={scope} />
        <Card className="h-fit xl:sticky xl:top-20">
          <CardHeader>
            <CardTitle>Canlı önizleme</CardTitle>
            <CardDescription>Kaydetmeden önce renkleri görün.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemePreview colors={draft.colors} t={previewText} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
