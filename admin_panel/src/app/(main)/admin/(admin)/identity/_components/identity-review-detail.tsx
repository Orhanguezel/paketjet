"use client";

import { useState } from "react";

import { Check, Clock3, IdCard, X } from "lucide-react";
import { toast } from "sonner";

import { AdminDetailDrawer } from "@/components/admin/admin-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewIdentityDocumentMutation } from "@/integrations/hooks";
import type { IdentityListItem } from "@/integrations/shared";

import IdentityImage from "./identity-image";

const labels = { pending: "İnceleniyor", approved: "Onaylandı", rejected: "Reddedildi" } as const;

export function IdentityReviewDetail({ item, onClose }: { item: IdentityListItem | null; onClose: () => void }) {
  const [review, { isLoading: saving }] = useReviewIdentityDocumentMutation();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const ready = Boolean(item?.has_front && item?.has_back);

  function close() {
    setRejecting(false);
    setReason("");
    onClose();
  }

  async function submit(status: "approved" | "rejected") {
    if (!item) return;
    if (status === "rejected" && !reason.trim()) {
      toast.error("Ret nedeni zorunludur; kullanıcı bunu profilinde görür.");
      return;
    }
    try {
      await review({
        userId: item.user_id,
        status,
        reject_reason: status === "rejected" ? reason.trim() : undefined,
      }).unwrap();
      toast.success(status === "approved" ? "Kimlik onaylandı." : "Kimlik reddedildi.");
      close();
    } catch {
      toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
    }
  }

  return (
    <AdminDetailDrawer
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open && !saving) close();
      }}
      eyebrow="Kimlik doğrulama"
      title={item?.full_name || "İsimsiz kullanıcı"}
      description={item?.email}
      footer={
        item && (
          <div className="flex w-full flex-col gap-3">
            {!ready && (
              <p className="text-muted-foreground text-sm">Karar vermek için ön ve arka yüzün yüklenmesi gerekiyor.</p>
            )}
            {rejecting ? (
              <>
                <Textarea
                  aria-label="Ret nedeni"
                  rows={3}
                  maxLength={255}
                  placeholder="Ret nedenini yazın; kullanıcı profilinde görecek."
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    disabled={saving}
                    onClick={() => {
                      setRejecting(false);
                      setReason("");
                    }}
                  >
                    Vazgeç
                  </Button>
                  <Button variant="destructive" disabled={saving || !reason.trim()} onClick={() => submit("rejected")}>
                    <X size={16} /> Reddet
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={saving || !ready || item.status === "rejected"}
                  onClick={() => setRejecting(true)}
                >
                  <X size={16} /> Reddet
                </Button>
                <Button disabled={saving || !ready || item.status === "approved"} onClick={() => submit("approved")}>
                  <Check size={16} /> Onayla
                </Button>
              </div>
            )}
          </div>
        )
      }
    >
      {item && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                ready
                  ? item.status === "approved"
                    ? "default"
                    : item.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  : "outline"
              }
            >
              {ready ? labels[item.status] : "Eksik belge"}
            </Badge>
            <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
              <Clock3 size={14} /> {new Date(item.updated_at).toLocaleString("tr-TR")}
            </span>
          </div>
          <section className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="mb-3 font-semibold text-sm">Başvuru bilgileri</h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Ad soyad</dt>
                <dd className="mt-1 font-medium">{item.full_name || "Belirtilmedi"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">E-posta</dt>
                <dd className="mt-1 break-all font-medium">{item.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Başvuru tarihi</dt>
                <dd className="mt-1 font-medium">{new Date(item.created_at).toLocaleString("tr-TR")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Son güncelleme</dt>
                <dd className="mt-1 font-medium">{new Date(item.updated_at).toLocaleString("tr-TR")}</dd>
              </div>
            </dl>
          </section>
          <section>
            <div className="mb-3 flex items-center gap-2">
              <IdCard size={18} className="text-primary" />
              <h3 className="font-semibold">Kimlik görselleri</h3>
            </div>
            <p className="mb-4 text-muted-foreground text-sm">
              Görselleri yalnız inceleme gerektiğinde açın. Her açılış kayda geçer.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-sm">Ön yüz</h4>
                {item.has_front ? (
                  <IdentityImage key={`${item.user_id}-front-${item.updated_at}`} userId={item.user_id} side="front" />
                ) : (
                  <p className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">Henüz yüklenmedi</p>
                )}
              </div>
              <div>
                <h4 className="mb-2 font-medium text-sm">Arka yüz</h4>
                {item.has_back ? (
                  <IdentityImage key={`${item.user_id}-back-${item.updated_at}`} userId={item.user_id} side="back" />
                ) : (
                  <p className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">Henüz yüklenmedi</p>
                )}
              </div>
            </div>
          </section>
          {item.status === "rejected" && item.reject_reason && (
            <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h3 className="mb-1 font-semibold text-destructive text-sm">Ret nedeni</h3>
              <p className="text-sm">{item.reject_reason}</p>
            </section>
          )}
        </div>
      )}
    </AdminDetailDrawer>
  );
}
