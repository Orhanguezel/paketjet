"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddPaymentNoteMutation } from "@/integrations/hooks";

import type { PaymentDraft } from "./payment-detail.types";

type Props = {
  reference: string;
  draft: PaymentDraft;
  updateDraft: (patch: Partial<PaymentDraft>) => void;
  refetch: () => void;
};

export function PaymentNotesTab({ reference, draft, updateDraft, refetch }: Props) {
  const [addNote, { isLoading }] = useAddPaymentNoteMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await addNote({ ref: reference, note: draft.note }).unwrap();
      updateDraft({ note: "", noteFeedback: "Not kaydedildi." });
      refetch();
    } catch {
      updateDraft({ noteFeedback: "Not kaydedilemedi. Tekrar deneyin." });
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h3 className="font-semibold">İnceleme notu</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Sağlayıcı destek referansını veya inceleme sonucunu kaydedin. Not eklemek para ya da hak hareketi oluşturmaz.
        </p>
      </div>
      <form className="space-y-4 rounded-xl border border-border p-5" onSubmit={submit}>
        <label htmlFor="payment-review-note" className="block font-medium text-sm">
          İnceleme notu / sağlayıcı destek referansı
        </label>
        <Textarea
          id="payment-review-note"
          required
          minLength={5}
          maxLength={2000}
          rows={6}
          value={draft.note}
          onChange={(event) => updateDraft({ note: event.target.value })}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={isLoading}>Notu kaydet</Button>
          {draft.noteFeedback && <output className="text-sm">{draft.noteFeedback}</output>}
        </div>
      </form>
      {draft.note && (
        <p className="text-muted-foreground text-xs">
          Kaydedilmemiş metin, bu sayfa açıkken sekme veya kayıt değiştirdiğinizde korunur.
        </p>
      )}
    </section>
  );
}
