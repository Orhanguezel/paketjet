import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { OrganizationSchema } from "@/components/JsonLd";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { AnalyticsHead, AnalyticsNoScript } from "@/components/analytics/Analytics";
import CookieConsent from "@/components/analytics/CookieConsent";
import { APP_NAME, withBrand } from "@/lib/app-name";


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8078";

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
  const [{ seo, meta }, icons, analytics] = await Promise.all([fetchGlobalSeo(), fetchIcons(), getAnalyticsConfig()]);
  // Search Console: admin panelindeki kod, yoksa GOOGLE_SITE_VERIFICATION env.
  const googleVerification = analytics.googleVerification;
  const bingVerification = process.env.BING_VERIFICATION ?? "";

  const siteName = seo?.site_name ?? APP_NAME;
  const titleTemplate = seo?.title_template ?? withBrand("%s");
  const titleDefault = meta?.title ?? seo?.title_default ?? withBrand("Güzergâh ve taşıyıcı ilanları", " — ");
  const description = meta?.description ?? seo?.description
    ?? "Taşıyıcı güzergâhlarını keşfet, iletişim bilgilerine eriş ve doğrudan görüş. Güzergâhını ücretsiz ilan ver.";
  const keywords = meta?.keywords
    ? meta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["kargo",  "tasiyicilik", "lojistik", "turkiye", "p2p kargo"];
  const author = seo?.author ?? APP_NAME;

  const ogImages = seo?.open_graph?.images?.length
    ? seo.open_graph.images.map((img: string) => img.startsWith("/") ? `${SITE_URL}${img}` : img)
    : [`${SITE_URL}/opengraph-image`];

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
    verification: {
      ...(googleVerification && {google:googleVerification}),
      ...(bingVerification && {other:{"msvalidate.01":bingVerification}}),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const analytics = await getAnalyticsConfig();
  const tracking = Boolean(analytics.gtmId || analytics.ga4Id);
  return (
    <html lang="tr" suppressHydrationWarning className={`${dmSans.variable} font-sans`}>
      <head><AnalyticsHead {...analytics} /></head>
      <body suppressHydrationWarning>
        <AnalyticsNoScript gtmId={analytics.gtmId} />
        <OrganizationSchema />
        <ThemeProvider>
          <>
            {children}
          </>
        </ThemeProvider>
        {tracking && <CookieConsent />}
      </body>
    </html>
  );
}
