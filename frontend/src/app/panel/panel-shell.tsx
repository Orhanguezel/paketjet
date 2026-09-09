'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Pencil, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useAuthStore } from '@/modules/auth/auth.store';
import { getMe } from '@/modules/auth/auth.service';
import { ROUTES } from '@/config/routes';
const nav=[['/panel','Genel bakış'],['/panel/ilanlarim','İlanlarım'],['/panel/satin-aldiklarim','Satın aldıklarım'],['/panel/ilan-alma-hakki','İlan alma hakkı'],['/panel/bildirimler','Bildirimler'],['/panel/profil','Profil']] as const;
export default function PanelShell({children,logoUrl}:{children:React.ReactNode;logoUrl?:string}) {
  const pathname=usePathname(),{user,setUser}=useAuthStore();
  const [ready,setReady]=useState(false),[error,setError]=useState(false),[retry,setRetry]=useState(0);
  useEffect(()=>{let alive=true;setError(false);getMe().then(u=>{if(alive){setUser(u);setReady(true);}}).catch(()=>{if(alive)setError(true);});return()=>{alive=false;};},[setUser,retry]);
  if(!ready)return <div className="p-8" role="status">{error?<><p>Oturum kontrol edilemedi.</p><button onClick={()=>setRetry(x=>x+1)} className="mt-4 min-h-11 text-brand">Yeniden dene</button></>:'Hesabın yükleniyor…'}</div>;
  const name=user?.full_name?.trim().split(/\s+/)[0];
  function selected(href:string){return pathname===href||(href!==ROUTES.panel.root&&pathname.startsWith(href+'/'))||(href===ROUTES.panel.ilanlarim&&pathname.startsWith('/panel/tasiyici/ilanlar/'));}
  return <div className="member-shell min-h-screen text-foreground">
    <Header logoUrl={logoUrl||'/uploads/media/logo/logo-transparent.png'}/>
    <div className="site-container">
      <div className="member-welcome"><div className="member-welcome-art" aria-hidden="true"><Image src="/assets/motion/route-landscape.webp" alt="" fill sizes="500px" className="object-contain"/></div><div className="member-identity"><span className="member-avatar" aria-hidden="true">{user?.avatar_url?<Image src={user.avatar_url} alt="Profil fotoğrafın" width={76} height={76} unoptimized className="h-full w-full rounded-full object-cover"/>:(name||'P').slice(0,1).toLocaleUpperCase('tr-TR')}</span><div><p className="member-greeting">{name?`Merhaba, ${name}`:'Hesabım'}</p><p className="mt-2 text-muted">İlanların ve bağlantıların burada.</p></div></div><Link href={ROUTES.panel.profil} className="member-profile"><Pencil size={17}/>Profilini düzenle</Link></div>
      <nav aria-label="Hesap menüsü" className="member-tabs">{nav.map(([href,label])=><Link key={href} href={href} aria-current={selected(href)?'page':undefined}>{label}</Link>)}</nav>
      <main id="main-content" className="member-main">{children}</main>
      <footer className="member-footer"><Link href={ROUTES.home} className="font-semibold text-foreground">Paket<span className="text-brand">Jet</span></Link><div className="flex flex-wrap gap-x-6 gap-y-2"><Link href={ROUTES.static.destek}><HelpCircle size={16}/>Destek merkezi</Link><Link href="/panel/tasima-kurallari">Taşıma kuralları</Link></div></footer>
    </div>
  </div>;
}
