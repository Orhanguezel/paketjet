"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApproveBankTransferMutation, useRejectBankTransferMutation } from "@/integrations/hooks";
import type { PaymentOperation } from "@/integrations/shared";

import type { PaymentDraft } from "./payment-detail.types";
import ShopierRefund from "./shopier-refund";

type Props = {
  payment: PaymentOperation;
  draft: PaymentDraft;
  updateDraft: (patch: Partial<PaymentDraft>) => void;
  refetch: () => void;
};

export function PaymentReviewTab({ payment, draft, updateDraft, refetch }: Props) {
  const [approve, approval] = useApproveBankTransferMutation();
  const [reject, rejection] = useRejectBankTransferMutation();
  const bank = ["bank_test", "bank_transfer"].includes(payment.provider);
  const actionableBank = bank && ["pending", "review"].includes(payment.state);

  async function approveBank(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await approve({
        ref: payment.payment_ref,
        amount: Number(payment.amount),
        transaction_id: payment.provider === "bank_transfer" ? draft.transactionId : undefined,
        confirmed_on_statement: true,
      }).unwrap();
      updateDraft({ actionFeedback: "Onaylandı.", bankConfirmed: false });
      refetch();
    } catch {
      updateDraft({ actionFeedback: "Onay başarısız. Tutarı, banka referansını ve işlem durumunu kontrol edin." });
    }
  }

  async function rejectBank(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await reject({ ref: payment.payment_ref, reason: draft.rejectReason }).unwrap();
      updateDraft({ actionFeedback: "Talep reddedildi.", rejectReason: "" });
      refetch();
    } catch {
      updateDraft({ actionFeedback: "Red işlemi başarısız. Yeniden deneyin." });
    }
  }

  return (
    <div className="space-y-5">
      {actionableBank && (
        <section className="space-y-4 rounded-xl border border-border p-5">
          <div>
            <h3 className="font-semibold">Havale kararı</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              {payment.provider === "bank_test"
                ? "Test işlemi. Para hareketi aramayın; yalnızca demo akışını onaylayın."
                : "Banka ekstresinde tutarı, alıcıyı ve işlem referansını doğrulayın. Kullanıcı bildirimi tek başına yeterli değildir."}
            </p>
          </div>
          {payment.state === "review" && (
            <form className="space-y-3 rounded-lg bg-muted/40 p-4" onSubmit={approveBank}>
              {payment.provider === "bank_transfer" && (
                <label htmlFor="bank-transaction-id" className="block space-y-2 text-sm">
                  Banka işlem kimliği
                  <Input
                    id="bank-transaction-id"
                    required
                    minLength={6}
                    value={draft.transactionId}
                    onChange={(event) => updateDraft({ transactionId: event.target.value })}
                  />
                </label>
              )}
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  required
                  checked={draft.bankConfirmed}
                  onChange={(event) => updateDraft({ bankConfirmed: event.target.checked })}
                />
                {payment.provider === "bank_test" ? "Test onayı veriyorum" : "Banka hareketini ve tutarı doğruladım"}
              </label>
              <Button disabled={!draft.bankConfirmed || approval.isLoading}>Onayla ve erişimi aç</Button>
            </form>
          )}
          <form className="space-y-3 rounded-lg bg-muted/40 p-4" onSubmit={rejectBank}>
            <label htmlFor="bank-reject-reason" className="block space-y-2 text-sm">
              Red nedeni
              <Textarea
                id="bank-reject-reason"
                minLength={10}
                required
                value={draft.rejectReason}
                onChange={(event) => updateDraft({ rejectReason: event.target.value })}
              />
            </label>
            <Button type="submit" variant="destructive" disabled={rejection.isLoading}>
              Talebi reddet
            </Button>
          </form>
        </section>
      )}
      {payment.provider === "shopier" && (
        <ShopierRefund
          reference={payment.payment_ref}
          state={payment.state}
          hasOrder={!!payment.provider_payment_id}
          refundRequested={!!payment.receipt?.refundId}
          note={draft.refundNote}
          confirmed={draft.refundConfirmed}
          message={draft.actionFeedback}
          onNoteChange={(refundNote) => updateDraft({ refundNote })}
          onConfirmedChange={(refundConfirmed) => updateDraft({ refundConfirmed })}
          onMessage={(actionFeedback) => updateDraft({ actionFeedback })}
          onDone={refetch}
        />
      )}
      {!actionableBank && payment.provider !== "shopier" && (
        <p className="rounded-xl border border-border border-dashed p-5 text-muted-foreground text-sm">
          Bu işlem durumunda kullanılabilir bir karar veya iade işlemi yok.
        </p>
      )}
      <p className="rounded-xl border border-border bg-muted/30 p-4 text-muted-foreground text-sm">
        İade ve tahsilat sağlayıcı kayıtlarıyla doğrulanmalıdır. Not eklemek para veya hak hareketi oluşturmaz. Kart
        bilgisi veya parola yazmayın.
      </p>
      {bank && draft.actionFeedback && <output className="block text-sm">{draft.actionFeedback}</output>}
    </div>
  );
}
