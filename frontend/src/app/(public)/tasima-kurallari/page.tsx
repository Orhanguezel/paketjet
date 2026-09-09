import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return buildMetadata(null, {
      canonicalPath: "/tasima-kurallari",
      title: { absolute: page.meta_title || `${page.title} | PaketJet` },
      description: page.meta_description || page.summary || "PaketJet taşıma kuralları.",
      alternates: { canonical: `${SITE_URL}/tasima-kurallari` },
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description || page.summary || "PaketJet taşıma kuralları.",
        type: "article",
        publishedTime: page.created_at,
        modifiedTime: page.updated_at,
      },
    });
  } catch {
    return { title: "Taşıma Kuralları | PaketJet" };
  }
}

export default async function TasimaKurallariPage() {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return <LegalPageView slug="tasima-kurallari" title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} />;
  } catch {
    notFound();
  }
}
