import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettingValue } from "@/lib/site-settings";

type SiteLogo = {
  url?: string;
  src?: string;
  logo_url?: string;
  logo_dark_url?: string;
  logo_alt?: string;
  alt?: string;
};
type ContactInfo = { phone?: string; email?: string; address?: string; company_name?: string };
type Socials = { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string };
type NavLink = { title: string; path: string };

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [
    logo,
    logoLight,
    logoDark,
    contact,
    socials,
    footerAbout,
    footerCopyright,
    footerQuickLinks,
    footerLegalLinks,
    headerMenu,
  ] = await Promise.all([
    getSiteSettingValue<SiteLogo>("site_logo", "*"),
    getSiteSettingValue<string | SiteLogo>("site_logo_light", "*"),
    getSiteSettingValue<string | SiteLogo>("site_logo_dark", "*"),
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
  const mediaUrl = (value?: string | SiteLogo | null) => {
    if (!value) return undefined;
    if (typeof value === "string") return toUrl(value);
    return toUrl(value.url || value.src || value.logo_url);
  };
  const logoUrl = mediaUrl(logoLight) || mediaUrl(logo) || toUrl(logo?.logo_url);
  const logoDarkUrl = mediaUrl(logoDark) || toUrl(logo?.logo_dark_url) || logoUrl;
  const logoAlt = logo?.alt || logo?.logo_alt || "PaketJet";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} logoAlt={logoAlt} navLinks={headerMenu} />
      <div className="flex-grow">{children}</div>
      <Footer
        logoUrl={logoDarkUrl || logoUrl}
        logoAlt={logoAlt}
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
