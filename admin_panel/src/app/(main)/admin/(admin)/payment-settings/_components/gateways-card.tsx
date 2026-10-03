'use client';
import {usePaymentAvailabilityQuery} from '@/integrations/hooks';
import {Button} from '@/components/ui/button';
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from '@/components/ui/card';
export default function GatewaysCard(){
 const q=usePaymentAvailabilityQuery();
 return <Card><CardHeader><CardTitle>Etkin kart ödeme sağlayıcısı</CardTitle><CardDescription>Bu durum, satın alma ekranının kullandığı sunucu yapılandırmasından okunur.</CardDescription></CardHeader><CardContent className="space-y-4"><p role={q.isError?'alert':'status'}>{q.isError?'Sağlayıcı durumu alınamadı.':!q.data?'Kontrol ediliyor…':q.data.enabled?'Shopier etkin; kartla ödeme kullanılabilir.':'Kartla ödeme kapalı. Shopier yapılandırması tamamlanmadı veya PAYMENT_PROVIDER=shopier değil.'}</p><p className="text-sm text-muted-foreground">Kart ödemesi yalnız Shopier üzerinden alınır. Erişim anahtarı (PAT), webhook anahtarı ve ürün görseli sunucunun güvenli ortam ayarlarında yönetilir; biri eksikse kartla ödeme açılmaz.</p><p className="text-sm text-muted-foreground">Her ödeme için Shopier'de vitrinde görünmeyen tek kullanımlık bir ürün açılır; ödeme, sipariş Shopier'den okunarak doğrulanınca tamamlanır. Tutar tutmazsa ödeme 'Ödeme incelemeleri' ekranına düşer. İadeler Shopier panelinden yapılır. Anahtarlar bu ekranda görüntülenmez.</p><Button variant="outline" disabled={q.isFetching} onClick={()=>q.refetch()}>Durumu yenile</Button></CardContent></Card>;
}
