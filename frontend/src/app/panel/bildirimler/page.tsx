"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/modules/notification/notification.store";
import { getNotifications, markRead, markAllRead } from "@/modules/notification/notification.service";
import type { Notification } from "@/modules/notification/notification.type";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

export default function BildirimlerPage() {
  const { unreadCount, fetchUnreadCount, reset } = useNotificationStore();
  const [items, setItems] = useState<Notification[]>([]);
  const [error,setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    try {
      const res = await getNotifications();
      setItems(res.data ?? []);
    } catch {
      setError("Bildirimler yüklenemedi. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleMarkRead(id: string) {
    try {
      await markRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      fetchUnreadCount();
    } catch {setError("Okunma durumu kaydedilemedi. Tekrar dene.");}
  }

  async function handleMarkAll() {
    try {
      await markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      reset();
    } catch {setError("Okunma durumu kaydedilemedi. Tekrar dene.");}
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Bildirimler</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-brand hover:underline"
          >
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-border p-4">{error} <button onClick={load} className="px-3 py-2 text-brand">Yenile</button></p>}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-alt rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? null : items.length === 0 ? (
        <div className="text-center py-16 text-muted">

          <p className="font-medium">Henüz bildirim yok</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-colors",
                n.is_read
                  ? "bg-surface border-border-soft"
                  : "bg-brand/5 border-brand/20"
              )}
            >
              {/* Unread dot */}
              <div className="pt-1 shrink-0">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  n.is_read ? "bg-transparent" : "bg-action"
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted mt-0.5">{n.message}</p>
                <p className="text-sm text-muted mt-1">{formatDate(n.created_at)}</p>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="min-h-11 shrink-0 px-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  Okundu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
