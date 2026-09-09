'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, ShoppingBag, Ticket, Bell, User, HelpCircle, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { getMe, logout as apiLogout } from '@/modules/auth/auth.service';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
const nav=[['/panel','Genel bakış',Home],['/panel/ilanlarim','İlanlarım',FileText],['/panel/satin-aldiklarim','Satın aldıklarım',ShoppingBag],['/panel/ilan-alma-hakki','İlan alma hakkı',Ticket],['/panel/bildirimler','Bildirimler',Bell],['/panel/profil','Profil',User],['/destek','Destek',HelpCircle]] as const;
export default function PanelShell({children,logoUrl}:{children:React.ReactNode;logoUrl?:string}) {
  const pathname=usePathname(),router=useRouter(),{user,setUser,logout}=useAuthStore();
  const [ready,setReady]=useState(false),[error,setError]=useState(false),[open,setOpen]=useState(false),[retry,setRetry]=useState(0);
  useEffect(()=>{let alive=true;setError(false);getMe().then(u=>{if(alive){setUser(u);setReady(true);}}).catch(()=>{if(alive)setError(true);});return()=>{alive=false;};},[setUser,retry]);
  async function signOut(){await apiLogout().catch(()=>{});logout();router.replace('/giris');}
  if(!ready)return <div className="p-8" role="status">{error?<><p>Oturum kontrol edilemedi.</p><button onClick={()=>setRetry(x=>x+1)} className="mt-4 min-h-11 text-brand">Yeniden dene</button></>:'Hesabın yükleniyor…'}</div>;
  return <div className="account-shell min-h-screen text-foreground md:grid md:grid-cols-[240px_1fr]">
    <aside className="account-sidebar bg-navy px-4 py-5 text-white md:min-h-screen"><div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3 px-3 py-2"><Image src={logoUrl||"/uploads/media/logo/logo-transparent.png"} alt="" width={44} height={44} unoptimized className="rounded-xl bg-white p-1"/><span className="text-xl font-bold">PaketJet</span></Link><button className="grid size-11 place-items-center md:hidden" aria-label="Panel menüsü" aria-expanded={open} aria-controls="panel-navigation" onClick={()=>setOpen(x=>!x)}><Menu size={22}/></button></div>
      <nav id="panel-navigation" aria-label="Hesap menüsü" className={`${open?'flex':'hidden'} mt-6 flex-col gap-2 md:flex`}>{nav.map(([href,label,Glyph])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={pathname===href?'page':undefined} className={`flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm ${pathname===href?'bg-action text-white':'text-white/80 hover:bg-white/10'}`}><Glyph size={20} strokeWidth={1.7}/>{label}</Link>)}<Link href="/panel/tasima-kurallari" className="mt-4 min-h-11 px-4 py-3 text-sm text-white/70">Taşıma kuralları</Link><button onClick={signOut} className="flex min-h-12 items-center gap-3 px-4 text-sm text-white/80"><LogOut size={20}/>Çıkış yap</button></nav>
    </aside>
    <div className="min-w-0"><header className="account-topbar flex min-h-18 items-center justify-between gap-4 border-b border-border-soft px-5 sm:px-8"><span className="font-medium">Hesabım</span><div className="flex min-w-0 items-center gap-4"><ThemeToggle/><Link href="/panel/profil" className="flex min-w-0 items-center gap-3 text-sm"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-xlight font-semibold text-brand" aria-hidden="true">{(user?.full_name||user?.email||'P').slice(0,1).toLocaleUpperCase('tr-TR')}</span><span className="max-w-36 truncate">{user?.full_name||'Profilim'}</span></Link></div></header><main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-10">{children}</main></div>
  </div>;
}
