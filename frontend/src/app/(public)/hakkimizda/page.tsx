import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { BreadcrumbSchema, FAQPageSchema, WebPageSchema } from "@/components/JsonLd";
import { getBrand } from "@/lib/brand";
import { GuidePriceTable } from "@/modules/content/GuideExtras";
import { PRODUCT_FAQS } from "@/modules/content/product-facts";
import { getSiteSettingValue } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getCustomPageBySlug("hakkimizda");
    return buildMetadata(null, {
      canonicalPath: "/hakkimizda",
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || undefined,
      ogKind: "Hakkımızda",
    });
  } catch {
    return { title: "Hakkımızda" };
  }
}

export default async function HakkimizdaPage() {
  try {
    const [page, heroVideo, brand] = await Promise.all([
      getCustomPageBySlug("hakkimizda"),
      getSiteSettingValue<{ desktop?: string }>("hero_video", "*"),
      getBrand(),
    ]);

    const videoUrl = heroVideo?.desktop
      ? (heroVideo.desktop.startsWith("http") ? heroVideo.desktop : `${API_ORIGIN}${heroVideo.desktop}`)
      : null;

    return (
      <>
        <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Hakkımızda" }]} />
        <FAQPageSchema items={PRODUCT_FAQS} />
        <WebPageSchema type="AboutPage" name={page.title} description={page.meta_description || page.summary || undefined} url="/hakkimizda" dateModified={page.updated_at} />
        <CustomPageView
          title={page.title}
          summary={page.summary}
          html={page.content}
          heroVideoUrl={videoUrl}
          createdAt={page.created_at}
          updatedAt={page.updated_at}
          byline={brand.name ? `${brand.name} Ekibi` : null}
        >
          <div className="about-extras blog-article legal-prose">
            <GuidePriceTable />
            <section id="sss">
              <h2>Sıkça sorulan sorular</h2>
              {PRODUCT_FAQS.map((f) => <div key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}
            </section>
          </div>
        </CustomPageView>
      </>
    );
  } catch {
    notFound();
  }
}
