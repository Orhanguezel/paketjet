import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { getPublishedLegalSlugs } from "@/modules/customPage/legal/legal-published";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const SLUG = "mesafeli-satis-sozlesmesi";

export const revalidate = 300;

// Icerik admin panelindeki yasal sayfadan gelir; yayinlanmamissa sayfa 404 verir.
export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug(SLUG);
    return buildMetadata(null, {
      ogKind: "Yasal",
      canonicalPath: `/${SLUG}`,
      title: { absolute: page.meta_title || page.title },
      description: page.meta_description || page.summary || "Site üzerinden satın alınan dijital hizmetlere ilişkin mesafeli satış sözleşmesi.",
      alternates: { canonical: `${SITE_URL}/${SLUG}` },
    });
  } catch {
    return { title: "Mesafeli satış sözleşmesi" };
  }
}

export default async function MesafeliSatisPage() {
  try {
    const page = await getCustomPageBySlug(SLUG);
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Mesafeli satış sözleşmesi" }]} />
        <LegalPageView slug={SLUG} title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} publishedSlugs={await getPublishedLegalSlugs()} />
      </>
    );
  } catch {
    notFound();
  }
}
