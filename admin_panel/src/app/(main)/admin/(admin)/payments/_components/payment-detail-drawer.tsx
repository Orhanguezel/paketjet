"use client";

import { useState } from "react";

import { AdminDetailDrawer } from "@/components/admin/admin-detail-drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaymentOperationQuery } from "@/integrations/hooks";
import { formatIlanPurchaseMoney, paymentStateLabels } from "@/integrations/shared";

import { emptyPaymentDraft, type PaymentDraft } from "./payment-detail.types";
import { PaymentHistoryTab } from "./payment-history-tab";
import { PaymentNotesTab } from "./payment-notes-tab";
import { PaymentOverviewTab } from "./payment-overview-tab";
import { PaymentReviewTab } from "./payment-review-tab";

type Tab = "overview" | "review" | "notes" | "history";

export function PaymentDetailDrawer({
  reference,
  open,
  onClose,
}: {
  reference: string;
  open: boolean;
  onClose: () => void;
}) {
  const detail = usePaymentOperationQuery(reference, { skip: !reference });
  const payment = detail.currentData;
  const [tabs, setTabs] = useState<Record<string, Tab>>({});
  const [drafts, setDrafts] = useState<Record<string, PaymentDraft>>({});
  const tab = tabs[reference] ?? "overview";
  const draft = drafts[reference] ?? emptyPaymentDraft;
  const updateDraft = (patch: Partial<PaymentDraft>) =>
    setDrafts((current) => ({
      ...current,
      [reference]: { ...(current[reference] ?? emptyPaymentDraft), ...patch },
    }));

  return (
    <AdminDetailDrawer
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      eyebrow="Ödeme incelemesi"
      title="Ödeme kaydı"
      description={`PaketJet ödeme işlem kimliği: ${reference}`}
      className="sm:max-w-[720px]"
    >
      {detail.isError ? (
        <div className="space-y-3">
          <p role="alert" className="text-destructive text-sm">
            Ödeme detayı alınamadı.
          </p>
          <Button variant="outline" onClick={() => detail.refetch()}>
            Tekrar dene
          </Button>
        </div>
      ) : !payment ? (
        <p className="text-muted-foreground text-sm">Ödeme detayı yükleniyor…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <span className="font-medium text-sm">{paymentStateLabels[payment.state] ?? payment.state}</span>
            <strong className="text-lg">{formatIlanPurchaseMoney(payment.amount)}</strong>
          </div>
          <Tabs
            value={tab}
            onValueChange={(value) => setTabs((current) => ({ ...current, [reference]: value as Tab }))}
            className="gap-5"
          >
            <TabsList className="h-auto w-full gap-0 bg-muted/70 p-1">
              <TabsTrigger value="overview" className="min-w-0 px-1.5 py-2 text-xs sm:px-4 sm:text-sm">
                Özet
              </TabsTrigger>
              <TabsTrigger value="review" className="min-w-0 px-1.5 py-2 text-xs sm:px-4 sm:text-sm">
                Karar / İade
              </TabsTrigger>
              <TabsTrigger value="notes" className="min-w-0 px-1.5 py-2 text-xs sm:px-4 sm:text-sm">
                Notlar
              </TabsTrigger>
              <TabsTrigger value="history" className="min-w-0 px-1.5 py-2 text-xs sm:px-4 sm:text-sm">
                Geçmiş
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <PaymentOverviewTab payment={payment} />
            </TabsContent>
            <TabsContent value="review">
              <PaymentReviewTab payment={payment} draft={draft} updateDraft={updateDraft} refetch={detail.refetch} />
            </TabsContent>
            <TabsContent value="notes">
              <PaymentNotesTab reference={reference} draft={draft} updateDraft={updateDraft} refetch={detail.refetch} />
            </TabsContent>
            <TabsContent value="history">
              <PaymentHistoryTab events={payment.events} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </AdminDetailDrawer>
  );
}
