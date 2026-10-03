"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, IdCard, ImageUp, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  deleteMyIdentityFront,
  fetchMyIdentityFrontUrl,
  getMyIdentity,
  uploadMyIdentityFront,
} from "@/modules/identity/identity.service";
import { prepareIdentityImage } from "@/modules/identity/identity.image";
import type { IdentityFront as Front } from "@/modules/identity/identity.type";

const STATUS = {
  pending: { color: "warning", label: "İnceleniyor" },
  approved: { color: "success", label: "Onaylandı" },
  rejected: { color: "danger", label: "Reddedildi" },
} as const;

export default function IdentityFront({ disabled, onBusy }: { disabled: boolean; onBusy: (busy: boolean) => void }) {
  const cameraInput = useRef<HTMLInputElement>(null),
    fileInput = useRef<HTMLInputElement>(null);
  const [front, setFront] = useState<Front | null>(null),
    [imageUrl, setImageUrl] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [touch, setTouch] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    getMyIdentity()
      .then((state) => setFront(state.front))
      .catch(() => setError("Kimlik bilgin yüklenemedi. Sayfayı yenileyip tekrar dene."))
      .finally(() => setLoading(false));
  }, []);

  // Görsel çerezle korunur; her sürüm değişiminde yeniden alınır, eski yerel URL bırakılır.
  useEffect(() => {
    if (!front) return setImageUrl("");
    let url = "",
      alive = true;
    fetchMyIdentityFrontUrl()
      .then((next) => {
        url = next;
        if (alive) setImageUrl(next);
        else URL.revokeObjectURL(next);
      })
      .catch(() => alive && setImageUrl(""));
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [front?.version]); // eslint-disable-line react-hooks/exhaustive-deps

  function start() {
    setBusy(true);
    onBusy(true);
    setError("");
    setMessage("");
  }
  function finish() {
    setBusy(false);
    onBusy(false);
  }

  async function change(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "") {
      setError("Kimliğinin fotoğrafını seç (JPEG, PNG, WebP veya HEIC).");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Fotoğraf çok büyük. En fazla 25 MB bir fotoğraf seç.");
      return;
    }
    start();
    try {
      let image: Blob;
      try {
        image = await prepareIdentityImage(file);
      } catch {
        setError("Bu fotoğraf açılamadı. Telefon ayarlarından JPEG biçiminde çekmeyi veya başka bir fotoğraf seçmeyi dene.");
        return;
      }
      const state = await uploadMyIdentityFront(image);
      setFront(state.front);
      setMessage("Kimliğinin ön yüzü yüklendi. İnceleme sonucunu burada göreceksin.");
    } catch {
      setError("Kimlik yüklenemedi. Mevcut kaydın korundu; tekrar deneyebilirsin.");
    } finally {
      finish();
    }
  }

  async function remove() {
    if (!window.confirm("Kimliğinin ön yüzünü silmek istediğine emin misin?")) return;
    start();
    try {
      await deleteMyIdentityFront();
      setFront(null);
      setMessage("Kimlik görselin silindi.");
    } catch {
      setError("Kimlik görseli silinemedi. Tekrar dene.");
    } finally {
      finish();
    }
  }

  const locked = busy || disabled || loading,
    status = front ? STATUS[front.status] : null;
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    void change(file);
  };

  return (
    <div className="profile-photo-block identity-block">
      <div className="identity-preview" aria-busy={busy || loading}>
        {imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noopener" title="Büyük görmek için dokun">
            {/* eslint-disable-next-line @next/next/no-img-element -- yerel blob URL, Next Image gerekmez */}
            <img src={imageUrl} alt="Kimliğinin ön yüzü" className="h-full w-full object-cover" />
          </a>
        ) : (
          <IdCard size={40} strokeWidth={1.5} aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Kimlik ön yüzü</h3>
          {status && <Badge color={status.color}>{status.label}</Badge>}
        </div>
        <p className="mt-2 text-sm text-muted">Kimlik kartının ön yüzünü düz, net ve tamamı görünecek şekilde çek.</p>
        {front?.status === "rejected" && front.reject_reason && (
          <p className="mt-2 text-sm text-danger">Ret nedeni: {front.reject_reason}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            ref={cameraInput}
            type="file"
            className="sr-only"
            tabIndex={-1}
            aria-label="Kamerayla kimlik fotoğrafı çek"
            accept="image/*"
            capture="environment"
            disabled={locked}
            onChange={pick}
          />
          <input
            ref={fileInput}
            type="file"
            className="sr-only"
            tabIndex={-1}
            aria-label="Kimlik fotoğrafı seç"
            accept="image/*"
            disabled={locked}
            onChange={pick}
          />
          {touch && (
            <button type="button" disabled={locked} onClick={() => cameraInput.current?.click()} className="profile-photo-button">
              <Camera size={17} />
              Kamerayla çek
            </button>
          )}
          <button type="button" disabled={locked} onClick={() => fileInput.current?.click()} className="profile-photo-button">
            <ImageUp size={17} />
            {busy ? "İşleniyor…" : touch ? "Galeriden seç" : front ? "Kimliği değiştir" : "Kimlik yükle"}
          </button>
          {front && (
            <button type="button" disabled={locked} onClick={remove} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
              <Trash2 size={16} />
              Sil
            </button>
          )}
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
          <ShieldCheck size={14} className="mt-px shrink-0" aria-hidden />
          Görselin herkese açık değildir; yalnızca sen ve doğrulama ekibi görebilir.
        </p>
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
