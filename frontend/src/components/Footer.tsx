import Link from 'next/link';
import {ROUTES} from '@/config/routes';
type FooterProps = {
  logoUrl?: string; logoAlt?: string; about?: string | null;
  contact?: {phone?: string; email?: string; address?: string; company_name?: string} | null;
  socials?: {instagram?: string; facebook?: string; linkedin?: string; youtube?: string; x?: string} | null;
  copyright?: string | null; quickLinks?: {title: string; path: string}[] | null; legalLinks?: {title: string; path: string}[] | null;
};
export default function Footer({logoUrl,logoAlt,contact,socials}:FooterProps){
  return <footer className="site-footer"><div className="site-container">
    <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="col-span-2 lg:col-span-1"><Link href={ROUTES.home} aria-label="PaketJet ana sayfa" className="inline-flex items-center gap-3">{logoUrl&&<img src={logoUrl} alt={logoAlt??'PaketJet'} className="h-12 w-auto max-w-20 object-contain brightness-0 invert"/>}<span className="text-2xl font-bold">PaketJet</span></Link><p className="footer-muted mt-4 max-w-60 text-sm leading-6">Taşıyıcıyla doğrudan iletişim.</p></div>
      <nav aria-label="Ürün bağlantıları"><h2 className="mb-5 text-sm font-semibold">Keşfet</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.ilanlar.list}>İlanlar</Link><Link href="/#nasil-calisir">Nasıl çalışır</Link><Link href={ROUTES.ilanVer}>Ücretsiz ilan ver</Link></div></nav>
      <nav aria-label="Destek bağlantıları"><h2 className="mb-5 text-sm font-semibold">Destek</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.static.destek}>Yardım merkezi</Link><Link href={ROUTES.static.iletisim}>Bize ulaşın</Link><Link href={ROUTES.static.hakkinda}>Hakkımızda</Link>{contact?.email&&<a className="break-all" href={`mailto:${contact.email}`}>{contact.email}</a>}</div></nav>
      <nav aria-label="Yasal bağlantılar"><h2 className="mb-5 text-sm font-semibold">Yasal</h2><div className="footer-muted flex flex-col gap-2 text-sm"><Link href={ROUTES.static.kullanim}>Kullanım koşulları</Link><Link href={ROUTES.static.gizlilik}>Gizlilik politikası</Link><Link href={ROUTES.static.kvkk}>KVKK</Link><Link href="/tasima-kurallari">Taşıma kuralları</Link></div></nav>
    </div>
    <div className="footer-muted mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs leading-6"><p>© 2026 PaketJet. Tüm hakları saklıdır.</p><div className="flex flex-wrap gap-4">{socials&&Object.entries(socials).filter(([,url])=>url&&/^https:\/\//.test(url)).map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize">{name}</a>)}</div></div>
  </div></footer>;
}
