"use client";
import { useState } from "react";
import { createRating } from "@/modules/rating/rating.service";
import { Button } from "@/components/ui/Button";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={(hover || value) >= s ? "text-warning" : "text-faint"}>★</span>
        </button>
      ))}
    </div>
  );
}

interface Props {
  bookingId: string;
  isRated: boolean;
  onRated: (bookingId: string) => void;
}

export default function RatingForm({ bookingId, isRated, onRated }: Props) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await createRating({ booking_id: bookingId, score, comment: comment || undefined });
      onRated(bookingId);
      setOpen(false);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (isRated) return <p className="text-xs text-success font-medium">✓ Değerlendirdiniz</p>;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-brand hover:underline font-medium">
        ★ Taşıyıcıyı Değerlendir
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-foreground">Taşıyıcıyı değerlendirin</p>
      <StarPicker value={score} onChange={setScore} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Yorum ekleyin (isteğe bağlı)..."
        rows={2}
        maxLength={500}
        className="w-full text-xs px-3 py-2 bg-bg-alt border border-border-soft rounded-lg text-foreground placeholder:text-faint resize-none focus:outline-none focus:border-brand"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" loading={loading} onClick={handleSubmit}>Gönder</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>İptal</Button>
      </div>
    </div>
  );
}
