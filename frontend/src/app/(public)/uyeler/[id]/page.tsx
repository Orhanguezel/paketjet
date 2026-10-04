import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import { SiteBreadcrumb } from '@/components/SiteBreadcrumb';
import type { MemberRatingsResponse } from '@/modules/rating/member-rating.type';
import { formatDate } from '@/lib/date';

type Props = { params: Promise<{id:string}> };
async function member(id: string): Promise<MemberRatingsResponse> {
  const response = await fetch(`${process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8078'}/api/ratings/member/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error('Değerlendirmeler alınamadı');
  return response.json();
}
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {id}=await params;
  const data=await member(id);
  return { title: `${data.member_name} · Değerlendirmeler`, robots: {index:false,follow:true} };
}
export default async function MemberRatingsPage({params}:Props) {
  const {id}=await params;
  const data=await member(id);
  return <div className="site-container py-10"><SiteBreadcrumb items={[{label:'İlanlar',href:'/ilanlar'},{label:data.member_name}]}/><h1 className="site-page-title">{data.member_name}</h1><p className="mt-4 flex items-center gap-2 text-lg"><Star className="text-brand" aria-hidden="true"/>{data.total ? `${data.average?.toFixed(1)} / 5 · ${data.total} doğrulanmış değerlendirme` : 'Henüz değerlendirme yok'}</p><p className="mt-2 text-sm text-muted">Puanlar yalnızca iletişim erişimi alan kullanıcılar ve ilgili ilan sahibi tarafından verilebilir; taşımanın gerçekleştiğini doğrulamaz.</p><div className="mt-8 grid gap-4">{data.data.map(item=><article key={item.id} className="rounded-lg border border-border bg-surface p-5"><p className="font-semibold">{'★'.repeat(item.score)}{'☆'.repeat(5-item.score)} <span className="sr-only">5 üzerinden {item.score} yıldız</span></p>{item.comment&&<p className="mt-3 whitespace-pre-wrap break-words">{item.comment}</p>}<p className="mt-3 text-sm text-muted">Doğrulanmış işlem · {formatDate(item.created_at)}</p></article>)}</div></div>;
}
