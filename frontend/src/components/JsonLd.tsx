/**
 * JSON-LD Schema bileşenleri — GEO/SEO
 * Kurum bilgisi (ad, logo, iletişim, sosyal profiller) admin ayarlarından gelir: getBrand().
 * Varlıklar @id ile birbirine bağlanır (#organization, #website); sayfa şemaları bunlara referans verir.
 */
import { getBrand } from "@/lib/brand";

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const abs = (u: string) => (u.startsWith("/") ? `${SITE_URL}${u}` : u);
const ORG = { "@id": `${SITE_URL}/#organization` };
const WEBSITE = { "@id": `${SITE_URL}/#website` };

/** Site geneli — root layout */
export async function OrganizationSchema() {
  const b = await getBrand();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        ...ORG,
        name: b.name,
        url: SITE_URL,
        ...(b.logo && { logo: { "@type": "ImageObject", url: b.logo, width: 512, height: 512 } }),
        ...(b.description && { description: b.description }),
        ...(b.sameAs.length && { sameAs: b.sameAs }),
        areaServed: { "@type": "Country", name: "Türkiye" },
        ...((b.email || b.phone) && {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["Turkish"],
            areaServed: "TR",
            ...(b.email && { email: b.email }),
            ...(b.phone && { telephone: b.phone }),
          },
        }),
      }}
    />
  );
}

/** Anasayfa — WebSite + site içi arama */
export async function WebSiteSchema() {
  const b = await getBrand();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        ...WEBSITE,
        name: b.name,
        url: SITE_URL,
        inLanguage: "tr-TR",
        publisher: ORG,
        ...(b.description && { description: b.description }),
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/ilanlar?from_city={from_city}` },
          "query-input": "required name=from_city",
        },
      }}
    />
  );
}

/** SSS — FAQPage */
export function FAQPageSchema({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

/** Kurumsal sayfalar — AboutPage / ContactPage / CollectionPage / WebPage */
export function WebPageSchema({
  type = "WebPage",
  name,
  description,
  url,
  dateModified,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  name: string;
  description?: string;
  url: string;
  dateModified?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        name,
        ...(description && { description }),
        url: abs(url),
        inLanguage: "tr-TR",
        isPartOf: WEBSITE,
        about: ORG,
        publisher: ORG,
        ...(dateModified && { dateModified }),
      }}
    />
  );
}

/** İletişim — ContactPage + kurumun iletişim noktası */
export async function ContactPointSchema({ phone, email }: { phone?: string; email?: string }) {
  const b = await getBrand();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: `${SITE_URL}/iletisim`,
        inLanguage: "tr-TR",
        isPartOf: WEBSITE,
        mainEntity: {
          "@type": "Organization",
          ...ORG,
          name: b.name,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["Turkish"],
            areaServed: "TR",
            ...((phone ?? b.phone) && { telephone: phone ?? b.phone }),
            ...((email ?? b.email) && { email: email ?? b.email }),
          },
        },
      }}
    />
  );
}

/** Liste sayfaları — ItemList (ilanlar, blog) */
export function ItemListSchema({ name, items }: { name: string; items: { name: string; url: string }[] }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, url: abs(item.url) })),
      }}
    />
  );
}

/** Blog / rota içerikleri — Article (yazar: editör ekibi, yayıncı: kurum) */
export async function ArticleSchema({
  headline,
  description,
  url,
  publishedTime,
  modifiedTime,
  image,
  section,
  authorName,
  wordCount,
  citations,
}: {
  headline: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  image?: string;
  section?: string;
  authorName?: string;
  wordCount?: number;
  citations?: string[];
}) {
  const b = await getBrand();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        datePublished: publishedTime,
        dateModified: modifiedTime,
        ...(section && { articleSection: section }),
        ...(wordCount && { wordCount }),
        ...(citations?.length && { citation: citations }),
        image: image ? abs(image) : `${SITE_URL}/og?title=${encodeURIComponent(headline)}`,
        inLanguage: "tr-TR",
        mainEntityOfPage: abs(url),
        isPartOf: WEBSITE,
        author: authorName ? { "@type": "Organization", name: authorName, parentOrganization: ORG, url: `${SITE_URL}/hakkimizda` } : ORG,
        publisher: { "@type": "Organization", ...ORG, name: b.name, ...(b.logo && { logo: { "@type": "ImageObject", url: b.logo } }) },
      }}
    />
  );
}

/** Tüm sayfalar — BreadcrumbList */
export function BreadcrumbSchema({ items }: { items: { name: string; url?: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          ...(item.url && { item: abs(item.url) }),
        })),
      }}
    />
  );
}
