'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { logout } from '@/modules/auth/auth.service';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROUTES } from '@/config/routes';
type NavLink = {title:string;path:string};
interface HeaderProps {overlay?:boolean;logoUrl?:string;logoDarkUrl?:string;logoAlt?:string;navLinks?:NavLink[]|null;}
const navigation=[{title:'İlanlar',path:ROUTES.ilanlar.list},{title:'Nasıl çalışır',path:'/#nasil-calisir'},{title:'Destek',path:ROUTES.static.destek}];
export default function Header({logoUrl,logoDarkUrl,logoAlt}:HeaderProps) {
  const router=useRouter(), pathname=usePathname();
  const {isAuthenticated,logout:clearAuth}=useAuthStore();
  const [open,setOpen]=useState(false),[mounted,setMounted]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>setMounted(true),[]);
  useEffect(()=>setOpen(false),[pathname]);
  async function signOut(){await logout().catch(()=>{});clearAuth();setOpen(false);router.push(ROUTES.home);}
  const signedIn=mounted&&isAuthenticated;
  return <header className="site-header relative z-40 text-foreground" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}}}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:bg-surface focus:p-4">İçeriğe geç</a>
    <div className="site-container flex min-h-18 items-center gap-8">
      <Link href={ROUTES.home} aria-label="PaketJet ana sayfa" className="mr-auto inline-flex shrink-0 items-center gap-2 lg:mr-0">
        {logoUrl ? <><img src={logoUrl} alt={logoAlt??'PaketJet'} className="site-logo-img site-logo-img--light h-12 w-auto max-w-36 object-contain"/>{logoDarkUrl&&<img src={logoDarkUrl} alt="" className="site-logo-img site-logo-img--dark h-12 w-auto max-w-36 object-contain"/>}</> : <img src="/assets/logo/logo.jpeg" alt="PaketJet" width="48" height="48"/>}
      <span className="site-wordmark" aria-hidden="true">Paket<span>Jet</span></span></Link>
      <nav aria-label="Ana menü" className="hidden items-center gap-7 lg:flex">{navigation.map(item=><Link key={item.path} href={item.path} aria-current={pathname===item.path?'page':undefined} className="py-3 text-sm font-medium hover:text-brand">{item.title}</Link>)}</nav>
      <div className="ml-auto hidden items-center gap-4 lg:flex"><ThemeToggle/>{signedIn?<><Link href={ROUTES.panel.root} className="py-3 text-sm">Hesabım</Link><button onClick={signOut} className="py-3 text-sm">Çıkış yap</button></>:<Link href={ROUTES.auth.login} className="py-3 text-sm">Giriş Yap</Link>}<Link href={ROUTES.ilanVer} className="primary-action text-sm">Ücretsiz İlan Ver</Link></div>
      <button ref={toggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'Menüyü kapat':'Menüyü aç'} onClick={()=>setOpen(v=>!v)} className="grid size-11 place-items-center rounded-lg border border-border lg:hidden"><svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={open?'M6 6l12 12M6 18L18 6':'M4 6h16M4 12h16M4 18h16'}/></svg></button>
    </div>
    {open&&<nav id="mobile-navigation" aria-label="Mobil menü" className="site-container flex flex-col gap-1 border-t border-border-soft py-4 lg:hidden">{navigation.map(item=><Link onClick={()=>setOpen(false)} key={item.path} href={item.path} className="rounded-lg px-3 py-3">{item.title}</Link>)}<Link href={signedIn?ROUTES.panel.root:ROUTES.auth.login} className="px-3 py-3">{signedIn?'Hesabım':'Giriş Yap'}</Link><Link href={ROUTES.ilanVer} className="rounded-lg bg-action px-3 py-3 font-semibold text-white">Ücretsiz İlan Ver</Link><ThemeToggle/>{signedIn&&<button onClick={signOut} className="px-3 py-3 text-left">Çıkış yap</button>}</nav>}
  </header>;
}
