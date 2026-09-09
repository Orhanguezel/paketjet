"use client";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useAuthStore } from "@/modules/auth/auth.store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiPatch } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import ProfilePhoto from "./profile-photo";
import PasswordForm from "./password-form";
export default function ProfilPage() {
  const { user, setUser } = useAuthStore(),
    [name, setName] = useState(user?.full_name ?? ""),
    [phone, setPhone] = useState(user?.phone ?? ""),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!name.trim()) {
      setError("Adını ve soyadını yaz.");
      return;
    }
    setSaving(true);
    try {
      await apiPatch(API.profiles.update, { full_name: name.trim(), phone: phone.trim() });
      setUser({ ...useAuthStore.getState().user!, full_name: name.trim(), phone: phone.trim() });
      setSaved(true);
    } catch {
      setError("Bilgilerin kaydedilemedi. Tekrar dene.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight">Profilim</h1>
        <p className="mt-3 text-muted">Fotoğrafını, iletişim bilgilerini ve hesap şifreni düzenle.</p>
      </div>
      <div className="profile-layout">
        <section className="profile-section">
          <div className="profile-section-title">
            <UserRound size={22} />
            <div>
              <h2>Kişisel bilgiler</h2>
              <p>Seni tanıyalım, iletişim bilgilerin güncel kalsın.</p>
            </div>
          </div>
          <ProfilePhoto disabled={saving} onBusy={setUploading} />
          <form onSubmit={save}>
            <div className="profile-fields">
              <Input
                label="Ad Soyad"
                value={name}
                maxLength={100}
                autoComplete="name"
                required
                disabled={saving}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
              <Input
                label="Telefon"
                type="tel"
                value={phone}
                maxLength={50}
                autoComplete="tel"
                disabled={saving}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setSaved(false);
                }}
              />
              <div className="sm:col-span-2">
                <Input
                  label="E-posta"
                  value={user?.email ?? ""}
                  disabled
                  hint="E-posta adresin hesap kimliğindir ve buradan değiştirilemez."
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-danger">
                {error}
              </p>
            )}
            {saved && (
              <p role="status" className="mt-4 text-sm text-success">
                Bilgilerin kaydedildi.
              </p>
            )}
            <div className="mt-6 border-t border-border-soft pt-5">
              <Button type="submit" loading={saving} disabled={uploading}>
                Bilgileri kaydet
              </Button>
            </div>
          </form>
        </section>
        <PasswordForm />
      </div>
    </div>
  );
}
