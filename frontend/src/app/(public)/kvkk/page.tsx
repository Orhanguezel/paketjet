import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("kvkk");
    return buildMetadata(null, {
      canonicalPath: "/kvkk",
      title: { absolute: page.meta_title || `${page.title} | PaketJet` },
      description: page.meta_description || page.summary || "PaketJet KVKK aydınlatma metni.",
      alternates: { canonical: `${SITE_URL}/kvkk` },
    });
  } catch {
    return { title: "KVKK" };
  }
}

export default async function KvkkPage() {
  try {
    const page = await getCustomPageBySlug("kvkk");
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "KVKK" }]} />
        <LegalPageView slug="kvkk" title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} />
      </>
    );
  } catch {
    notFound();
  }
}
