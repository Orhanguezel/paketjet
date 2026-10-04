"use client";
import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Check, Copy, KeyRound, Trash2 } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/utils";
import { createApiKey, listApiKeys, revokeApiKey, type ApiKey } from "@/modules/developer/developer.service";

export default function GelistiriciPage() {
  const id = useId();
  const [keys, setKeys] = useState<ApiKey[] | null>(null), [max, setMax] = useState(5);
  const [name, setName] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [fresh, setFresh] = useState<{ name: string; key: string } | null>(null), [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try { const r = await listApiKeys(); setKeys(r.data); setMax(r.max_active); setError(""); }
    catch { setError("API anahtarları alınamadı. Sayfayı yenileyip tekrar dene."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setCopied(false);
    try { const r = await createApiKey(name.trim()); setFresh({ name: r.name, key: r.key }); setName(""); await load(); }
    catch (err) { setError((err as { code?: string }).code === "api_key_limit" ? `En fazla ${max} etkin anahtarın olabilir. Kullanmadığın birini iptal et.` : "Anahtar oluşturulamadı. Tekrar dene."); }
    finally { setBusy(false); }
  }
  async function revoke(k: ApiKey) {
    if (!window.confirm(`"${k.name}" anahtarı iptal edilsin mi? Bu anahtarı kullanan entegrasyon hemen çalışmayı durdurur.`)) return;
    try { await revokeApiKey(k.id); await load(); } catch { setError("Anahtar iptal edilemedi. Tekrar dene."); }
  }
  const active = keys?.filter((k) => !k.revoked_at) ?? [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-semibold">Geliştirici</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Kendi sisteminden (ERP, sefer planlama yazılımı, web sitesi) API ile otomatik ilan aç, güncelle ve kapat. API ile açılan ilanlar da sitedeki ilanlar gibi onaydan sonra yayına alınır. <Link href={ROUTES.static.gelistiriciler} className="font-medium text-brand underline">API belgeleri</Link></p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-danger/30 p-4 text-sm text-danger">{error}</p>}
      {fresh && (
        <section role="status" className="space-y-3 rounded-lg border border-warning/40 bg-warning/5 p-5">
          <h2 className="font-semibold">“{fresh.name}” anahtarın hazır</h2>
          <p className="text-sm text-muted">Bu anahtar <strong className="text-foreground">yalnızca şimdi</strong> gösteriliyor; sayfadan çıkınca tekrar göremezsin. Şifre gibi sakla, yalnızca sunucu tarafında kullan, tarayıcı koduna veya herkese açık depolara koyma.</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-md border border-border bg-surface px-3 py-2 text-sm">{fresh.key}</code>
            <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(fresh.key); setCopied(true); } catch { setCopied(false); } }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Kopyalandı" : "Kopyala"}</button>
          </div>
          <button type="button" onClick={() => setFresh(null)} className="text-sm font-medium text-brand">Kaydettim, kapat</button>
        </section>
      )}
      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Yeni API anahtarı</h2>
        <form onSubmit={create} className="mt-4 flex flex-wrap items-end gap-3">
          <label htmlFor={`${id}-name`} className="min-w-64 flex-1 text-sm font-medium">Anahtar adı
            <input id={`${id}-name`} required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn. ERP entegrasyonu" className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <button type="submit" disabled={busy || active.length >= max} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-action px-5 font-semibold text-on-dark disabled:opacity-50"><KeyRound size={18} />{busy ? "Oluşturuluyor…" : "Anahtar oluştur"}</button>
        </form>
        <p className="mt-2 text-xs text-muted">Etkin anahtar: {active.length}/{max}. Her entegrasyon için ayrı anahtar oluştur; biri sızarsa yalnız onu iptal edersin.</p>
      </section>
      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Anahtarların</h2>
        {!keys ? <p className="mt-4 text-sm text-muted">Yükleniyor…</p> : !keys.length ? <p className="mt-4 text-sm text-muted">Henüz API anahtarın yok.</p> : (
          <ul className="mt-4 divide-y divide-border">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="font-medium">{k.name} {k.revoked_at && <span className="ml-2 rounded bg-bg-alt px-2 py-0.5 text-xs text-muted">İptal edildi</span>}</p>
                  <p className="mt-1 text-xs text-muted"><code>{k.prefix}…</code> · Oluşturma {formatDate(k.created_at)} · {k.last_used_at ? `Son kullanım ${formatDate(k.last_used_at)}` : "Henüz kullanılmadı"}</p>
                </div>
                {!k.revoked_at && <button type="button" onClick={() => revoke(k)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm text-danger"><Trash2 size={16} />İptal et</button>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
