import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { getPublishedLegalSlugs } from "@/modules/customPage/legal/legal-published";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("kullanim-kosullari");
    return buildMetadata(null, {
      ogKind: "Yasal",
      canonicalPath: "/kullanim-kosullari",
      title: { absolute: page.meta_title || `${page.title} | PaketJet` },
      description: page.meta_description || page.summary || "PaketJet kullanım koşulları.",
      alternates: { canonical: `${SITE_URL}/kullanim-kosullari` },
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description || page.summary || "PaketJet kullanım koşulları.",
        type: "article",
        publishedTime: page.created_at,
        modifiedTime: page.updated_at,
      },
    });
  } catch {
    return { title: "Kullanım Koşulları | PaketJet" };
  }
}

export default async function KullanimKosullariPage() {
  try {
    const page = await getCustomPageBySlug("kullanim-kosullari");
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: page.title }]} />
        <LegalPageView slug="kullanim-kosullari" title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} publishedSlugs={await getPublishedLegalSlugs()} />
      </>
    );
  } catch {
    notFound();
  }
}
