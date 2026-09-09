'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import CityAutocomplete from '@/components/CityAutocomplete';
import PaymentModal from '@/components/PaymentModal';
import {ThemeToggle} from '@/components/ui/ThemeToggle';
export default function UiPreview(){
 const [city,setCity]=useState(''),[dialog,setDialog]=useState(false),[delayed,setDelayed]=useState(false);
 return <main className="site-container space-y-8 py-10"><div className="flex justify-between"><h1 className="text-3xl font-semibold">Bileşen durumları</h1><ThemeToggle/></div><p className="text-muted">Yalnız geliştirme ortamı. Gerçek ödeme başlatılmaz.</p><section className="flex flex-wrap gap-4"><Button>Birincil işlem</Button><Button variant="outline">İkincil işlem</Button><Button disabled>Devre dışı</Button><Button loading>İşleniyor</Button></section><section className="grid gap-5 sm:grid-cols-2"><Input label="Normal alan" placeholder="Metin girin"/><Input label="Hatalı alan" error="Bu alanı kontrol edin" defaultValue="Örnek"/><CityAutocomplete label="Klavye ile adres seçimi" value={city} onChange={setCity}/><Input label="Devre dışı alan" disabled value="Salt okunur örnek"/></section><div role="alert" className="rounded-lg border border-danger p-5 text-danger">İşlem yapılamadı. Girdiğiniz değerler korunuyor.</div><div role="status" className="rounded-lg border border-success p-5 text-success">Değişiklik kaydedildi.</div><Button onClick={()=>{setDelayed(false);setDialog(true);}}>Ödeme dialog örneği</Button><Button variant="outline" onClick={()=>{setDelayed(true);setDialog(true);}}>Geciken ödeme örneği</Button><PaymentModal iframeUrl={delayed?"/ui-preview/provider-pending":undefined} show={dialog} onClose={()=>setDialog(false)} checkoutFormContent='<p>Kontrollü test içeriği</p><label>Test alanı <input aria-label="Test alanı" /></label>'/></main>;
}
