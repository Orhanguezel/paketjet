"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListAllSeo, adminSavePageSeo, adminSaveGlobalSeo, adminGetGlobalSeo, type SeoPageData, type GlobalSeoData } from "@/modules/admin/admin.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";

/* ── Tabs ──────────────────────────────────────────────────────────────────── */

type Tab = "global" | "pages";

/* ── Page SEO ──────────────────────────────────────────────────────────────── */

const PAGE_KEYS = [
  { key: "home",           label: "Ana Sayfa" },
  { key: "listings",       label: "İlan Listesi" },
  { key: "listing_detail", label: "İlan Detayı" },
  { key: "ilan_ver",       label: "İlan Ver" },
  { key: "fiyat",          label: "Fiyatlandırma" },
  { key: "iletisim",       label: "İletişim" },
  { key: "login",          label: "Giriş" },
  { key: "register",       label: "Üye Ol" },
];

interface SeoForm {
  title: string;
  description: string;
  keywords: string;
  noindex: boolean;
}

function emptyForm(): SeoForm {
  return { title: "", description: "", keywords: "", noindex: false };
}

/* ── Global SEO Form ───────────────────────────────────────────────────────── */

interface GlobalForm {
  site_name: string;
  title_template: string;
  default_description: string;
  default_keywords: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  twitter_site: string;
  author: string;
}

