"use client";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/auth.store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiPatch, apiPut, ApiError } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";

export default function ProfilPage() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Şifre değiştirme
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const updated = await apiPatch(API.profiles.update, {
        full_name: fullName,
        phone,
        avatar_url: avatarUrl
      });
      setUser({ ...user!, ...(updated as object) });
      setSuccess(true);
    } catch {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      // generic storage endpoint: POST /storage/:bucket/upload
      const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
      const res = await fetch(`${BASE_URL}/api/storage/avatars/upload`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}): ${body}`);
      }
      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      setError("Resim yüklenemedi: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPw.length < 6) { setPwError("Yeni şifre en az 6 karakter olmalıdır."); return; }
    if (newPw !== confirmPw) { setPwError("Şifreler eşleşmiyor."); return; }
    setPwSaving(true);
    try {
      await apiPut("/api/auth/user", { current_password: currentPw, password: newPw });
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      if (err instanceof ApiError && err.code === "current_password_wrong") {
        setPwError("Mevcut şifre hatalı.");
      } else {
        setPwError("Şifre değiştirilemedi.");
      }
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Profil</h1>

      <div className="bg-surface rounded-xl border border-border-soft p-6 max-w-md">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-full bg-brand-xlight overflow-hidden border-2 border-brand/10 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-brand font-bold text-2xl">
                  {(fullName || user?.email || "?")[0].toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full uppercase">
              {uploading ? "..." : "Değiştir"}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-lg text-foreground truncate">{fullName || "İsimsiz"}</p>
            <p className="text-sm text-muted truncate">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ad Soyad"
          />
          <Input
            label="Telefon"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xx xxx xx xx"
          />
          <Input
            label="E-posta"
            value={user?.email ?? ""}
            disabled
            hint="E-posta değiştirilemez"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          {success && <p className="text-sm text-success">Kaydedildi!</p>}
          <Button type="submit" loading={saving}>Kaydet</Button>
        </form>
      </div>

      {/* Şifre Değiştirme */}
      <div className="bg-surface rounded-xl border border-border-soft p-6 max-w-md mt-6">
        <h2 className="text-lg font-extrabold text-foreground mb-4">Şifre Değiştir</h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <Input
            label="Mevcut Şifre"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Mevcut şifreniz"
            autoComplete="current-password"
          />
          <Input
            label="Yeni Şifre"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="En az 6 karakter"
            autoComplete="new-password"
          />
          <Input
            label="Yeni Şifre (Tekrar)"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Yeni şifrenizi tekrar girin"
            autoComplete="new-password"
          />
          {pwError && <p className="text-sm text-danger">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-success">Şifreniz başarıyla değiştirildi!</p>}
          <Button type="submit" loading={pwSaving} disabled={!currentPw || !newPw || !confirmPw}>
            Şifreyi Değiştir
          </Button>
        </form>
      </div>
    </div>
  );
}
