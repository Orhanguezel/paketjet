import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettingValue } from "@/lib/site-settings";

type SiteLogo = { url?: string; alt?: string };
type ContactInfo = { phone?: string; email?: string; address?: string; company_name?: string };
type Socials = { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string };
type NavLink = { title: string; path: string };

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logo, logoDark, contact, socials, footerAbout, footerCopyright, footerQuickLinks, footerLegalLinks, headerMenu] = await Promise.all([
    getSiteSettingValue<SiteLogo>("site_logo", "*"),
    getSiteSettingValue<SiteLogo>("site_logo_dark", "*"),
    getSiteSettingValue<ContactInfo>("contact_info", "tr"),
    getSiteSettingValue<Socials>("socials", "tr"),
    getSiteSettingValue<string>("footer_about", "tr"),
    getSiteSettingValue<string>("footer_copyright", "*"),
    getSiteSettingValue<NavLink[]>("footer_quick_links", "*"),
    getSiteSettingValue<NavLink[]>("footer_legal_links", "*"),
    getSiteSettingValue<NavLink[]>("header_menu", "*"),
  ]);

  const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
  const toUrl = (path?: string) => path ? (path.startsWith("http") ? path : `${API_ORIGIN}${path}`) : undefined;
  const logoUrl = toUrl(logo?.url);
  const logoDarkUrl = toUrl(logoDark?.url);

  return (
    <div className="flex flex-col min-h-screen">
      <Header logoUrl={logoUrl} logoAlt={logo?.alt} navLinks={headerMenu} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer
        logoUrl={logoUrl}
        logoAlt={logo?.alt}
        about={footerAbout}
        contact={contact}
        socials={socials}
        copyright={footerCopyright}
        quickLinks={footerQuickLinks}
        legalLinks={footerLegalLinks}
      />
    </div>
  );
}
