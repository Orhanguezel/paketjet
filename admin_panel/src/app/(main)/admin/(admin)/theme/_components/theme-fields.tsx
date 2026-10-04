"use client";

import type { Dispatch, SetStateAction } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ThemeConfig } from "@/integrations/shared";
import { groupThemeColorTokens, RADIUS_OPTIONS, THEME_FONT_OPTIONS } from "@/integrations/shared";
import { themeFontStack } from "@/lib/managed-admin-theme";

import { ColorField } from "./color-field";

export function ThemeFields({
  draft,
  onChange,
  scope,
}: {
  draft: ThemeConfig;
  onChange: Dispatch<SetStateAction<ThemeConfig | null>>;
  scope: "storefront" | "admin-panel";
}) {
  const groups = groupThemeColorTokens();
  return (
    <Tabs defaultValue="colors" className="min-w-0">
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="colors">Renkler</TabsTrigger>
        <TabsTrigger value="typography">Yazı tipi</TabsTrigger>
        <TabsTrigger value="general">Genel</TabsTrigger>
      </TabsList>
      <TabsContent value="colors" className="mt-4 space-y-4">
        {Array.from(groups.entries()).map(([group, keys]) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle className="text-base">{group}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {keys.map((key) => (
                <ColorField
                  key={key}
                  tokenKey={key}
                  value={draft.colors[key]}
                  onChange={(token, value) =>
                    onChange((current) => current && { ...current, colors: { ...current.colors, [token]: value } })
                  }
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="typography" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Yazı tipleri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            {(["fontHeading", "fontBody"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key === "fontHeading" ? "Başlık yazı tipi" : "Gövde yazı tipi"}</Label>
                <select
                  id={key}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3"
                  value={draft.typography[key]}
                  onChange={(event) =>
                    onChange(
                      (current) =>
                        current && { ...current, typography: { ...current.typography, [key]: event.target.value } },
                    )
                  }
                >
                  {THEME_FONT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <p style={{ fontFamily: themeFontStack(draft.typography[key]) }}>PaketJet ile doğrudan iletişim.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="general" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Köşeler ve görünüm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="theme-radius">Köşe yuvarlaklığı</Label>
              <select
                id="theme-radius"
                className="flex h-10 rounded-md border border-input bg-background px-3"
                value={draft.radius}
                onChange={(event) =>
                  onChange((current) => current && { ...current, radius: event.target.value as ThemeConfig["radius"] })
                }
              >
                {RADIUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-mode">Varsayılan açık/koyu görünüm</Label>
              <select
                id="theme-mode"
                className="flex h-10 rounded-md border border-input bg-background px-3"
                value={draft.darkMode}
                onChange={(event) =>
                  onChange(
                    (current) => current && { ...current, darkMode: event.target.value as ThemeConfig["darkMode"] },
                  )
                }
              >
                <option value="light">Açık</option>
                <option value="dark">Koyu</option>
                <option value="system">Cihaz tercihi</option>
              </select>
              <p className="text-muted-foreground text-xs">
                {scope === "storefront"
                  ? "Ziyaretçinin kendi görünüm tercihi korunur."
                  : "Bu seçim panelin varsayılan görünümüdür."}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
