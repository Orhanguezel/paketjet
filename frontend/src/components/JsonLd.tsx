/**
 * JSON-LD Schema bileşenleri — GEO/SEO
 * Layout ve sayfa seviyesinde kullanılır
 */

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
        name: "PaketJet",
        url: SITE_URL,
        logo: `${SITE_URL}/uploads/media/logo/logo-512x512.png`,
        description:
          "Türkiye'nin P2P kargo pazaryeri. Taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır.",
        foundingDate: "2024",
        email: "info@paketjet.com",
        areaServed: { "@type": "Country", name: "Turkey" },
        sameAs: [
          "https://www.instagram.com/paketjet",
          "https://www.facebook.com/paketjet",
          "https://www.linkedin.com/company/paketjet",
          "https://www.youtube.com/@paketjet",
          "https://x.com/paketjet",
        ],
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
        name: "PaketJet",
        url: SITE_URL,
        inLanguage: "tr",
        description: "Türkiye'nin P2P kargo pazaryeri",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/ilanlar?from={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

/** Anasayfa — Service */
export function ServiceSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "PaketJet P2P Kargo Hizmeti",
        description:
          "Şehirler arası taşıma kapasitesini dijital olarak erişilebilir hale getiren P2P kargo pazaryeri. Taşıyıcılar güzergah ilanı açar, müşteriler uygun ilanı bulup kargo alanı satın alır.",
        provider: { "@type": "Organization", name: "PaketJet", url: SITE_URL },
        serviceType: "P2P Kargo Pazaryeri",
        areaServed: { "@type": "Country", name: "Turkey" },
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

/** İlan detay — Offer */
export function OfferSchema({
  title,
  description,
  price,
  currency,
  fromCity,
  toCity,
  url,
}: {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  fromCity: string;
  toCity: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Offer",
        name: title,
        ...(description && { description }),
        price,
        priceCurrency: currency ?? "TRY",
        availability: "https://schema.org/InStock",
        url: url.startsWith("/") ? `${SITE_URL}${url}` : url,
        seller: { "@type": "Organization", name: "PaketJet" },
        areaServed: [
          { "@type": "City", name: fromCity },
          { "@type": "City", name: toCity },
        ],
      }}
    />
  );
}

/** Anasayfa — HowTo (Nasıl Çalışır) + speakable */
export function HowToSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "PaketJet ile Kargo Nasıl Gönderilir?",
        description:
          "PaketJet P2P kargo pazaryerinde 3 adımda kargo gönderme süreci.",
        totalTime: "PT5M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Rota Ara",
            text: "Gideceğin şehri, tarihi ve ağırlığı gir. Sana uygun taşıyıcıları listeleyelim.",
            url: `${SITE_URL}/ilanlar`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Taşıyıcı Seç",
            text: "Fiyat, araç tipi ve taşıyıcı puanına göre en iyi seçimi yap.",
            url: `${SITE_URL}/ilanlar`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Paketini Gönder",
            text: "Rezervasyonunu onayla, taşıyıcıyla buluş, kargoyu teslim et.",
            url: `${SITE_URL}/ilan-ver`,
          },
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".hero-subtitle"],
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
        ...(image && { image: image.startsWith("/") ? `${SITE_URL}${image}` : image }),
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
