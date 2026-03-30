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
    return {};
  }

  return getPageMetadata(guide.seoKey, {
    title: `${guide.title} Kargo Rotasi`,
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
    <main className="bg-background text-foreground">
      <ArticleSchema
        title={`${guide.title} Kargo Rotasi`}
        description={guide.description}
        url={guide.canonicalPath}
        datePublished={guide.publishedAt}
        dateModified={guide.updatedAt}
        section="Rota Rehberi"
      />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Rota Rehberi", url: guide.canonicalPath },
          { name: guide.title, url: guide.canonicalPath },
        ]}
      />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{guide.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{guide.summary}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted">
            <span>Yayin tarihi: {formatDate(guide.publishedAt)}</span>
            <span>Son guncelleme: {formatDate(guide.updatedAt)}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-brand">
          {guide.sections.map((section, index) => (
            <div key={`${guide.slug}-${index}`}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${guide.slug}-${index}-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
