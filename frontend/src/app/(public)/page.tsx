import type { Metadata } from "next";
import HeroSearch from "@/components/HeroSearch";
import IlanCard from "@/components/IlanCard";
import Link from "next/link";
import Image from "next/image";
import { listIlans } from "@/modules/ilan/ilan.service";
import type { Ilan } from "@/modules/ilan/ilan.type";
import { ROUTES } from "@/config/routes";
import { getPageMetadata } from "@/lib/seo";
import { apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import RouteMapAnimation from "@/components/RouteMapAnimation";
import { WebSiteSchema, ServiceSchema, HowToSchema, BreadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 60;

type HeroConfig = {
  title?: string;
  subtitle?: string;
  bgImage?: string;
  bgImageDark?: string;
  ctaLabel?: string;
  ctaPath?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryPath?: string;
};

async function fetchHeroConfig(): Promise<HeroConfig | null> {
  try {
    const row = await apiGet<{ value: HeroConfig | string }>(API.siteSettings.byKey("homepage_hero"));
    if (!row?.value) return null;
    // API value'yu parsed object veya string olarak dönebilir
    if (typeof row.value === "object") return row.value as HeroConfig;
    return JSON.parse(row.value) as HeroConfig;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home", {
    canonicalPath: "/",
    fallbackDescription: "Türkiye'nin P2P kargo pazaryeri. 81 ilde taşıyıcı ilanlarını keşfet, paketini hızlı ve güvenilir şekilde gönder.",
  });
}

const STATS = [
  {
    label: "Aktif Taşıyıcı",
    value: "1.200+",
    iconSrc: "/assets/icons/delivery.png",
    iconAlt: "Taşıyıcı kamyoneti simgesi",
  },
  {
    label: "Tamamlanan Taşıma",
    value: "48.000+",
    iconSrc: "/assets/icons/box.png",
    iconAlt: "Teslim edilmiş paket simgesi",
  },
  {
    label: "Kapsanan Şehir",
    value: "81",
    iconSrc: "/assets/icons/location.png",
    iconAlt: "Konum iğnesi simgesi",
  },
  {
    label: "Müşteri Memnuniyeti",
    value: "%98",
    iconSrc: "/assets/icons/like.png",
    iconAlt: "Memnuniyet simgesi",
  },
];

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

const HOW_IT_WORKS = [
  { step: "01", title: "Rota Ara", desc: "Gideceğin şehri, tarihi ve ağırlığı gir. Sana uygun taşıyıcıları listeleyelim.", visual: "map" as const },
  { step: "02", title: "Taşıyıcı Seç", desc: "Fiyat, araç tipi ve taşıyıcı puanına göre en iyi seçimi yap.", video: "/uploads/media/hero/step-2-tasiyici-sec.mp4" },
  { step: "03", title: "Paketini Gönder", desc: "Rezervasyonunu onayla, taşıyıcıyla buluş, kargoyu teslim et.", video: "/uploads/media/hero/step-3-paketi-gonder.mp4" },
];

export default async function HomePage() {
  const [featured, heroConfig] = await Promise.all([
    listIlans({ limit: 4 }).then((r) => r.data ?? []).catch(() => [] as Ilan[]),
    fetchHeroConfig(),
  ]);

  return (
    <>
      <WebSiteSchema />
      <ServiceSchema />
      <HowToSchema />
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }]} />
      <div className="bg-background text-foreground">
        <HeroSearch heroConfig={heroConfig} />

        {/* Stats Bar */}
        <div className="bg-navy">
          <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <Image
                  src={s.iconSrc}
                  alt={s.iconAlt}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
                <div>
                  <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nasıl Çalışır */}
        <section className="bg-bg-alt py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="how-it-works-heading text-2xl font-extrabold text-foreground tracking-tight">Nasıl Çalışır?</h2>
              <p className="text-sm text-muted mt-2">3 adımda kargonu gönder</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="relative bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="relative aspect-video bg-navy/5">
                    {"visual" in item && item.visual === "map" ? (
                      <RouteMapAnimation />
                    ) : "video" in item && item.video ? (
                      <video
                        src={`${API_ORIGIN}${item.video}`}
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="none"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="relative p-6">
                    <span className="text-5xl font-black text-brand/10 absolute top-4 right-5 leading-none select-none">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center mb-4">
                      <span className="text-white font-black text-sm">{item.step}</span>
                    </div>
                    <h3 className="font-extrabold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Güncel İlanlar */}
        <section className="bg-background border-t border-border-soft py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Güncel İlanlar</h2>
                <p className="text-sm text-muted mt-0.5">Şu an aktif taşıma ilanları</p>
              </div>
              <Link
                href={ROUTES.ilanlar.list}
                title="Tum tasima ilanlarini gor"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                Tümünü gör
                <Image
                  src="/assets/icons/arrow_forword.png"
                  alt="İleri ok simgesi"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {featured.length > 0 ? (
                featured.map((ilan) => <IlanCard key={ilan.id} ilan={ilan} />)
              ) : (
                <p className="text-sm text-muted text-center py-8">Henüz aktif ilan bulunmuyor.</p>
              )}
            </div>
          </div>
        </section>

        {/* CTA — Taşıyıcı mısın? */}
        <section className="bg-navy py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Taşıyıcı mısın?</h2>
            <p className="text-white/70 text-base mb-8">
              Boş araç kapasiteni ilan aç, müşteriler seni bulsun. Ekstra gelir kazan.
            </p>
            <Link
              href="/ilan-ver"
              title="Ucretsiz tasima ilani ver"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors text-sm"
            >
              Ücretsiz İlan Ver
              <Image
                src="/assets/icons/arrow_forword.png"
                alt="İleri ok simgesi"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
