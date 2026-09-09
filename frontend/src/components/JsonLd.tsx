/**
 * JSON-LD Schema bileşenleri — GEO/SEO
 * Layout ve sayfa seviyesinde kullanılır
 */

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

/** Site geneli — root layout'a eklenecek */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "PaketJet",
        url: SITE_URL,
        logo: `${SITE_URL}/uploads/media/logo/logo-512x512.png`,
        description:
          "Türkiye'nin P2P kargo pazaryeri. Taşıyıcılar ücretsiz güzergâh ilanı açar, göndericiler iletişim bilgilerine erişerek doğrudan görüşür.",

      }}
    />
  );
}

/** Anasayfa — WebSite + SearchAction */
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "PaketJet",
        publisher: {"@id": `${SITE_URL}/#organization`},
        url: SITE_URL,
        inLanguage: "tr",
        description: "Türkiye'nin P2P kargo pazaryeri",

      }}
    />
  );
}

/** SSS / Destek — FAQPage */
export function FAQPageSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/** İletişim — ContactPoint */
export function ContactPointSchema({
  phone,
  email,
}: {
  phone?: string;
  email?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PaketJet",
        url: SITE_URL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: "Turkish",
          ...(phone && { telephone: phone }),
          ...(email && { email }),
        },
      }}
    />
  );
}

/** Blog / rota icerikleri — Article */
export function ArticleSchema({
  headline,
  description,
  url,
  publishedTime,
  modifiedTime,
  image,
  section,
}: {
  headline: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  image?: string;
  section?: string;
}) {
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
        image: image ? (image.startsWith("/") ? `${SITE_URL}${image}` : image) : `${SITE_URL}/opengraph-image`,
        inLanguage: "tr-TR",
        mainEntityOfPage: url.startsWith("/") ? `${SITE_URL}${url}` : url,
        author: {
          "@type": "Organization",
          name: "PaketJet",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "PaketJet",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/uploads/media/logo/logo-512x512.png`,
          },
        },
      }}
    />
  );
}

/** Tüm sayfalar — BreadcrumbList */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          ...(item.url && { item: item.url.startsWith("/") ? `${SITE_URL}${item.url}` : item.url }),
        })),
      }}
    />
  );
}
