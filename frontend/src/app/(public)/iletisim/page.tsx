import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { ContactPageClient } from "@/modules/contact/ContactPageClient";
import { getSiteSettingValue } from "@/lib/site-settings";
import Link from "next/link";
import { ContactPointSchema, BreadcrumbSchema } from "@/components/JsonLd";
import { ROUTES } from "@/config/routes";

export const dynamic = "force-dynamic";

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
    title: "İletişim ve destek: bize ulaşın",
    description: "İletişim ve destek için bize ulaşın: ilan, iletişim erişimi, ödeme ve hesap talepleriniz için form, e-posta veya telefonla destek ekibimize yazın.",
    canonicalPath: "/iletisim",
    ogKind: "İletişim",
  });
}

export default async function IletisimPage() {
  const [info,email] = await Promise.all([getSiteSettingValue<ContactInfo>("contact_info"),getSiteSettingValue<string>("contact_email")]);
  const contactInfo = {...info,email:info?.email || email || undefined};
  return (
    <>
      <ContactPointSchema phone={contactInfo?.phone} email={contactInfo?.email} />
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "İletişim" }]} />
      <ContactPageClient contactInfo={contactInfo} />
      <section className="site-container pb-16" aria-labelledby="iletisim-kanallari">
        <div className="grid gap-8 border-t border-border-soft pt-10 text-sm leading-7 text-muted md:grid-cols-3">
          <div>
            <h2 id="iletisim-kanallari" className="text-lg font-semibold text-foreground">İletişim kanalları ve yanıt süresi</h2>
            <p className="mt-3">Destek ekibine iletişim formu, e-posta veya telefonla ulaşabilirsin. Form ve e-posta ile gelen talepler iş günlerinde sırayla yanıtlanır; ödeme ve erişim sorunlarında işlem referansını eklemen çözümü hızlandırır. Kart bilgisi veya parola paylaşma.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Hangi konuda nereye?</h2>
            <ul className="mt-3 grid gap-2">
              <li><strong className="text-foreground">İlan ve ilan onayı:</strong> <Link className="text-brand hover:underline" href={ROUTES.panel.ilanlarim}>İlanlarım</Link> ekranındaki durum bilgisini kontrol et, gerekirse formu kullan.</li>
              <li><strong className="text-foreground">İletişim erişimi ve ödeme:</strong> işlem referansıyla destek talebi oluştur.</li>
              <li><strong className="text-foreground">Kişisel veriler:</strong> <Link className="text-brand hover:underline" href={ROUTES.static.kvkk}>KVKK aydınlatma metnindeki</Link> başvuru yolunu kullan.</li>
              <li><strong className="text-foreground">Firma entegrasyonu:</strong> <Link className="text-brand hover:underline" href={ROUTES.static.gelistiriciler}>Partner API</Link> belgesini incele.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Önce bunlara göz at</h2>
            <p className="mt-3">Sık sorulan soruların çoğunun yanıtı <Link className="text-brand hover:underline" href={ROUTES.static.destek}>destek ve sıkça sorulan sorular</Link> sayfasında. Taşıma koşulları için <Link className="text-brand hover:underline" href={ROUTES.static.tasimaKurallari}>taşıma kurallarını</Link>, platformun nasıl çalıştığı için <Link className="text-brand hover:underline" href="/blog/paketjet-nasil-kullanilir">kullanım rehberini</Link> okuyabilirsin.</p>
          </div>
        </div>
      </section>
    </>
  );
}
