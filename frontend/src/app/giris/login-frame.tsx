'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Search, Contact } from 'lucide-react';
import RouteMapAnimation from '@/components/RouteMapAnimation';
import { ROUTES } from '@/config/routes';

export default function LoginFrame({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null }) {
  return <main className="login-page" id="main-content">
    <header className="login-topbar"><Link href={ROUTES.home} className="flex items-center gap-3 font-bold text-foreground"><Image src={logoUrl || '/uploads/media/logo/logo-transparent.png'} alt="" width={48} height={48} unoptimized className="object-contain"/><span className="text-2xl">Paket<span className="text-brand">Jet</span></span></Link><Link href={ROUTES.home} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted"><ArrowLeft size={17}/>Ana sayfaya dön</Link></header>
    <div className="login-stage"><section className="login-story" aria-label="PaketJet ile devam et">
      <h2>Yolculuğuna kaldığın<br className="hidden lg:block"/> yerden devam et.</h2><p>İlanlarını yönet, taşıyıcılarla bağlantıda kal.</p>
      <div className="login-features">{[[MapPin,'Güzergâhını paylaş'],[Search,'İlanları keşfet'],[Contact,'İletişim bilgilerine dön']].map(([Icon,label])=>{const Glyph=Icon as typeof MapPin;return <div key={String(label)}><span><Glyph size={22} strokeWidth={1.7}/></span><p>{String(label)}</p></div>;})}</div>
      <RouteMapAnimation/>
    </section><section className="login-form-panel">{children}</section></div>
    <footer className="login-footer"><span>© {new Date().getFullYear()} PaketJet</span><Link href={ROUTES.static.destek}>Yardıma mı ihtiyacın var?</Link></footer>
  </main>;
}
