"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useAuthStore } from "@/modules/auth/auth.store";
import { apiPatch } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";

export default function ProfilePhoto({ disabled, onBusy }: { disabled: boolean; onBusy: (busy: boolean) => void }) {
  const { user, setUser } = useAuthStore(),
    input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function savePhoto(url: string) {
    await apiPatch(API.profiles.update, { avatar_url: url });
    setUser({ ...useAuthStore.getState().user!, avatar_url: url });
  }
  async function change(file?: File) {
    if (!file) return;
    setError("");
    setMessage("");
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("PNG, JPEG, WebP veya GIF biçiminde, en fazla 5 MB bir fotoğraf seç.");
      return;
    }
    setBusy(true);
    onBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "") + API.storage.avatarUpload, {
        method: "POST",
        body,
        credentials: "include",
      });
      if (!response.ok) throw new Error("upload_failed");
      const result = await response.json();
      if (typeof result.url !== "string" || !result.url) throw new Error("missing_url");
      const photo = new window.Image();
      photo.src = result.url;
      await photo.decode();
      await savePhoto(result.url);
      setMessage("Fotoğrafın yüklendi ve kaydedildi.");
    } catch {
      setError("Fotoğraf yüklenemedi veya kaydedilemedi. Mevcut fotoğrafın korundu; tekrar deneyebilirsin.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    onBusy(true);
    setError("");
    setMessage("");
    try {
      await savePhoto("");
      setMessage("Profil fotoğrafın kaldırıldı.");
    } catch {
      setError("Fotoğraf kaldırılamadı. Tekrar dene.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return (
    <div className="profile-photo-block">
      <div className="profile-photo-preview">
        {user?.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt="Profil fotoğrafın"
            width={112}
            height={112}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{(user?.full_name || user?.email || "P").slice(0, 1).toLocaleUpperCase("tr-TR")}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">Profil fotoğrafı</h3>
        <p className="mt-2 text-sm text-muted">PNG, JPEG, WebP veya GIF · En fazla 5 MB</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            ref={input}
            type="file"
            className="sr-only"
            aria-label="Profil fotoğrafı seç"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={busy || disabled}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              void change(file);
            }}
          />
          <button type="button" disabled={busy || disabled} onClick={() => input.current?.click()} className="profile-photo-button">
            <Camera size={17} />
            {busy ? "İşleniyor…" : user?.avatar_url ? "Fotoğrafı değiştir" : "Fotoğraf yükle"}
          </button>
          {user?.avatar_url && (
            <button
              type="button"
              disabled={busy || disabled}
              onClick={remove}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted"
            >
              <Trash2 size={16} />
              Kaldır
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">Fotoğraf seçtiğinde otomatik kaydedilir.</p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-3 text-sm text-success">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
