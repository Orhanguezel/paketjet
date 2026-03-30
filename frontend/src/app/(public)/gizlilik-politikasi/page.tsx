import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("gizlilik-politikasi");
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || "PaketJet gizlilik politikası.",
      alternates: { canonical: `${SITE_URL}/gizlilik-politikasi` },
    };
  } catch {
    return { title: "Gizlilik Politikası" };
  }
}

export default async function GizlilikPolitikasiPage() {
  try {
    const page = await getCustomPageBySlug("gizlilik-politikasi");
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Gizlilik Politikası" }]} />
        <CustomPageView title={page.title} summary={page.summary} html={page.content} />
      </>
    );
  } catch {
    notFound();
  }
}
