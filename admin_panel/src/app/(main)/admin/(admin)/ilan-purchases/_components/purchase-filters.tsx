'use client';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import type {IlanPurchaseAdminListParams} from '@/integrations/shared';
export function PurchaseFilters({onChange}:{onChange:(value:IlanPurchaseAdminListParams)=>void}){
 const [form,setForm]=useState({search:'',from:'',to:'',method:'',status:''});
 return <form className="flex flex-wrap items-end gap-3" onSubmit={e=>{e.preventDefault();onChange(Object.fromEntries(Object.entries(form).filter(([,value])=>value)));}}>
 <label htmlFor="purchase-search" className="text-sm">Rota veya referans<Input id="purchase-search" value={form.search} onChange={e=>setForm(f=>({...f,search:e.target.value}))}/></label>
 <label htmlFor="purchase-from" className="text-sm">Başlangıç<Input id="purchase-from" type="date" value={form.from} onChange={e=>setForm(f=>({...f,from:e.target.value}))}/></label>
 <label htmlFor="purchase-to" className="text-sm">Bitiş<Input id="purchase-to" type="date" min={form.from} value={form.to} onChange={e=>setForm(f=>({...f,to:e.target.value}))}/></label>
 <label className="text-sm">Yöntem<select className="block h-10 rounded-md border bg-background px-3" value={form.method} onChange={e=>setForm(f=>({...f,method:e.target.value}))}><option value="">Tümü</option><option value="card">Kart</option><option value="credit">Hak kullanımı</option></select></label>
 <label className="text-sm">Durum<select className="block h-10 rounded-md border bg-background px-3" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option value="">Tümü</option><option value="completed">Tamamlandı</option><option value="pending">Bekliyor</option><option value="failed">Başarısız</option><option value="refunded">İade edildi</option></select></label>
 <Button variant="outline">Filtrele</Button><Button type="button" variant="outline" onClick={()=>{setForm({search:'',from:'',to:'',method:'',status:''});onChange({});}}>Temizle</Button>
 </form>;
}
