import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("gizlilik-politikasi");
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || "PaketJet gizlilik politikası.",
    };
  } catch {
    return { title: "Gizlilik Politikası | PaketJet" };
  }
}

export default async function GizlilikPolitikasiPage() {
  try {
    const page = await getCustomPageBySlug("gizlilik-politikasi");
    return <CustomPageView title={page.title} summary={page.summary} html={page.content} />;
  } catch {
    notFound();
  }
}
