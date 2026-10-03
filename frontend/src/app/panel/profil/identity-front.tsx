"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, IdCard, ImageUp, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { deleteMyIdentitySide, fetchMyIdentitySideUrl, getMyIdentity, uploadMyIdentitySide } from "@/modules/identity/identity.service";
import { prepareIdentityImage } from "@/modules/identity/identity.image";
import type { IdentityDocument, IdentitySide, IdentityState } from "@/modules/identity/identity.type";

const STATUS = {
  pending: { color: "warning", label: "İnceleniyor" },
  approved: { color: "success", label: "Onaylandı" },
  rejected: { color: "danger", label: "Reddedildi" },
} as const;
const LABEL = { front: "ön", back: "arka" } as const;

export default function IdentityDocuments({ disabled, onBusy }: { disabled: boolean; onBusy: (busy: boolean) => void }) {
  const [state, setState] = useState<IdentityState>({ front: null, back: null });
  const [loading, setLoading] = useState(true);
  const [activeSide, setActiveSide] = useState<IdentitySide | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getMyIdentity().then(setState)
      .catch(() => setLoadError("Kimlik bilgin yüklenemedi. Sayfayı yenileyip tekrar dene."))
      .finally(() => setLoading(false));
  }, []);

  function setBusy(side: IdentitySide | null) {
    setActiveSide(side);
    onBusy(side !== null);
  }

  return (
    <div>
      {loadError && <p role="alert" className="mb-3 text-sm text-danger">{loadError}</p>}
      <p className="mb-4 text-sm text-muted">Önce kimliğinin ön yüzünü, sonra arka yüzünü yükle. İkisi tamamlanınca tek başvuru olarak incelemeye alınır.</p>
      {(["front", "back"] as const).map((side) => (
        <IdentitySideCard key={side} side={side} document={state[side]} complete={!!state.front && !!state.back}
          disabled={disabled || loading || activeSide !== null || !!loadError || (side === "back" && !state.front && !state.back)}
          busy={activeSide === side} onStart={() => setBusy(side)} onFinish={() => setBusy(null)} onState={setState} />
      ))}
    </div>
  );
}

function IdentitySideCard({ side, document, complete, disabled, busy, onStart, onFinish, onState }: {
  side: IdentitySide; document: IdentityDocument | null; complete: boolean; disabled: boolean; busy: boolean;
  onStart: () => void; onFinish: () => void; onState: (state: IdentityState) => void;
}) {
  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [touch, setTouch] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const label = LABEL[side];
  const version = document?.version;

  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  useEffect(() => {
    if (version == null) {
      setImageUrl("");
      return;
    }
    let url = "", alive = true;
    fetchMyIdentitySideUrl(side).then((next) => {
      url = next;
      if (alive) setImageUrl(next);
      else URL.revokeObjectURL(next);
    }).catch(() => { if (alive) setImageUrl(""); });
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [side, version]);

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
    onStart(); setError(""); setMessage("");
    try {
      let image: Blob;
      try { image = await prepareIdentityImage(file); }
      catch {
        setError("Bu fotoğraf açılamadı. JPEG biçiminde çekmeyi veya başka bir fotoğraf seçmeyi dene.");
        return;
      }
      onState(await uploadMyIdentitySide(side, image));
      setMessage(side === "front" ? "Ön yüz yüklendi. Şimdi arka yüzü yükle." : "Arka yüz yüklendi. Ön ve arka yüz birlikte incelemeye alındı.");
    } catch {
      setError("Kimlik yüklenemedi. Mevcut kaydın korundu; tekrar deneyebilirsin.");
    } finally { onFinish(); }
  }

  async function remove() {
    if (!window.confirm(`Kimliğinin ${label} yüzünü silmek istediğine emin misin? Doğrulama yeniden incelemeye düşer.`)) return;
    onStart(); setError(""); setMessage("");
    try {
      onState(await deleteMyIdentitySide(side));
      setMessage(`Kimliğinin ${label} yüzü silindi.`);
    } catch { setError("Kimlik görseli silinemedi. Tekrar dene."); }
    finally { onFinish(); }
  }

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    void change(file);
  };
  const status = document ? STATUS[document.status] : null;
  return (
    <div className="profile-photo-block identity-block">
      <div className="identity-preview" aria-busy={busy}>
        {imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noopener" title="Büyük görmek için dokun">
            {/* eslint-disable-next-line @next/next/no-img-element -- yerel blob URL, Next Image gerekmez */}
            <img src={imageUrl} alt={`Kimliğinin ${label} yüzü`} className="h-full w-full object-cover" />
          </a>
        ) : <IdCard size={40} strokeWidth={1.5} aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Kimlik {label} yüzü</h3>
          {document && <Badge color={complete ? status!.color : "warning"}>{complete ? status!.label : "Yüklendi"}</Badge>}
        </div>
        <p className="mt-2 text-sm text-muted">
          {side === "back" && !document && !complete ? "Ön yüzü yükledikten sonra arka yüzü düz, net ve tamamı görünecek şekilde çek."
            : `Kimlik kartının ${label} yüzünü düz, net ve tamamı görünecek şekilde çek.`}
        </p>
        {document?.status === "rejected" && document.reject_reason && <p className="mt-2 text-sm text-danger">Ret nedeni: {document.reject_reason}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <input ref={cameraInput} type="file" className="sr-only" tabIndex={-1} aria-label={`Kamerayla kimlik ${label} yüzü çek`}
            accept="image/*" capture="environment" disabled={disabled} onChange={pick} />
          <input ref={fileInput} type="file" className="sr-only" tabIndex={-1} aria-label={`Kimlik ${label} yüzü fotoğrafı seç`}
            accept="image/*" disabled={disabled} onChange={pick} />
          {touch && <button type="button" disabled={disabled} onClick={() => cameraInput.current?.click()} className="profile-photo-button">
            <Camera size={17} /> Kamerayla çek
          </button>}
          <button type="button" disabled={disabled} onClick={() => fileInput.current?.click()} className="profile-photo-button">
            <ImageUp size={17} /> {busy ? "İşleniyor…" : touch ? "Galeriden seç" : document ? "Kimliği değiştir" : "Kimlik yükle"}
          </button>
          {document && <button type="button" disabled={disabled} onClick={remove} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
            <Trash2 size={16} /> Sil
          </button>}
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
          <ShieldCheck size={14} className="mt-px shrink-0" aria-hidden />
          Görselin herkese açık değildir; yalnızca sen ve doğrulama ekibi görebilir.
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
        {message && !(side === "front" && complete) && <p role="status" className="mt-3 text-sm text-success">{message}</p>}
      </div>
    </div>
  );
}
