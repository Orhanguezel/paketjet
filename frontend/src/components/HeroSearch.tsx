"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CityAutocomplete from "@/components/CityAutocomplete";

const TABS = ["Kargo Gönder", "Paket Takip", "Hızlı İlan Aç"] as const;
type Tab = (typeof TABS)[number];

const WEIGHT_OPTIONS = ["1-5 kg", "5-10 kg", "10-20 kg", "20-50 kg", "50+ kg"];

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

type HeroConfig = {
  title?: string;
  subtitle?: string;
  bgImage?: string;
  bgImageDark?: string;
  ctaLabel?: string;
  ctaPath?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryPath?: string;
  // Video döngü ayarları (site_settings'ten)
  videoLoops?: number;       // Kaç tur oynasın (varsayılan: 2)
  videoPauseMs?: number;     // Son karede bekleme ms (varsayılan: 8000)
  videoFadeMs?: number;      // Geçiş süresi ms (varsayılan: 1000)
} | null;

function toMediaUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}

/**
 * Hero video kontrolü:
 * - Video oynar → biter (son kare = paketjet.com yazısı) → orada durur
 * - Bekleme süresi sonra tekrar baştan oynar
 * - Doğal akış, kopukluk yok
 */
// Varsayılanlar — site_settings'ten override edilebilir
const DEFAULT_LOOPS = 2;
const DEFAULT_PAUSE_MS = 8000;
const DEFAULT_FADE_MS = 1000;

function safePlay(video: HTMLVideoElement) {
  const p = video.play();
  if (p) p.catch(() => {});
}

function useHeroVideo(loops = DEFAULT_LOOPS, pauseMs = DEFAULT_PAUSE_MS, fadeMs = DEFAULT_FADE_MS) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opacity, setOpacity] = useState(1);

  const handleEnded = useCallback(() => {
    loopCount.current += 1;
    const video = videoRef.current;
    if (!video) return;

    if (loopCount.current < loops) {
      video.currentTime = 0;
      safePlay(video);
    } else {
      timerRef.current = setTimeout(() => {
        setOpacity(0);

        timerRef.current = setTimeout(() => {
          loopCount.current = 0;
          video.currentTime = 0;
          setOpacity(1);

          timerRef.current = setTimeout(() => {
            safePlay(video);
          }, fadeMs / 2);
        }, fadeMs);
      }, pauseMs);
    }
  }, [loops, pauseMs, fadeMs]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { videoRef, handleEnded, opacity };
}

