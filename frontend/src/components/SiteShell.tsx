import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettingValue } from "@/lib/site-settings";

type SiteLogo = { url?: string; alt?: string };
type ContactInfo = { phone?: string; email?: string; address?: string; company_name?: string };
type Socials = { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string };
type NavLink = { title: string; path: string };

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [logo, contact, socials, footerAbout, footerCopyright, footerQuickLinks, footerLegalLinks, headerMenu] = await Promise.all([
    getSiteSettingValue<SiteLogo>("site_logo", "*"),
    getSiteSettingValue<ContactInfo>("contact_info", "tr"),
    getSiteSettingValue<Socials>("socials", "tr"),
    getSiteSettingValue<string>("footer_about", "tr"),
    getSiteSettingValue<string>("footer_copyright", "*"),
    getSiteSettingValue<NavLink[]>("footer_quick_links", "*"),
    getSiteSettingValue<NavLink[]>("footer_legal_links", "*"),
    getSiteSettingValue<NavLink[]>("header_menu", "*"),
  ]);

  const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
  const toUrl = (p?: string) => p ? (p.startsWith("http") ? p : `${API_ORIGIN}${p}`) : undefined;
  const logoUrl = toUrl(logo?.url);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header logoUrl={logoUrl} logoAlt={logo?.alt} navLinks={headerMenu} />
      <div className="flex-grow">{children}</div>
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
