import type { Metadata } from "next";
import Link from "next/link";
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

export default function BlogPage() {
  return (
    <div className="bg-background text-foreground">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Kargo ve güzergâh rehberleri</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            PaketJet blog, P2P kargo modelini, platform kullanımını ve şehirler arası taşıma planlamasını daha iyi anlamanız için hazırlandı.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-12 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[...BLOG_POSTS,...ROUTE_GUIDES].map((post) => (
            <article key={post.slug} className="rounded-lg border border-border-soft bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-normal text-brand">{post.categoryLabel}</p>
              <h2 className="mt-3 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{post.description}</p>
              <Link href={post.canonicalPath} className="mt-6 inline-flex text-sm font-semibold text-brand hover:underline">
                Rehberi oku
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
