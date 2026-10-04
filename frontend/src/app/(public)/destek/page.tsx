import type { Metadata } from "next";
import { listFaqs } from "@/modules/support/support.service";
import { getPageMetadata } from "@/lib/seo";
import { FAQPageSchema, BreadcrumbSchema } from "@/components/JsonLd";
import DestekClient from "./destek-client";
import { getBrand } from "@/lib/brand";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("faq", {
    canonicalPath: "/destek",
    title: "Destek ve sıkça sorulan sorular",
    description: "Destek ve sıkça sorulan sorular: taşıyıcı ilanları, iletişim erişimi, ilan alma hakkı, kartla ödeme, iade ve hesap işlemleri hakkında yanıtlar.",
    fallbackDescription: "Destek merkezi. İlanlar, iletişim erişimi, ödeme ve hesap hakkında sıkça sorulan sorular.",
  });
}

export default async function DestekPage() {
  const [faqs, brand] = await Promise.all([listFaqs({ locale: "tr", limit: 50 }).catch(() => []), getBrand()]);

  const faqItems = faqs.map((f: { question?: string; answer?: string }) => ({
    question: f.question ?? "",
    answer: f.answer ?? "",
  })).filter((f: { question: string }) => f.question);

  return (
    <>
      {faqItems.length > 0 && <FAQPageSchema items={faqItems} />}
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Destek" }]} />
      <DestekClient faqs={faqs} brandName={brand.name || undefined} />
    </>
  );
}
