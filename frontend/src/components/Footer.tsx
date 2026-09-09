import Link from 'next/link';
import { ROUTES } from '@/config/routes';
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

export default function Footer({logoUrl,logoAlt,contact,socials}:FooterProps){
  return <footer className="border-t border-border-soft bg-surface py-8 text-foreground"><div className="site-container grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
    <div><Link href={ROUTES.home} aria-label="PaketJet ana sayfa">{logoUrl?<img src={logoUrl} alt={logoAlt??'PaketJet'} className="h-12 w-auto max-w-36 object-contain"/>:<span className="text-2xl font-bold">PaketJet</span>}</Link><p className="mt-2 text-sm leading-6 text-muted">Taşıyıcıyla doğrudan iletişim.</p></div>
    <nav aria-label="Ürün bağlantıları"><h2 className="mb-3 text-sm font-semibold">Ürün</h2><div className="flex flex-col gap-2 text-sm text-muted"><Link href={ROUTES.ilanlar.list}>İlanlar</Link><Link href="/#nasil-calisir">Nasıl çalışır</Link><Link href={ROUTES.ilanVer}>Ücretsiz ilan ver</Link></div></nav>
    <nav aria-label="Destek bağlantıları"><h2 className="mb-3 text-sm font-semibold">Destek</h2><div className="flex flex-col gap-2 text-sm text-muted"><Link href={ROUTES.static.destek}>Yardım merkezi</Link><Link href={ROUTES.static.iletisim}>Bize ulaşın</Link><Link href={ROUTES.static.hakkinda}>Hakkımızda</Link>{contact?.email&&<a className="break-all" href={`mailto:${contact.email}`}>{contact.email}</a>}</div></nav>
    <nav aria-label="Yasal bağlantılar"><h2 className="mb-3 text-sm font-semibold">Yasal</h2><div className="flex flex-col gap-2 text-sm text-muted"><Link href={ROUTES.static.kullanim}>Kullanım koşulları</Link><Link href={ROUTES.static.gizlilik}>Gizlilik politikası</Link><Link href={ROUTES.static.kvkk}>KVKK</Link><Link href="/tasima-kurallari">Taşıma kuralları</Link></div></nav>
    <div className="text-xs leading-6 text-muted"><p>© 2026 PaketJet</p><p>Tüm hakları saklıdır.</p>{socials&&Object.entries(socials).filter(([,url])=>url&&/^https:\/\//.test(url)).map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" className="mr-3 inline-block capitalize">{name}</a>)}</div>
  </div></footer>;
}
