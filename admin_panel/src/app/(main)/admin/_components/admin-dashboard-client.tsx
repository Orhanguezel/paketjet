'use client';
import Link from 'next/link';
import {useCommerceSummaryQuery} from '@/integrations/hooks';
import {formatIlanPurchaseMoney} from '@/integrations/shared';
import {Button} from '@/components/ui/button';
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from '@/components/ui/card';
export default function AdminDashboardClient(){
 const q=useCommerceSummaryQuery();
 const cards=[
  {label:'Güncel ilan',value:q.data?.active_listings,url:'/admin/ilanlar'},
  {label:'İnceleme bekleyen ilan',value:q.data?.moderation,url:'/admin/ilanlar'},
  {label:'Açılan iletişim',value:q.data?.contact_sales,url:'/admin/ilan-purchases'},
  {label:'Kartla iletişim tahsilatı',value:q.data?formatIlanPurchaseMoney(q.data.listing_receipts):undefined,url:'/admin/ilan-purchases'},
  {label:'Hak paketi tahsilatı',value:q.data?formatIlanPurchaseMoney(q.data.package_receipts):undefined,url:'/admin/payments'},
  {label:'Kullanılan hak',value:q.data?.credit_spends,url:'/admin/credits'},
  {label:'Ödeme inceleme kuyruğu',value:q.data?.payment_queue,url:'/admin/payments'},
 ];
 return <div className="space-y-6"><div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold">Genel bakış</h1><p className="mt-2 text-sm text-muted-foreground">Güncel ilanlar, iletişim erişimleri ve ödeme işlemleri.</p></div><Button variant="outline" disabled={q.isFetching} onClick={()=>q.refetch()}>Yenile</Button></div>{q.isError&&<p role="alert" className="rounded-lg border p-4">Özet alınamadı. Rakamlar yerine çizgi gösteriliyor; tekrar deneyin.</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(card=><Link key={card.label} href={card.url}><Card className="h-full transition-colors hover:border-primary"><CardHeader><CardDescription>{card.label}</CardDescription><CardTitle className="text-3xl">{q.isError?'—':card.value??'—'}</CardTitle></CardHeader></Card></Link>)}</div><Card><CardHeader><CardTitle className="text-lg">Rakamların kapsamı</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>Tahsilatlar, tamamlanan kart işlemlerinin toplamıdır. Hak ile iletişim açılması ayrıca gelir sayılmaz. Eski TL cüzdan bakiyeleri bu toplamlara dahil değildir.</p><p>Ödeme kuyruğu başlatılan, bekleyen, inceleme ve iade bekleyen kayıtları içerir. Sağlayıcı kanıtı olmayan eski işlemler otomatik başarılı veya başarısız sayılmaz.</p><Link className="inline-flex py-2 font-medium text-primary" href="/admin/payments">İnceleme kuyruğunu aç →</Link></CardContent></Card></div>;
}
