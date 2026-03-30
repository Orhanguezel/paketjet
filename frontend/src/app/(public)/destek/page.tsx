import type { Metadata } from "next";
import { listFaqs } from "@/modules/support/support.service";
import { getPageMetadata } from "@/lib/seo";
import { FAQPageSchema, BreadcrumbSchema } from "@/components/JsonLd";
import DestekClient from "./destek-client";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("faq", {
    canonicalPath: "/destek",
    fallbackDescription: "PaketJet destek merkezi. Kargo gönderimi, rezervasyon, ödeme ve taşıyıcı hakkında sıkça sorulan sorular.",
  });
}

export default async function DestekPage() {
  const faqs = await listFaqs({ locale: "tr", limit: 20 }).catch(() => []);

  const faqItems = faqs.map((f: { question?: string; answer?: string }) => ({
    question: f.question ?? "",
    answer: f.answer ?? "",
  })).filter((f: { question: string }) => f.question);

  return (
    <>
      {faqItems.length > 0 && <FAQPageSchema items={faqItems} />}
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "Destek" }]} />
      <DestekClient faqs={faqs} />
    </>
  );
}
