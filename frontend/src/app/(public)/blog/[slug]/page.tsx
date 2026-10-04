import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpenText } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/JsonLd";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { getPageMetadata } from "@/lib/seo";
import { BLOG_POSTS, getBlogPostBySlug, relatedGuides } from "@/modules/content/content.data";
import { GuideByline, GuideFaqs, GuideKeyFacts, GuidePriceTable, GuideSection, GuideSources, GuideTrust } from "@/modules/content/GuideExtras";

type Props = {
  params: Promise<{ slug: string }>;
};

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
    title: post.metaTitle ?? post.title,
    ogKind: post.categoryLabel,
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
  const related = relatedGuides(post);

  return (
    <div className="editorial-page blog-detail">
      <ArticleSchema
        headline={post.title}
        description={post.description}
        url={post.canonicalPath}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        section={post.categoryLabel}
        authorName="Editör Ekibi"
        citations={post.sources?.map((s) => s.url)}
      />
      {post.faqs?.length ? <FAQPageSchema items={post.faqs} /> : null}
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: post.canonicalPath },
        ]}
      />
      <header className="editorial-hero blog-detail-hero">
        <div className="editorial-container">
          <SiteBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
          <p className="editorial-eyebrow">{post.categoryLabel}</p>
          <h1>{post.title}</h1>
          <p className="editorial-lead">{post.summary}</p>
          <GuideByline item={post} />
        </div>
      </header>
      <div className="editorial-container blog-detail-layout">
        <div>
        <article className="blog-article legal-prose">
          <GuideKeyFacts facts={post.keyFacts} />
          {post.sections.map((section, index) => <GuideSection key={`${post.slug}-${index}`} section={section} id={`bolum-${index + 1}`} />)}
          <GuidePriceTable />
          <GuideFaqs item={post} />
          <GuideSources item={post} />
          <GuideTrust />
        </article>
        <Link href="/blog" className="blog-back-link"><ArrowLeft size={17} /> Tüm rehberlere dön</Link>
        </div>
        <aside className="blog-detail-sidebar">
          <nav className="blog-toc" aria-label="Bu yazıda">
            <h2>Bu yazıda</h2>
            {post.sections.map((section, index) => section.title ? <a href={`#bolum-${index + 1}`} key={index}>{section.title}</a> : null)}
          </nav>
          <div className="blog-side-cta"><span className="blog-guide-icon"><BookOpenText size={23} /></span><h2>Uygun güzergâhı bul</h2><p>Güncel taşıyıcı ilanlarını rota ve tarihe göre keşfet.</p><Link href="/ilanlar">İlanlara göz at <ArrowUpRight size={17} /></Link></div>
        </aside>
      </div>
      {related.length > 0 && <section className="editorial-container blog-related"><p className="editorial-eyebrow">Keşfetmeye devam et</p><h2>Diğer rehberler</h2><div className="blog-guide-grid">{related.map((item) => <article className="blog-guide" key={item.slug}><span className="blog-guide-icon"><BookOpenText size={23} /></span><p className="blog-guide-category">{item.categoryLabel}</p><h3><Link href={item.canonicalPath}>{item.title}</Link></h3><p>{item.description}</p></article>)}</div></section>}
    </div>
  );
}