export default function HeroSearch({ heroConfig }: { heroConfig?: HeroConfig }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Kargo Gönder");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [nereden, setNereden] = useState("");
  const [nereye, setNereye] = useState("");
  const [tarih, setTarih] = useState("");

  const bgUrl = toMediaUrl(heroConfig?.bgImage);
  const isAnimated = bgUrl?.match(/\.(gif|mp4|webm)$/i);
  // GIF → MP4 dönüşümü: .gif uzantısını .mp4 ile değiştir
  const videoUrl = isAnimated && bgUrl
    ? toMediaUrl(heroConfig?.bgImage?.replace(/\.gif$/i, ".mp4"))
    : null;
  const { videoRef, handleEnded, opacity } = useHeroVideo(
    heroConfig?.videoLoops ?? DEFAULT_LOOPS,
    heroConfig?.videoPauseMs ?? DEFAULT_PAUSE_MS,
    heroConfig?.videoFadeMs ?? DEFAULT_FADE_MS,
  );

  function swap() {
    setNereden(nereye);
    setNereye(nereden);
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (nereden) params.set("from", nereden);
    if (nereye) params.set("to", nereye);
    if (tarih) params.set("date", tarih);
    router.push(`/ilanlar${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="relative min-h-150 overflow-x-clip">
      {/* Background — dinamik (site_settings) veya fallback */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          autoPlay
          preload="metadata"
          onEnded={handleEnded}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity, transition: `opacity ${heroConfig?.videoFadeMs ?? DEFAULT_FADE_MS}ms ease-in-out` }}
        />
      ) : bgUrl ? (
        <img
          src={bgUrl}
          alt="PaketJet hero arka plan"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-navy" />
      )}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/90 text-white text-[11px] font-semibold rounded-full">
          <Image
            src="/assets/icons/flash.png"
            alt="Hız etiketi simgesi"
            width={14}
            height={14}
            className="h-3.5 w-3.5"
          />
          Türkiye&apos;nin En Hızlı Kargo Ağı
        </span>

        {/* Heading */}
        <h1 className="max-w-3xl text-5xl md:text-6xl font-black text-white leading-[1.04] tracking-tight" style={{ textWrap: "balance" }}>
          Paketini <span className="text-brand">hızlı</span> ve kullanışlı gönder
        </h1>
        <p className="hero-subtitle max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
          Tüm kargo gereksinimlerinizi tek platformda karşılayın. Gönderi takip ve teslim yönetimi burada.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/ilan-ver")}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-7 text-sm font-black text-white shadow-xl shadow-cta/25 transition-colors hover:bg-cta-dark"
          >
            Hızlı İlan Aç
          </button>
          <p className="text-sm font-black text-white/85">İlan açmak ücretsizdir.</p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-5xl bg-surface rounded-2xl shadow-2xl border border-border-soft px-4 py-4 md:px-5 md:py-5 mt-2 overflow-visible">
          {/* Tabs */}
          <div className="flex items-center gap-2 pb-2 md:pb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMobileOpen(true); }}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full transition-colors ${
                  activeTab === tab
                    ? "bg-brand-dark text-white"
                    : "bg-bg-alt text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form — mobilde tıkla-aç, masaüstünde her zaman açık */}
          <div className={`transition-all duration-300 md:overflow-visible ${mobileOpen ? "max-h-125 opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden md:max-h-125 md:opacity-100"}`}>
            {activeTab === "Kargo Gönder" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-13 md:items-end">
                {/* Nereden */}
                <div className="md:col-span-3">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Nereden</p>
                  <CityAutocomplete
                    value={nereden}
                    onChange={setNereden}
                    placeholder="İl seçin"
                  />
                </div>

                {/* Swap */}
                <button onClick={swap} aria-label="Nereden ve nereye alanlarını değiştir" className="hidden md:flex md:col-span-1 self-end mb-1 h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-bg-alt transition shrink-0">
                  <Image src="/assets/icons/compare.png" alt="Değiştir" width={16} height={16} className="h-4 w-4" />
                </button>

                {/* Nereye */}
                <div className="md:col-span-3">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Nereye</p>
                  <CityAutocomplete
                    value={nereye}
                    onChange={setNereye}
                    placeholder="İl seçin"
                  />
                </div>

                {/* Tarih */}
                <div className="md:col-span-2">
                  <label htmlFor="hero-tarih" className="mb-1.5 text-sm font-semibold text-muted text-left block">Tarih</label>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image src="/assets/icons/order.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0" aria-hidden />
                    <input id="hero-tarih" type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} className="text-sm outline-none text-foreground w-full bg-transparent" />
                  </div>
                </div>

                {/* Ağırlık */}
                <div className="md:col-span-2">
                  <label htmlFor="hero-agirlik" className="mb-1.5 text-sm font-semibold text-muted text-left block">Ağırlık</label>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image src="/assets/icons/box_open.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0 brightness-0 opacity-70" aria-hidden />
                    <select id="hero-agirlik" aria-label="Ağırlık seçin" className="text-sm outline-none text-foreground bg-background pr-1 w-full">
                      {WEIGHT_OPTIONS.map((w) => (<option key={w} className="bg-surface text-foreground">{w}</option>))}
                    </select>
                  </div>
                </div>

                {/* Ara */}
                <button
                  onClick={handleSearch}
                  className="md:col-span-2 inline-flex items-center justify-center h-12 px-6 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-colors shrink-0"
                >
                  İlan Ara
                </button>
              </div>
            )}

            {activeTab === "Paket Takip" && (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Takip numaranızı girin"
                  className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30 text-foreground placeholder:text-faint bg-background"
                />
                <button className="px-8 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                  Takip Et
                </button>
              </div>
            )}

            {activeTab === "Hızlı İlan Aç" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-sm text-muted text-center max-w-md">
                  Taşıyıcı olarak güzergahını ve müsait kapasiteni hemen paylaş. Müşteriler seni bulsun.
                </p>
                <button
                  onClick={() => router.push("/ilan-ver")}
                  className="w-full max-w-sm inline-flex items-center justify-center h-13 px-8 bg-cta text-white text-base font-bold rounded-xl hover:bg-cta-dark transition"
                >
                  Ücretsiz Hızlı İlan Aç →
                </button>
              </div>
            )}
          </div>

          {/* Mobil kapat */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-2 w-full text-center text-xs text-muted hover:text-foreground md:hidden"
            >
              ▲ Kapat
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
