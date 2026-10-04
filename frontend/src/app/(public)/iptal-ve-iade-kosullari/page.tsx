import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { LegalPageView } from "@/modules/customPage/legal/LegalPageView";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";
const SLUG = "iptal-ve-iade-kosullari";

export const revalidate = 300;

// Icerik admin panelindeki yasal sayfadan gelir; yayinlanmamissa sayfa 404 verir.
export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug(SLUG);
    return buildMetadata(null, {
      ogKind: "Yasal",
      canonicalPath: `/${SLUG}`,
      title: { absolute: page.meta_title || page.title },
      description: page.meta_description || page.summary || "İlan iletişim erişimi ve İlan Alma Hakkı satın alımlarında iptal ve iade koşulları.",
      alternates: { canonical: `${SITE_URL}/${SLUG}` },
    });
  } catch {
    return { title: "İptal ve iade koşulları" };
  }
}

export default async function IptalIadePage() {
  try {
    const page = await getCustomPageBySlug(SLUG);
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "İptal ve iade koşulları" }]} />
        <LegalPageView slug={SLUG} title={page.title} summary={page.summary} html={page.content} updatedAt={page.updated_at} />
      </>
    );
  } catch {
    notFound();
  }
}
