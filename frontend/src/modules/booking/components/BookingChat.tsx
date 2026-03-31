"use client";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/modules/auth/auth.store";
import { getBookingMessages, sendBookingMessage, type BookingMessage } from "../booking-messages.service";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  bookingId: string;
  bookingStatus: string;
}

export default function BookingChat({ bookingId, bookingStatus }: Props) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const canSend = !["cancelled", "delivered"].includes(bookingStatus);

  async function loadMessages() {
    try {
      const msgs = await getBookingMessages(bookingId);
      setMessages(msgs);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 15000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const msg = await sendBookingMessage(bookingId, text.trim());
      setMessages((prev) => [...prev, { ...msg, sender_name: user?.full_name ?? null }]);
      setText("");
    } catch { /* ignore */ }
    finally { setSending(false); }
  }

  return (
    <div className="bg-surface rounded-xl border border-border-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border-soft bg-bg-alt">
        <h3 className="text-sm font-bold text-foreground">Mesajlar</h3>
      </div>

      <div className="h-64 overflow-y-auto px-4 py-3 space-y-2">
        {loading ? (
          <p className="text-xs text-muted text-center py-8 animate-pulse">Yükleniyor...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted text-center py-8">Henüz mesaj yok. İlk mesajı siz gönderin.</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-xl px-3 py-2",
                  msg.is_system ? "bg-warning/10 text-foreground text-center w-full max-w-full" :
                  isMe ? "bg-brand text-white" : "bg-bg-alt text-foreground"
                )}>
                  {!isMe && !msg.is_system && (
                    <p className="text-[10px] font-semibold opacity-60 mb-0.5">{msg.sender_name ?? "Kullanıcı"}</p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className={cn("text-[10px] mt-0.5", isMe ? "text-white/60" : "text-muted")}>
                    {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {canSend && (
        <div className="px-4 py-3 border-t border-border-soft flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg-alt text-foreground text-sm outline-none focus:border-brand"
          />
          <Button size="sm" onClick={handleSend} loading={sending} disabled={!text.trim()}>
            Gönder
          </Button>
        </div>
      )}
    </div>
  );
}
