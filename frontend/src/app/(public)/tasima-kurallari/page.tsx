import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || "PaketJet taşıma kuralları.",
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description || page.summary || "PaketJet taşıma kuralları.",
        type: "article",
        publishedTime: page.created_at,
        modifiedTime: page.updated_at,
      },
    };
  } catch {
    return { title: "Taşıma Kuralları | PaketJet" };
  }
}

export default async function TasimaKurallariPage() {
  try {
    const page = await getCustomPageBySlug("tasima-kurallari");
    return <CustomPageView title={page.title} summary={page.summary} html={page.content} createdAt={page.created_at} updatedAt={page.updated_at} />;
  } catch {
    notFound();
  }
}
