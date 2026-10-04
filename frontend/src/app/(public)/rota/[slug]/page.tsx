import RelatedGuides from "@/modules/content/RelatedGuides";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/JsonLd";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { getPageMetadata } from "@/lib/seo";
import { ROUTE_GUIDES, getRouteGuideBySlug } from "@/modules/content/content.data";
import { GuideByline, GuideFaqs, GuideKeyFacts, GuidePriceTable, GuideSection, GuideSources, GuideTrust } from "@/modules/content/GuideExtras";
import RouteLiveListings from "@/modules/content/RouteLiveListings";

type Props = {
  params: Promise<{ slug: string }>;
};


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
    title: guide.metaTitle ?? `${guide.title} taşıyıcı güzergâhı`,
    ogKind: guide.categoryLabel,
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
        authorName="Editör Ekibi"
        citations={guide.sources?.map((s) => s.url)}
      />
      {guide.faqs?.length ? <FAQPageSchema items={guide.faqs} /> : null}
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Rehberler", url: "/blog" },
          { name: guide.title, url: guide.canonicalPath },
        ]}
      />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <SiteBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: guide.title }]} />
          <p className="text-sm font-semibold uppercase tracking-normal text-brand">{guide.eyebrow}</p>
          <h1 className="site-page-title mt-3">{guide.title}</h1>
          <p className="site-page-lead mt-4 max-w-2xl text-muted">{guide.summary}</p>
          <GuideByline item={guide} />
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article className="legal-prose">
          <GuideKeyFacts facts={guide.keyFacts} />
          {guide.sections.map((section, index) => <GuideSection key={`${guide.slug}-${index}`} section={section} id={`bolum-${index + 1}`} />)}
          <RouteLiveListings from={guide.title.split(" – ")[0]!} to={guide.title.split(" – ")[1]!} />
          <GuidePriceTable />
          <GuideFaqs item={guide} />
          <GuideSources item={guide} />
          <GuideTrust />
        </article>
        <RelatedGuides currentPath={guide.canonicalPath}/>
      </section>
    </div>
  );
}
