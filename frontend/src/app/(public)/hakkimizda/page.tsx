import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { getSiteSettingValue } from "@/lib/site-settings";

export const revalidate = 300;

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

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
    const [page, heroVideo] = await Promise.all([
      getCustomPageBySlug("hakkimizda"),
      getSiteSettingValue<{ desktop?: string }>("hero_video", "*"),
    ]);

    const videoUrl = heroVideo?.desktop
      ? (heroVideo.desktop.startsWith("http") ? heroVideo.desktop : `${API_ORIGIN}${heroVideo.desktop}`)
      : null;

    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Hakkımızda" }]} />
        <CustomPageView
          title={page.title}
          summary={page.summary}
          html={page.content}
          heroVideoUrl={videoUrl}
        />
      </>
    );
  } catch {
    notFound();
  }
}
