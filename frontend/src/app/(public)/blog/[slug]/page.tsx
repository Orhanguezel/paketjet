import RelatedGuides from "@/modules/content/RelatedGuides";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema } from "@/components/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { BLOG_POSTS, getBlogPostBySlug } from "@/modules/content/content.data";

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
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return getPageMetadata(post.seoKey, {
    title: post.title,
    description: post.description,
    canonicalPath: post.canonicalPath,
    fallbackDescription: post.description,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground">
      <ArticleSchema
        headline={post.title}
        description={post.description}
        url={post.canonicalPath}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        section="Blog"
      />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: post.canonicalPath },
        ]}
      />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand">{post.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{post.summary}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted">
            <span>Yayın tarihi: {formatDate(post.publishedAt)}</span>
            <span>Son güncelleme: {formatDate(post.updatedAt)}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article className="legal-prose">
          {post.sections.map((section, index) => (
            <div key={`${post.slug}-${index}`}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${post.slug}-${index}-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </div>
          ))}
        </article>
        <p className="mt-6 text-sm text-muted">Hazırlayan: PaketJet · Platform kullanım rehberi</p>
        <RelatedGuides currentPath={post.canonicalPath}/>
      </section>
    </div>
  );
}
