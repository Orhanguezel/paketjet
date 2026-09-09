'use client';
import {usePaymentAvailabilityQuery} from '@/integrations/hooks';
import {Button} from '@/components/ui/button';
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from '@/components/ui/card';
export default function GatewaysCard(){
 const q=usePaymentAvailabilityQuery();
 return <Card><CardHeader><CardTitle>Etkin kart ödeme sağlayıcısı</CardTitle><CardDescription>Bu durum, satın alma ekranının kullandığı sunucu yapılandırmasından okunur.</CardDescription></CardHeader><CardContent className="space-y-4"><p role={q.isError?'alert':'status'}>{q.isError?'Sağlayıcı durumu alınamadı.':!q.data?'Kontrol ediliyor…':q.data.enabled?`${q.data.provider} etkin; kartla ödeme kullanılabilir.`:`Kartla ödeme kapalı. Seçili sağlayıcı: ${q.data.provider??'yok'}.`}</p><p className="text-sm text-muted-foreground">Sağlayıcı seçimi ve anahtarlar sunucunun güvenli ortam ayarlarında yönetilir. Eksik anahtarlar veya üretimde sandbox kullanımı ödeme başlatılmasını engeller. Veritabanındaki eski entegrasyon anahtarları bu seçimi değiştirmez.</p><p className="text-sm text-muted-foreground">Sağlayıcı hesabı etkinleştirildikten sonra callback adresleri, gerçek tahsilat ve iade doğrulaması tamamlanmalıdır. Anahtarlar bu ekranda görüntülenmez.</p><Button variant="outline" disabled={q.isFetching} onClick={()=>q.refetch()}>Durumu yenile</Button></CardContent></Card>;
}
