"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import { LockKeyhole } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { apiPut, ApiError } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
export default function PasswordForm() {
  const router = useRouter();
  const [current, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (password.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setBusy(true);
    try {
      await apiPut(API.auth.me, { current_password: current, password });
      setCurrent("");
      setPassword("");
      setConfirm("");
      setSuccess(true);
      useAuthStore.getState().logout();
      router.replace(ROUTES.auth.login + "?passwordChanged=1");
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === "current_password_wrong" ? "Mevcut şifre hatalı." : "Şifre değiştirilemedi. Tekrar dene.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="profile-section">
      <div className="profile-section-title">
        <LockKeyhole size={22} />
        <div>
          <h2>Şifre ve güvenlik</h2>
          <p>Hesabının şifresini buradan değiştirebilirsin.</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-5">
        {[
          { id: "current-password", label: "Mevcut şifre", value: current, set: setCurrent, auto: "current-password" },
          { id: "new-password", label: "Yeni şifre", value: password, set: setPassword, auto: "new-password" },
          { id: "confirm-password", label: "Yeni şifre (tekrar)", value: confirm, set: setConfirm, auto: "new-password" },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
              {field.label}
            </label>
            <PasswordInput
              id={field.id}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              autoComplete={field.auto}
              disabled={busy}
              required
              className="profile-input"
            />
          </div>
        ))}
        <p className="text-xs leading-6 text-muted">
          En az 6 karakter kullan. Tahmin edilmesi zor ve başka hesaplarında kullanmadığın bir şifre seç.
        </p>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-success">
            Şifren başarıyla değiştirildi.
          </p>
        )}
        <Button type="submit" loading={busy} disabled={!current || !password || !confirm}>
          Şifreyi değiştir
        </Button>
      </form>
    </section>
  );
}
