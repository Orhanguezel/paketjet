import RelatedGuides from "@/modules/content/RelatedGuides";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema } from "@/components/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { ROUTE_GUIDES, getRouteGuideBySlug } from "@/modules/content/content.data";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function generateStaticParams() {
  return ROUTE_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getRouteGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return getPageMetadata(guide.seoKey, {
    title: `${guide.title} taşıyıcı güzergâhı`,
    description: guide.description,
    canonicalPath: guide.canonicalPath,
    fallbackDescription: guide.description,
    openGraph: {
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
  });
}

export default async function RouteGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getRouteGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground">
      <ArticleSchema
        headline={`${guide.title} taşıyıcı güzergâhı`}
        description={guide.description}
        url={guide.canonicalPath}
        publishedTime={guide.publishedAt}
        modifiedTime={guide.updatedAt}
        section="Rota Rehberi"
      />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Rehberler", url: "/blog" },
          { name: guide.title, url: guide.canonicalPath },
        ]}
      />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand">{guide.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{guide.summary}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted">
            <span>Yayın tarihi: {formatDate(guide.publishedAt)}</span>
            <span>Son güncelleme: {formatDate(guide.updatedAt)}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article className="legal-prose">
          {guide.sections.map((section, index) => (
            <div key={`${guide.slug}-${index}`}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${guide.slug}-${index}-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </div>
          ))}
        </article>
        <p className="mt-6 text-sm text-muted">Hazırlayan: PaketJet · Platform kullanım rehberi</p>
        <RelatedGuides currentPath={guide.canonicalPath}/>
      </section>
    </div>
  );
}
