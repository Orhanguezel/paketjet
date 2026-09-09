import type {Ref} from 'react';
import Link from 'next/link';
import {ArrowRight,CircleCheck} from 'lucide-react';
import {ROUTES} from '@/config/routes';
export default function ListingResult({headingRef,onSuccess}:{headingRef:Ref<HTMLHeadingElement>;onSuccess?:()=>void}){
 return <section className="listing-panel listing-success"><CircleCheck size={52} className="text-brand"/><h2 ref={headingRef} tabIndex={-1}>İlanın incelemeye gönderildi</h2><p className="mt-4 leading-7 text-muted">Onaylandıktan sonra yayımlanacak. Durumunu İlanlarım ekranından takip edebilirsin.</p>{onSuccess?<button className="listing-next mt-6" onClick={onSuccess}>İlanlarıma git<ArrowRight size={18}/></button>:<Link href={ROUTES.panel.ilanlarim} className="listing-next mt-6">İlanlarıma git<ArrowRight size={18}/></Link>}</section>;
}
