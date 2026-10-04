import { buildMetadata } from "@/lib/seo";
import { withBrand } from "@/lib/app-name";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { getPublishedLegalSlugs } from "@/modules/customPage/legal/legal-published";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/JsonLd";
import { TASIMA_FAQS } from "@/modules/customPage/legal/tasima-faqs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return buildMetadata(null, {
      ogKind: "Yasal",
      canonicalPath: "/tasima-kurallari",
      title: { absolute: page.meta_title || withBrand(page.title) },
      description: page.meta_description || page.summary || "Taşıma kuralları.",
      alternates: { canonical: `${SITE_URL}/tasima-kurallari` },
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description || page.summary || "Taşıma kuralları.",
        type: "article",
        publishedTime: page.created_at,
        modifiedTime: page.updated_at,
      },
    });
  } catch {
    return { title: "Taşıma kuralları" };
  }
}

export default async function TasimaKurallariPage() {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: page.title }]} />
        <FAQPageSchema items={TASIMA_FAQS} />
        <LegalPageView slug="tasima-kurallari" title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} faqs={TASIMA_FAQS} publishedSlugs={await getPublishedLegalSlugs()} />
      </>
    );
  } catch {
    notFound();
  }
}
