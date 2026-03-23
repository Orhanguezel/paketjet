import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const { seo, meta } = await fetchGlobalSeo();

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
        { url: "/assets/logo/favicon.ico" },
        { url: "/assets/logo/logo.jpeg", type: "image/jpeg" },
      ],
      shortcut: "/assets/logo/favicon.ico",
      apple: "/assets/logo/logo.jpeg",
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
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${dmSans.variable} font-sans`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
