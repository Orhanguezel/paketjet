import Link from 'next/link';
import {ArrowRight, Handshake, MapPinned, MessageCircle, Route, FilePlus2} from 'lucide-react';
import BrandMotion from './BrandMotion';
import {ROUTES} from '@/config/routes';
export function HomePrinciples(){
  return <section className="home-principles" aria-label="PaketJet ile nasıl ilerlersin"><div className="site-container">
    {[[MessageCircle,'Doğrudan iletişim','Taşıyıcıyla doğrudan görüş.'],[FilePlus2,'Ücretsiz taşıyıcı ilanı','Güzergâhını ücretsiz paylaş.'],[Handshake,'Taşıma detayları taraflar arasında','Fiyatı, yükü ve teslimatı birlikte netleştirin.']].map(([Icon,title,copy])=>{const Symbol=Icon as typeof MessageCircle;return <div className="principle" key={String(title)}><span className="principle-icon"><Symbol size={24} strokeWidth={1.6}/></span><div><h2>{String(title)}</h2><p>{String(copy)}</p></div></div>;})}
  </div></section>;
}
export function EmptyListings(){
  return <div className="home-empty"><div className="empty-route-art" aria-hidden="true"><MapPinned size={90} strokeWidth={0.8}/><span/><Route size={28} strokeWidth={1.5}/></div><div><h3>Yeni yollar, yeni fırsatlar.</h3><p>Şu anda aktif ilan bulunmuyor.<br/>Güzergâhını paylaş, ilk bağlantıyı sen kur.</p><Link className="primary-action" href={ROUTES.ilanVer}>Ücretsiz ilan ver<ArrowRight size={18}/></Link></div></div>;
}
export function HowItWorks(){
  const steps=[['İlanı bul','Planına uygun güzergâhlardaki taşıyıcı ilanlarını keşfet.'],['İletişimi aç','Beğendiğin ilanın iletişim bilgilerine eriş. Erişim ücreti, taşıma bedeli değildir.'],['Taşıyıcıyla görüş','Taşıma detaylarını doğrudan birlikte netleştirin.']];
  return <section id="nasil-calisir" className="home-how"><div className="site-container"><div className="section-heading"><div><h2>Nasıl çalışır?</h2><p>Göndericiyle taşıyıcı arasında daha kolay bir bağlantı.</p></div></div><div className="how-composition"><BrandMotion/><ol>{steps.map(([title,copy],i)=><li key={title}><span className="step-number">0{i+1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></div></section>;
}
export function CarrierInvitation(){
  return <section className="carrier-invitation"><div className="site-container"><div><h2>Yolun belli mi?</h2><p>Güzergâhını ücretsiz paylaş, yeni bağlantılara yer aç.</p><Link href={ROUTES.ilanVer} className="invitation-action">Ücretsiz İlan Ver<ArrowRight size={20}/></Link></div><svg viewBox="0 0 450 220" aria-hidden="true"><path d="M20 184C150 182 285 130 218 89S119 203 268 134 354 49 425 27"/><circle cx="20" cy="184" r="8"/><circle cx="425" cy="27" r="8"/></svg></div></section>;
}
