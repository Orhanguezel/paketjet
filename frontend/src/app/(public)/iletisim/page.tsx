import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { ContactPageClient } from "@/modules/contact/ContactPageClient";
import { getSiteSettingValue } from "@/lib/site-settings";
import { ContactPointSchema, BreadcrumbSchema } from "@/components/JsonLd";

type ContactInfo = {
  company_name?: string;
  phone?: string;
  phone_2?: string;
  email?: string;
  email_2?: string;
  address?: string;
  city?: string;
  country?: string;
  working_hours?: string;
  maps_embed_url?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("contact", {
    canonicalPath: "/iletisim",
    fallbackDescription: "PaketJet ile iletişime geçin. E-posta, telefon ve iletişim formu ile destek alın.",
  });
}

export default async function IletisimPage() {
  const contactInfo = await getSiteSettingValue<ContactInfo>("contact_info");
  return (
    <>
      <ContactPointSchema phone={contactInfo?.phone} email={contactInfo?.email} />
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "İletişim" }]} />
      <ContactPageClient contactInfo={contactInfo} />
    </>
  );
}