function emptyGlobal(): GlobalForm {
  return {
    site_name: "PaketJet",
    title_template: "%s | PaketJet",
    default_description: "",
    default_keywords: "",
    og_image: "",
    og_type: "website",
    twitter_card: "summary_large_image",
    twitter_site: "",
    author: "",
  };
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AdminSeoPage() {
  const [tab, setTab] = useState<Tab>("global");

  // Page SEO state
  const [pages, setPages] = useState<SeoPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [form, setForm] = useState<SeoForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Global SEO state
  const [globalForm, setGlobalForm] = useState<GlobalForm>(emptyGlobal());
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [globalMsg, setGlobalMsg] = useState("");

  /* ── Load ─────────────────────────────────────────────────────────────────── */

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminListAllSeo();
      setPages(data);
    } catch { setPages([]); }
    finally { setLoading(false); }
  }, []);

  const loadGlobal = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const data = await adminGetGlobalSeo();
      if (data) {
        setGlobalForm({
          site_name: data.site_name ?? "PaketJet",
          title_template: data.title_template ?? "%s | PaketJet",
          default_description: data.default_description ?? "",
          default_keywords: data.default_keywords ?? "",
          og_image: data.og_image ?? "",
          og_type: data.og_type ?? "website",
          twitter_card: data.twitter_card ?? "summary_large_image",
          twitter_site: data.twitter_site ?? "",
          author: data.author ?? "",
        });
      }
    } catch {}
    finally { setGlobalLoading(false); }
  }, []);

  useEffect(() => { loadPages(); loadGlobal(); }, [loadPages, loadGlobal]);

  /* ── Page SEO handlers ────────────────────────────────────────────────────── */

  function handleEdit(key: string) {
    const existing = pages.find((p) => p.pageKey === key);
    setForm({
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      keywords: existing?.keywords ?? "",
      noindex: existing?.robots?.noindex ?? false,
    });
    setEditKey(key);
    setMsg("");
  }

  async function handleSave() {
    if (!editKey) return;
    setSaving(true);
    setMsg("");
    try {
      await adminSavePageSeo(editKey, {
        title: form.title,
        description: form.description,
        keywords: form.keywords,
        robots: { noindex: form.noindex, index: !form.noindex, follow: true },
      });
      setMsg("Kaydedildi");
      await loadPages();
    } catch {
      setMsg("Hata olustu");
    } finally {
      setSaving(false);
    }
  }

  /* ── Global SEO handler ───────────────────────────────────────────────────── */

  async function handleGlobalSave() {
    setGlobalSaving(true);
    setGlobalMsg("");
    try {
      await adminSaveGlobalSeo(globalForm);
      setGlobalMsg("Kaydedildi");
    } catch {
      setGlobalMsg("Hata olustu");
    } finally {
      setGlobalSaving(false);
    }
  }

  /* ── Render ───────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">SEO Ayarlari</h1>
        <p className="text-sm text-muted mt-1">Site geneli ve sayfa bazli SEO meta verilerini duzenleyin.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-bg-alt p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("global")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "global" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Genel SEO
        </button>
        <button
          onClick={() => setTab("pages")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "pages" ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Sayfa SEO
        </button>
      </div>

      {/* ── Global SEO Tab ─────────────────────────────────────────────────── */}
      {tab === "global" && (
        globalLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="bg-surface border border-border-soft rounded-xl p-6 space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Site Adi</label>
              <Input
                value={globalForm.site_name}
                onChange={(e) => setGlobalForm({ ...globalForm, site_name: e.target.value })}
                placeholder="PaketJet"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Title Template</label>
              <Input
                value={globalForm.title_template}
                onChange={(e) => setGlobalForm({ ...globalForm, title_template: e.target.value })}
                placeholder="%s | PaketJet"
              />
              <p className="text-xs text-faint mt-0.5">%s yerine sayfa basligi gelir.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Varsayilan Aciklama (Description)</label>
              <textarea
                value={globalForm.default_description}
                onChange={(e) => setGlobalForm({ ...globalForm, default_description: e.target.value })}
                placeholder="Turkiye'nin P2P kargo pazaryeri..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
              />
              <p className="text-xs text-faint mt-0.5">
                {globalForm.default_description.length}/155 karakter (onerilen: 120-155)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Varsayilan Keywords (virgul ile)</label>
              <Input
                value={globalForm.default_keywords}
                onChange={(e) => setGlobalForm({ ...globalForm, default_keywords: e.target.value })}
                placeholder="kargo, p2p, tasima, lojistik, paketjet"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Author / Publisher</label>
              <Input
                value={globalForm.author}
                onChange={(e) => setGlobalForm({ ...globalForm, author: e.target.value })}
                placeholder="PaketJet"
              />
            </div>

            <hr className="border-border-soft" />

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Open Graph</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">OG Gorsel URL</label>
                  <Input
                    value={globalForm.og_image}
                    onChange={(e) => setGlobalForm({ ...globalForm, og_image: e.target.value })}
                    placeholder="/assets/og-default.png veya https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">OG Type</label>
                  <select
                    value={globalForm.og_type}
                    onChange={(e) => setGlobalForm({ ...globalForm, og_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Twitter Card</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Card Tipi</label>
                  <select
                    value={globalForm.twitter_card}
                    onChange={(e) => setGlobalForm({ ...globalForm, twitter_card: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand"
                  >
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Twitter Hesabi (@)</label>
                  <Input
                    value={globalForm.twitter_site}
                    onChange={(e) => setGlobalForm({ ...globalForm, twitter_site: e.target.value })}
                    placeholder="@paketjet"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleGlobalSave} disabled={globalSaving}>
                {globalSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              {globalMsg && (
                <span className={`text-xs ${globalMsg === "Kaydedildi" ? "text-success" : "text-danger"}`}>
                  {globalMsg}
                </span>
              )}
            </div>
          </div>
        )
      )}

      {/* ── Page SEO Tab ───────────────────────────────────────────────────── */}
      {tab === "pages" && (
        loading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid gap-3">
            {PAGE_KEYS.map(({ key, label }) => {
              const data = pages.find((p) => p.pageKey === key);
              const isEditing = editKey === key;

              return (
                <div key={key} className="bg-surface border border-border-soft rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{label}</span>
                      <Badge color={data ? "success" : "muted"}>
                        {data ? "Ayarli" : "Varsayilan"}
                      </Badge>
                      {data?.robots?.noindex && <Badge color="warning">noindex</Badge>}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => isEditing ? setEditKey(null) : handleEdit(key)}>
                      {isEditing ? "Kapat" : "Duzenle"}
                    </Button>
                  </div>

                  {!isEditing && data && (
                    <div className="text-xs text-muted space-y-0.5">
                      {data.title && <p><strong>Title:</strong> {data.title}</p>}
                      {data.description && <p><strong>Desc:</strong> {data.description}</p>}
                      {data.keywords && <p><strong>Keywords:</strong> {data.keywords}</p>}
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Title</label>
                        <Input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="Sayfa basligi"
                        />
                        <p className="text-xs text-faint mt-0.5">
                          Degiskenler: {"{{from_city}}, {{to_city}}, {{price_per_kg}}"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Sayfa aciklamasi"
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Keywords (virgul ile)</label>
                        <Input
                          value={form.keywords}
                          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                          placeholder="kargo, tasima, lojistik"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`noindex-${key}`}
                          checked={form.noindex}
                          onChange={(e) => setForm({ ...form, noindex: e.target.checked })}
                          className="rounded border-border"
                        />
                        <label htmlFor={`noindex-${key}`} className="text-sm text-muted">
                          noindex (arama motorlarindan gizle)
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                          {saving ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                        {msg && (
                          <span className={`text-xs ${msg === "Kaydedildi" ? "text-success" : "text-danger"}`}>
                            {msg}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
