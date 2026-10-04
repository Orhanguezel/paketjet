"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ThemeScope } from "@/integrations/shared";

import { ThemeScopeEditor } from "./theme-scope-editor";

export default function AdminThemeClient() {
  const [scope, setScope] = useState<ThemeScope>("storefront");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Tema yönetimi</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Site ve yönetim panelinin renklerini, yazı tipini ve köşe biçimini ayrı ayrı düzenleyin.
        </p>
      </div>
      <Tabs value={scope} onValueChange={(value) => setScope(value as ThemeScope)}>
        <TabsList className="h-auto p-1">
          <TabsTrigger value="storefront" className="px-5 py-2">
            Site teması
          </TabsTrigger>
          <TabsTrigger value="admin-panel" className="px-5 py-2">
            Admin paneli teması
          </TabsTrigger>
        </TabsList>
        <TabsContent value="storefront" forceMount className="mt-5 data-[state=inactive]:hidden">
          <ThemeScopeEditor scope="storefront" />
        </TabsContent>
        <TabsContent value="admin-panel" forceMount className="mt-5 data-[state=inactive]:hidden">
          <ThemeScopeEditor scope="admin-panel" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
