import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/modules/content/content.data";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("blog", {
    title: "PaketJet Blog",
    description: "P2P kargo, PaketJet kullanim rehberleri ve sehirler arasi tasima odakli icerikler.",
    canonicalPath: "/blog",
    fallbackDescription: "P2P kargo, PaketJet kullanim rehberleri ve sehirler arasi tasima odakli icerikler.",
  });
}

export default function BlogPage() {
  return (
    <main className="bg-background text-foreground">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Blog</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Kargo ve rota odakli rehberler</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            PaketJet blog, P2P kargo modelini, platform kullanimini ve sehirler arasi tasima planlamasini daha iyi anlamaniz icin hazirlandi.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-12 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-border-soft bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{post.categoryLabel}</p>
              <h2 className="mt-3 text-2xl font-black">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-brand hover:underline">
                Yaziyi oku
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
