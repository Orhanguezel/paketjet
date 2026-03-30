import Link from "next/link";
import { ROUTES } from "@/config/routes";

type FooterProps = {
  logoUrl?: string;
  logoAlt?: string;
  about?: string | null;
  contact?: { phone?: string; email?: string; address?: string; company_name?: string } | null;
  socials?: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string } | null;
  copyright?: string | null;
  quickLinks?: { title: string; path: string }[] | null;
  legalLinks?: { title: string; path: string }[] | null;
};

function SocialIcon({ name, url }: { name: string; url: string }) {
  const icons: Record<string, string> = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    youtube: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  };
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="text-white/40 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name] ?? ""} /></svg>
    </a>
  );
}

export default function Footer({
  logoUrl,
  logoAlt,
  about,
  contact,
  socials,
  copyright,
  quickLinks,
  legalLinks,
}: FooterProps) {
  const socialEntries = socials
    ? Object.entries(socials).filter(([, url]) => url)
    : [];

  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo + Hakkında */}
          <div className="md:col-span-1 space-y-4">
            <Link href={ROUTES.home} aria-label="PaketJet ana sayfa">
              {logoUrl ? (
                <img src={logoUrl} alt={logoAlt ?? "PaketJet"} className="h-12 w-auto max-w-36 object-contain brightness-0 invert" />
              ) : (
                <span className="text-white font-extrabold text-xl">PaketJet</span>
              )}
            </Link>
            {about ? (
              <p className="text-white/50 text-sm leading-relaxed">{about}</p>
            ) : null}
            {/* Sosyal medya */}
            {socialEntries.length > 0 ? (
              <div className="flex gap-3 pt-1">
                {socialEntries.map(([name, url]) => (
                  <SocialIcon key={name} name={name} url={url!} />
                ))}
              </div>
            ) : null}
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2.5">
              {(quickLinks ?? [
                { title: "Anasayfa", path: "/" },
                { title: "İlanlar", path: "/ilanlar" },
                { title: "Kargo Gönder", path: "/ilan-ver" },
                { title: "Hakkımızda", path: "/hakkimizda" },
                { title: "İletişim", path: "/iletisim" },
                { title: "Destek", path: "/destek" },
              ]).map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Yasal</h4>
            <ul className="space-y-2.5">
              {(legalLinks ?? [
                { title: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
                { title: "KVKK", path: "/kvkk" },
                { title: "Kullanım Koşulları", path: "/kullanim-kosullari" },
                { title: "Taşıma Kuralları", path: "/tasima-kurallari" },
              ]).map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">İletişim</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {contact?.company_name ? <li className="text-white/60 font-medium">{contact.company_name}</li> : null}
              {contact?.address ? <li>{contact.address}</li> : null}
              {contact?.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white/70 transition-colors">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact?.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-white/70 transition-colors">
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright + GWD */}
      <div className="border-t border-white/10 py-5 px-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between max-w-6xl mx-auto">
          <p className="text-white/30 text-xs">
            {copyright ?? "© 2026 PaketJet Teknoloji A.Ş. Tüm hakları saklıdır."}
          </p>
          <a
            href="https://guezelwebdesign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/25 hover:text-white/50 text-xs transition-colors"
          >
            Tasarım & Geliştirme <span className="font-semibold">GWD</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
