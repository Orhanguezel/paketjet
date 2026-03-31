"use client";
import { useState, useEffect } from "react";
import { getBookingDispute, openBookingDispute, type Dispute } from "../booking-messages.service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATUS_LABEL: Record<string, string> = {
  open: "Açık", under_review: "İnceleniyor", resolved: "Çözüldü", closed: "Kapatıldı",
};
const STATUS_COLOR: Record<string, "warning" | "brand" | "success" | "muted"> = {
  open: "warning", under_review: "brand", resolved: "success", closed: "muted",
};

interface Props {
  bookingId: string;
  bookingStatus: string;
}

export default function DisputeSection({ bookingId, bookingStatus }: Props) {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const canOpen = ["confirmed", "in_transit", "awaiting_delivery_confirmation"].includes(bookingStatus);

  useEffect(() => {
    getBookingDispute(bookingId).then(setDispute).catch(() => {}).finally(() => setLoading(false));
  }, [bookingId]);

  async function handleSubmit() {
    if (reason.length < 10) { setError("Sebep en az 10 karakter olmalıdır."); return; }
    setSubmitting(true);
    setError("");
    try {
      const d = await openBookingDispute(bookingId, reason);
      setDispute(d);
      setShowForm(false);
    } catch { setError("Anlaşmazlık açılamadı."); }
    finally { setSubmitting(false); }
  }

  if (loading) return null;

  if (dispute) {
    return (
      <div className="bg-surface rounded-xl border border-border-soft p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Anlaşmazlık</h3>
          <Badge color={STATUS_COLOR[dispute.status]}>{STATUS_LABEL[dispute.status]}</Badge>
        </div>
        <p className="text-sm text-foreground">{dispute.reason}</p>
        {dispute.resolution && (
          <div className="mt-3 p-3 bg-success/5 rounded-lg">
            <p className="text-xs font-semibold text-success mb-1">Admin Çözümü:</p>
            <p className="text-sm text-foreground">{dispute.resolution}</p>
          </div>
        )}
      </div>
    );
  }

  if (!canOpen) return null;

  return (
    <div className="bg-surface rounded-xl border border-border-soft p-4">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="text-xs text-danger hover:underline font-semibold">
          Sorun mu var? Anlaşmazlık bildir
        </button>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Anlaşmazlık Bildir</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sorununuzu detaylı açıklayın (en az 10 karakter)..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-alt text-foreground text-sm outline-none focus:border-brand resize-none"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={handleSubmit} loading={submitting}>Gönder</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Vazgeç</Button>
          </div>
        </div>
      )}
    </div>
  );
}
