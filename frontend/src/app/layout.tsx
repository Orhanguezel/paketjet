import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { OrganizationSchema } from "@/components/JsonLd";
import SplashLoader from "@/components/SplashLoader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8078";

async function fetchGlobalSeo() {
  try {
    const [seoRes, metaRes] = await Promise.all([
      fetch(`${API_URL}/api/site_settings/site_seo?locale=tr`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/site_settings/site_meta_default?locale=tr`, { next: { revalidate: 300 } }),
    ]);
    const seo = seoRes.ok ? ((await seoRes.json())?.value ?? null) : null;
    const meta = metaRes.ok ? ((await metaRes.json())?.value ?? null) : null;
    return { seo, meta };
  } catch {
    return { seo: null, meta: null };
  }
}

async function fetchIcons() {
  try {
    const [iconsRes, faviconRes, appleRes] = await Promise.all([
      fetch(`${API_URL}/api/site_settings/seo_app_icons`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/site_settings/site_favicon?locale=*`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/site_settings/site_apple_touch_icon?locale=*`, { next: { revalidate: 300 } }),
    ]);
    const icons = iconsRes.ok ? ((await iconsRes.json())?.value ?? {}) : {};
    const favicon = faviconRes.ok ? ((await faviconRes.json())?.value ?? null) : null;
    const appleTouchIcon = appleRes.ok ? ((await appleRes.json())?.value ?? null) : null;
    return {
      ...icons,
      favicon: typeof favicon === "string" && favicon ? favicon : icons?.favicon,
      appleTouchIcon: typeof appleTouchIcon === "string" && appleTouchIcon ? appleTouchIcon : icons?.appleTouchIcon,
    };
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo, meta }, icons] = await Promise.all([fetchGlobalSeo(), fetchIcons()]);
  const bingVerification = process.env.BING_VERIFICATION ?? "";

  const siteName = seo?.site_name ?? "PaketJet";
  const titleTemplate = seo?.title_template ?? "%s | PaketJet";
  const titleDefault = meta?.title ?? seo?.title_default ?? "PaketJet — Hizli ve Guvenilir Kargo";
  const description = meta?.description ?? seo?.description
    ?? "PaketJet | Turkiye'nin P2P kargo pazaryeri. Guvenilir tasiyicilarla paketini hizli ve uygun fiyata gonder. 81 ilde binlerce aktif tasiyici seni bekliyor.";
  const keywords = meta?.keywords
    ? meta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["kargo", "paket takip", "tasiyicilik", "lojistik", "turkiye", "paketjet", "p2p kargo"];
  const author = seo?.author ?? "PaketJet";

  const ogImages = seo?.open_graph?.images?.length
    ? seo.open_graph.images.map((img: string) => img.startsWith("/") ? `${SITE_URL}${img}` : img)
    : [`${SITE_URL}/assets/og-default.png`];

  const twitterCard = seo?.twitter?.card ?? "summary_large_image";
  const twitterSite = seo?.twitter?.site || undefined;

  return {
    title: { default: titleDefault, template: titleTemplate },
    description,
    keywords,
    authors: [{ name: author }],
    publisher: author,
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [
        { url: icons?.favicon ?? "/uploads/media/logo/favicon.ico" },
        { url: icons?.logoIcon192 ?? "/uploads/media/logo/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: icons?.favicon ?? "/uploads/media/logo/favicon.ico",
      apple: icons?.appleTouchIcon ?? "/uploads/media/logo/apple-touch-icon.png",
    },
    openGraph: {
      siteName,
      type: "website",
      locale: "tr_TR",
      url: SITE_URL,
      images: ogImages,
    },
    twitter: {
      card: twitterCard as "summary_large_image",
      ...(twitterSite && { site: twitterSite }),
    },
    verification: bingVerification
      ? { other: { "msvalidate.01": bingVerification } }
      : undefined,
  };
}

async function fetchSplashVideos(): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/site_settings/splash_videos`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const val = data?.value;
    if (Array.isArray(val)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return null; } }
    return null;
  } catch { return null; }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const splashVideos = await fetchSplashVideos();

  return (
    <html lang="tr" suppressHydrationWarning className={`${dmSans.variable} font-sans`}>
      <body suppressHydrationWarning>
        <OrganizationSchema />
        <ThemeProvider>
          <SplashLoader videos={splashVideos}>
            {children}
          </SplashLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
