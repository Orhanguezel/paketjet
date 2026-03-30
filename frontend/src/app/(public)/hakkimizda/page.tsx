import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { BreadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("hakkimizda");
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || "PaketJet hakkında bilgi alın.",
    };
  } catch {
    return { title: "Hakkımızda" };
  }
}

export default async function HakkimizdaPage() {
  try {
    const page = await getCustomPageBySlug("hakkimizda");
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Hakkımızda" }]} />
        <CustomPageView title={page.title} summary={page.summary} html={page.content} />
      </>
    );
  } catch {
    notFound();
  }
}
