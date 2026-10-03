import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpenText, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema } from "@/components/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { BLOG_POSTS, ROUTE_GUIDES, getBlogPostBySlug } from "@/modules/content/content.data";

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
  const related = [...BLOG_POSTS, ...ROUTE_GUIDES].filter((item) => item.slug !== slug);

  return (
    <main className="editorial-page blog-detail">
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
      <header className="editorial-hero blog-detail-hero">
        <div className="editorial-container">
          <nav className="editorial-breadcrumb" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><ChevronRight size={15} /><Link href="/blog">Blog</Link><ChevronRight size={15} /><span>{post.title}</span></nav>
          <p className="editorial-eyebrow">{post.categoryLabel}</p>
          <h1>{post.title}</h1>
          <p className="editorial-lead">{post.summary}</p>
          <p className="blog-detail-meta">{formatDate(post.publishedAt)} · Son güncelleme: {formatDate(post.updatedAt)} · PaketJet rehberi</p>
        </div>
      </header>
      <div className="editorial-container blog-detail-layout">
        <div>
        <article className="blog-article legal-prose">
          {post.sections.map((section, index) => (
            <section id={`bolum-${index + 1}`} key={`${post.slug}-${index}`}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${post.slug}-${index}-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </section>
          ))}
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
      {related.length > 0 && <section className="editorial-container blog-related"><p className="editorial-eyebrow">Keşfetmeye devam et</p><h2>Diğer rehberler</h2><div className="blog-guide-grid">{related.map((item) => <article className="blog-guide" key={item.slug}><span className="blog-guide-icon"><BookOpenText size={23} /></span><p className="blog-guide-category">{item.categoryLabel}</p><h3><Link href={item.canonicalPath}>{item.title}</Link></h3><p>{item.description}</p><Link className="editorial-link" href={item.canonicalPath}>Rehberi oku <ArrowUpRight size={17} /></Link></article>)}</div></section>}
    </main>
  );
}
