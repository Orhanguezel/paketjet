import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, MapPinned } from "lucide-react";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { BLOG_POSTS, ROUTE_GUIDES } from "@/modules/content/content.data";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("blog", {
    title: "PaketJet Blog",
    description: "P2P kargo, PaketJet kullanım rehberleri ve şehirler arası taşıma rehberleri.",
    canonicalPath: "/blog",
    fallbackDescription: "P2P kargo, PaketJet kullanım rehberleri ve şehirler arası taşıma rehberleri.",
  });
}

const [featured, ...guides] = [...BLOG_POSTS, ...ROUTE_GUIDES];

export default function BlogPage() {
  return (
    <main className="editorial-page">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <header className="editorial-hero blog-hero">
        <div className="editorial-container blog-hero-inner">
          <div>
            <p className="editorial-eyebrow">Blog</p>
            <h1>Kargo ve güzergâh rehberleri</h1>
            <p className="editorial-lead">
              PaketJet blog, P2P kargo modelini, platform kullanımını ve şehirler arası taşıma planlamasını daha iyi anlamanız için hazırlandı.
            </p>
          </div>
          <Image className="blog-hero-art" src="/assets/editorial/route-parcel.png" width={540} height={360}
            alt="" priority sizes="(max-width: 760px) 80vw, 420px" />
        </div>
      </header>
      <section className="editorial-container blog-index" aria-label="Kargo rehberleri">
        <article className="blog-featured">
          <div className="blog-featured-copy">
            <p className="editorial-eyebrow">{featured.categoryLabel}</p>
            <h2><Link href={featured.canonicalPath}>{featured.title}</Link></h2>
            <p>{featured.description}</p>
            <Link href={featured.canonicalPath} className="editorial-link">Rehberi oku <ArrowUpRight size={18} aria-hidden /></Link>
          </div>
          <Image src="/assets/editorial/route-parcel.png" width={540} height={360} alt=""
            sizes="(max-width: 760px) 90vw, 480px" />
        </article>
        <div className="blog-guide-grid">
          {guides.map((post) => (
            <article key={post.slug} className="blog-guide">
              <span className="blog-guide-icon" aria-hidden>{post.categoryLabel === "Güzergâh" ? <MapPinned size={26} /> : <BookOpenText size={26} />}</span>
              <p className="editorial-eyebrow">{post.categoryLabel}</p>
              <h2><Link href={post.canonicalPath}>{post.title}</Link></h2>
              <p>{post.description}</p>
              <Link href={post.canonicalPath} className="editorial-link">Rehberi oku <ArrowUpRight size={18} aria-hidden /></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
