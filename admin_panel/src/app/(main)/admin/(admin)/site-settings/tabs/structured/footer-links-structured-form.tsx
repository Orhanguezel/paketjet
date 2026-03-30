// =============================================================
// FILE: footer-links-structured-form.tsx
// PaketJet — footer_quick_links / footer_legal_links structured editor
// =============================================================

"use client";

import React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FooterLinkItem = {
  title: string;
  path: string;
  pageKey?: string;
};

export type FooterLinksFormState = FooterLinkItem[];

export function footerLinksObjToForm(v: any): FooterLinksFormState {
  if (!Array.isArray(v)) return [];
  return v.map((item: any) => ({
    title: String(item?.title ?? ""),
    path: String(item?.path ?? ""),
    pageKey: item?.pageKey ? String(item.pageKey) : undefined,
  }));
}

export function footerLinksFormToObj(s: FooterLinksFormState) {
  return s.filter((item) => item.title.trim() || item.path.trim());
}

export type FooterLinksStructuredFormProps = {
  value: any;
  onChange: (next: FooterLinksFormState) => void;
  disabled?: boolean;
};

export const FooterLinksStructuredForm: React.FC<FooterLinksStructuredFormProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const items = footerLinksObjToForm(value);

  const update = (index: number, field: keyof FooterLinkItem, val: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const add = () => onChange([...items, { title: "", path: "", pageKey: "" }]);

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
            <GripVertical className="mt-2 size-4 shrink-0 text-muted-foreground" />
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Başlık</Label>
                <Input
                  className="h-8"
                  value={item.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="Ör: Hakkımızda"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Path</Label>
                <Input
                  className="h-8"
                  value={item.path}
                  onChange={(e) => update(i, "path", e.target.value)}
                  placeholder="/hakkimizda"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Page Key</Label>
                <Input
                  className="h-8"
                  value={item.pageKey ?? ""}
                  onChange={(e) => update(i, "pageKey", e.target.value)}
                  placeholder="about"
                  disabled={disabled}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              disabled={disabled}
              className="mt-1"
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Henüz link eklenmemiş.
        </p>
      ) : null}

      <Button type="button" variant="outline" size="sm" onClick={add} disabled={disabled}>
        <Plus className="mr-1 size-3.5" />
        Link Ekle
      </Button>
    </div>
  );
};

FooterLinksStructuredForm.displayName = "FooterLinksStructuredForm";
