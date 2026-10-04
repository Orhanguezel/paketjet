import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, MapPinned } from "lucide-react";
import { BreadcrumbSchema, ItemListSchema, WebPageSchema } from "@/components/JsonLd";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { getPageMetadata } from "@/lib/seo";
import { ALL_GUIDES, BLOG_POSTS } from "@/modules/content/content.data";
import type { ArticleContent } from "@/modules/content/content.type";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("blog", {
    title: "Kargo rehberleri: gönderici, taşıyıcı ve güzergâh",
    description: "Kargo rehberleri: şehirlerarası eşya gönderme, desi hesaplama, taşıyıcıyla anlaşma, taşıyıcı ilanı verme ve güzergâh rehberleri tek sayfada.",
    canonicalPath: "/blog",
    ogKind: "Blog",
  });
}

const featured = BLOG_POSTS[0]!;
const CLUSTERS: { key: NonNullable<ArticleContent["cluster"]>; title: string; intro: string }[] = [
  { key: "gonderici", title: "Gönderici rehberleri", intro: "Gönderiyi hazırlamaktan taşıyıcıyla anlaşmaya kadar: paketleme, ölçü ve desi, değer beyanı ve görüşmede sorulacak sorular." },
  { key: "tasiyici", title: "Taşıyıcı rehberleri", intro: "Araçtaki boş kapasiteyi ilana dönüştürmek, ilanı doğru doldurmak ve yasal sorumluluklar." },
  { key: "urun", title: "Platformu tanı", intro: "P2P kargo modeli, iletişim erişiminin ne olduğu ve adım adım kullanım." },
  { key: "guzergah", title: "Güzergâh rehberleri", intro: "Sık kullanılan şehirlerarası rotalarda yaklaşık mesafe, yayındaki ilanlar ve gönderi öncesi dikkat edilecekler." },
];

export default function BlogPage() {
  return (
    <div className="editorial-page">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <WebPageSchema type="CollectionPage" name="Kargo rehberleri" description="Gönderici, taşıyıcı ve güzergâh rehberleri." url="/blog" />
      <ItemListSchema name="Kargo rehberleri" items={ALL_GUIDES.map((g) => ({ name: g.title, url: g.canonicalPath }))} />
      <header className="editorial-hero blog-hero">
        <div className="editorial-container blog-hero-inner">
          <div>
            <SiteBreadcrumb items={[{ label: "Blog" }]} />
            <h1>Kargo ve güzergâh rehberleri</h1>
            <p className="editorial-lead">
              Kargo rehberleri; şehirlerarası eşya gönderirken, taşıyıcıyla anlaşırken veya aracındaki boş kapasiteyi ilana dönüştürürken işine yarayacak pratik bilgileri bir araya getirir. Her rehberde somut ölçüler, kontrol listeleri, sık sorulan sorular ve ilgili resmî kaynaklar bulunur.
            </p>
          </div>
          <Image className="blog-hero-art" aria-hidden="true" src="/assets/editorial/route-parcel.png" width={540} height={360}
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
          <Image aria-hidden="true" src="/assets/editorial/route-parcel.png" width={540} height={360} alt=""
            sizes="(max-width: 760px) 90vw, 480px" />
        </article>
        {CLUSTERS.map((c) => {
          const items = ALL_GUIDES.filter((g) => g.cluster === c.key && g.slug !== featured.slug);
          if (!items.length) return null;
          return (
            <section key={c.key} className="blog-cluster" aria-labelledby={`kume-${c.key}`}>
              <h2 id={`kume-${c.key}`} className="blog-cluster-title">{c.title}</h2>
              <p className="blog-cluster-intro">{c.intro}</p>
              <div className="blog-guide-grid">
                {items.map((post) => (
                  <article key={post.slug} className="blog-guide">
                    <span className="blog-guide-icon" aria-hidden>{post.cluster === "guzergah" ? <MapPinned size={26} /> : <BookOpenText size={26} />}</span>
                    <p className="editorial-eyebrow">{post.categoryLabel}</p>
                    <h3><Link href={post.canonicalPath}>{post.title}</Link></h3>
                    <p>{post.description}</p>
                    <Link href={post.canonicalPath} className="editorial-link">Rehberi oku <ArrowUpRight size={18} aria-hidden /></Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
