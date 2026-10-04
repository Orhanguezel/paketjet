"use client";

import { useState } from "react";

import { ChevronRight, IdCard, RefreshCcw } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListIdentityDocumentsQuery } from "@/integrations/hooks";
import type { IdentityListItem, IdentityStatus } from "@/integrations/shared";

import { IdentityReviewDetail } from "@/components/admin/identity/identity-review-detail";

type Filter = IdentityStatus | "all";
const tabs: { key: Filter; label: string }[] = [
  { key: "pending", label: "Bekleyen" },
  { key: "approved", label: "Onaylı" },
  { key: "rejected", label: "Reddedilen" },
  { key: "all", label: "Tümü" },
];
const statusLabels = { pending: "İnceleniyor", approved: "Onaylandı", rejected: "Reddedildi" } as const;
const ready = (item: IdentityListItem) => item.has_front && item.has_back;

export default function AdminIdentityClient() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data = [], isLoading, isError, refetch } = useListIdentityDocumentsQuery();
  const selected = data.find((item) => item.user_id === selectedId) ?? null;
  const filtered = data.filter((item) => filter === "all" || (ready(item) && item.status === filter));
  const pending = data.filter((item) => ready(item) && item.status === "pending").length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Kimlik doğrulama"
        description="Ön ve arka yüzü birlikte inceleyin; kararı tek başvuru üzerinden verin."
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCcw size={16} /> Yenile
          </Button>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Kimlik durumu filtresi</legend>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filter === tab.key ? "default" : "outline"}
              aria-pressed={filter === tab.key}
              onClick={() => {
                setFilter(tab.key);
                setSelectedId(null);
              }}
            >
              {tab.label}
              {tab.key === "pending" && !isLoading && !isError && (
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-xs">{pending}</span>
              )}
            </Button>
          ))}
        </fieldset>
        <span className="text-muted-foreground text-sm">{filtered.length} başvuru</span>
      </div>
      <Card className="gap-0 overflow-hidden p-0">
        {isError ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p role="alert" className="text-destructive text-sm">
              Kimlik başvuruları yüklenemedi.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tekrar dene
            </Button>
          </div>
        ) : isLoading ? (
          <div className="py-14 text-center text-muted-foreground text-sm">Başvurular yükleniyor…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <IdCard size={30} className="text-primary" />
            <h2 className="font-semibold">
              {filter === "pending" ? "İnceleme bekleyen kimlik yok" : "Bu durumda kayıt yok"}
            </h2>
            <p className="max-w-sm text-muted-foreground text-sm">
              {filter === "pending"
                ? "Ön ve arka yüzü yüklenen yeni başvurular burada listelenecek."
                : "Başka bir durum filtresi seçebilirsiniz."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/70 text-muted-foreground text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Kullanıcı</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Belgeler</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Durum</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Son güncelleme</th>
                  <th className="px-4 py-3 text-right font-semibold sm:px-5">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.user_id}
                    className="cursor-pointer border-border border-t transition-colors hover:bg-muted/40"
                    onClick={() => setSelectedId(item.user_id)}
                  >
                    <td className="min-w-0 px-4 py-4 sm:px-5">
                      <button type="button" className="min-w-0 text-left">
                        <strong className="block font-semibold text-foreground">
                          {item.full_name || "İsimsiz kullanıcı"}
                        </strong>
                        <span className="block break-all text-muted-foreground text-xs">{item.email}</span>
                        <span className="mt-1 block text-muted-foreground text-xs sm:hidden">
                          {ready(item) ? statusLabels[item.status] : "Eksik belge"}
                        </span>
                      </button>
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                      {item.has_front ? "Ön ✓" : "Ön —"} · {item.has_back ? "Arka ✓" : "Arka —"}
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell">
                      <Badge
                        variant={
                          !ready(item)
                            ? "outline"
                            : item.status === "approved"
                              ? "default"
                              : item.status === "rejected"
                                ? "destructive"
                                : "secondary"
                        }
                      >
                        {ready(item) ? statusLabels[item.status] : "Eksik belge"}
                      </Badge>
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-4 text-muted-foreground md:table-cell">
                      {new Date(item.updated_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-4 text-right sm:px-5">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedId(item.user_id)}>
                        <span className="hidden sm:inline">İncele</span>
                        <ChevronRight size={15} />
                        <span className="sr-only sm:hidden">İncele</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <IdentityReviewDetail item={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
