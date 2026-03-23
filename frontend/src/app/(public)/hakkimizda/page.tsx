import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("hakkimizda");
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || "PaketJet hakkında bilgi alın.",
    };
  } catch {
    return { title: "Hakkımızda | PaketJet" };
  }
}

export default async function HakkimizdaPage() {
  try {
    const page = await getCustomPageBySlug("hakkimizda");
    return <CustomPageView title={page.title} summary={page.summary} html={page.content} />;
  } catch {
    notFound();
  }
}
