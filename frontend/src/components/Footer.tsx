import Link from 'next/link';
import {ROUTES} from '@/config/routes';
import SecurePayment from './SecurePayment';
import ProtectedEmail from './ProtectedEmail';
import { CookiePreferencesLink } from './analytics/CookieConsent';
type FooterProps = {
  logoUrl?: string; logoAlt?: string; about?: string | null;
  contact?: {phone?: string; email?: string; address?: string; company_name?: string} | null;
  socials?: {instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string} | null;
  copyright?: string | null; quickLinks?: {title: string; path: string}[] | null; legalLinks?: {title: string; path: string}[] | null;
  brandName?: string | null; paymentProvider?: string | null; purchaseLegalLinks?: {title: string; path: string}[];
};
export default function Footer({logoUrl,logoAlt,contact,socials,brandName,paymentProvider,purchaseLegalLinks=[]}:FooterProps){
  const brand=brandName?.trim()||'';
  return <footer className="site-footer"><div className="site-container">
    <div className="grid grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="col-span-2 lg:col-span-1"><Link href={ROUTES.home} aria-label={brand?`${brand} ana sayfa`:'Ana sayfa'} className="footer-brand">{logoUrl&&<span className="footer-logo"><img src={logoUrl} alt={logoAlt??brand} width={60} height={60} loading="lazy" decoding="async"/></span>}{brand&&<span className="footer-wordmark">{brand}</span>}</Link><p className="footer-muted mt-4 max-w-64 text-sm leading-6">Taşıyıcıyla doğrudan iletişim.</p></div>
      <nav aria-label="Ürün bağlantıları"><h2 className="mb-5 text-sm font-semibold">Keşfet</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.ilanlar.list}>İlanlar</Link><Link href="/#nasil-calisir">Nasıl çalışır</Link><Link href={ROUTES.ilanVer}>Ücretsiz ilan ver</Link><Link href="/blog">Kargo rehberleri</Link><Link href={ROUTES.static.gelistiriciler}>Geliştiriciler (API)</Link></div></nav>
      <nav aria-label="Destek bağlantıları"><h2 className="mb-5 text-sm font-semibold">Destek</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.static.destek}>Yardım merkezi</Link><Link href={ROUTES.static.iletisim}>Bize ulaşın</Link><Link href={ROUTES.static.hakkinda}>Hakkımızda</Link>{contact?.email&&<ProtectedEmail email={contact.email} className="break-all"/>}</div></nav>
      <nav aria-label="Yasal bağlantılar"><h2 className="mb-5 text-sm font-semibold">Yasal</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.static.kullanim}>Kullanım koşulları</Link><Link href={ROUTES.static.gizlilik}>Gizlilik politikası</Link><Link href={ROUTES.static.kvkk}>KVKK</Link><Link href="/tasima-kurallari">Taşıma kuralları</Link><CookiePreferencesLink className="text-left"/>{purchaseLegalLinks.map(l=><Link key={l.path} href={l.path}>{l.title}</Link>)}</div></nav>
    </div>
    {paymentProvider&&<SecurePayment provider={paymentProvider}/>}
    <div className="footer-muted mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs leading-6"><p>{`© ${new Date().getFullYear()}${brand?` ${brand}`:''}. Tüm hakları saklıdır.`}</p><div className="flex flex-wrap gap-4">{socials&&Object.entries(socials).filter(([,url])=>url&&/^https:\/\//.test(url)).map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize">{name}</a>)}</div></div>
  </div></footer>;
}
