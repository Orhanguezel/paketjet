'use client';

import {PurchaseFilters} from './purchase-filters';
import type {IlanPurchaseAdminListParams,IlanPurchaseAdminItem} from '@/integrations/shared';
import * as React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminDetailDrawer } from '@/components/admin/admin-detail-drawer';
import { Textarea } from '@/components/ui/textarea';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useListIlanPurchasesAdminQuery,useGrantPurchaseCreditRemedyMutation } from '@/integrations/hooks';
import { formatIlanPurchaseDate, formatIlanPurchaseMoney } from '@/integrations/shared';

export default function AdminIlanPurchasesClient() {
  const t = useAdminT('admin.purchases');
  const [page, setPage] = React.useState(1);
  const [filters,setFilters]=React.useState<IlanPurchaseAdminListParams>({});
  const [selected,setSelected]=React.useState<IlanPurchaseAdminItem|null>(null);
  const [reason,setReason]=React.useState('');
  const [verified,setVerified]=React.useState(false);
  const [remedyError,setRemedyError]=React.useState('');
  const [grant,{isLoading:granting}]=useGrantPurchaseCreditRemedyMutation();
  const { data, isLoading, isFetching, isError, refetch } = useListIlanPurchasesAdminQuery({ page,...filters });
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">{t('header.title')}</CardTitle>
            <CardDescription>{t('header.description')}</CardDescription>
          </div>
          <Button aria-label="Satın almaları yenile" variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PurchaseFilters onChange={value=>{setFilters(value);setPage(1);}}/>
        {isError ? <p role="alert">Satın alma kayıtları alınamadı. Yenileyip tekrar deneyin.</p> : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.route')}</TableHead>
                  <TableHead>{t('table.buyer')}</TableHead>
                  <TableHead>{t('table.seller')}</TableHead>
                  <TableHead>{t('table.price')}</TableHead>
                  <TableHead>{t('table.value')}</TableHead>
                  <TableHead>{t('table.contact')}</TableHead>
                  <TableHead>{t('table.date')}</TableHead>
                  <TableHead>Hak iadesi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      {t('table.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.from_city ?? '-'} → {item.to_city ?? '-'}</div>
                        <div className="font-mono text-xs text-muted-foreground">{item.ilan_id.slice(0, 8)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{item.buyer_name ?? '-'}</div>
                        <div className="text-xs text-muted-foreground">{item.buyer_email ?? '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{item.seller_name ?? '-'}</div>
                        <div className="text-xs text-muted-foreground">{item.seller_email ?? '-'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.pay_method === 'credit' ? 'secondary' : 'default'}>{item.pay_method}</Badge>
                        <div className="mt-1 text-xs text-muted-foreground">{formatIlanPurchaseMoney(item.price_paid)}</div>
                      </TableCell>
                      <TableCell>{formatIlanPurchaseMoney(item.estimated_value)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{item.contact?.name ?? '-'}</div>
                        <div className="text-xs text-muted-foreground">{item.contact?.phone ?? '-'}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatIlanPurchaseDate(item.created_at)}</TableCell>
                      <TableCell><Button size="sm" variant="outline" onClick={()=>{setSelected(item);setReason('');setVerified(false);setRemedyError('');}}>Detay</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('pagination.summary', { total: String(total), page: String(page), totalPages: String(totalPages) })}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>{t('pagination.previous')}</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>{t('pagination.next')}</Button>
            </div>
          </div>
        )}
        <AdminDetailDrawer open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}} title="İletişim satışı" description={selected?.id} eyebrow="Satın alma detayı"><div className="space-y-5">{selected&&<><dl className="grid grid-cols-2 gap-3 text-sm"><div className="col-span-2"><dt className="text-muted-foreground">Rota</dt><dd className="font-medium">{selected.from_city} → {selected.to_city}</dd></div><div><dt className="text-muted-foreground">Alıcı</dt><dd>{selected.buyer_name||'—'}<br/>{selected.buyer_email||'—'}</dd></div><div><dt className="text-muted-foreground">Satıcı</dt><dd>{selected.seller_name||'—'}<br/>{selected.seller_email||'—'}</dd></div><div><dt className="text-muted-foreground">Ödeme</dt><dd>{selected.pay_method} · {formatIlanPurchaseMoney(selected.price_paid)}</dd></div><div><dt className="text-muted-foreground">Tarih</dt><dd>{formatIlanPurchaseDate(selected.created_at)}</dd></div><div className="col-span-2"><dt className="text-muted-foreground">İletişim</dt><dd>{selected.contact?.name||'—'} · {selected.contact?.phone||'—'}</dd></div></dl>{selected.remedy_id?<p className="rounded-lg border p-4 text-sm">Bu satın alma için 1 hak tanımlandı.</p>:selected.status==='completed'?<section className="space-y-3 border-t pt-5"><h3 className="font-semibold">Doğrulanmış şikâyet için 1 hak tanımla</h3><p className="text-sm text-muted-foreground">Bu işlem aynı satın alma için yalnızca bir kez yapılır. Yasal para iadesi talebinin yerine geçmez.</p><form className="space-y-4" onSubmit={async event=>{event.preventDefault();if(!verified)return;try{await grant({id:selected.id,reason,verified:true}).unwrap();setSelected(null);refetch();}catch{setRemedyError('Hak tanımlanamadı. Satın alma ve önceki işlemleri kontrol edin.');}}}><label className="block text-sm">İnceleme sonucu ve kanıt referansı<Textarea className="mt-2" minLength={10} maxLength={500} required value={reason} onChange={event=>setReason(event.target.value)}/></label><label className="flex gap-2 text-sm"><input type="checkbox" checked={verified} onChange={event=>setVerified(event.target.checked)}/>Şikâyetin doğrulandığını teyit ediyorum.</label>{remedyError&&<p role="alert" className="text-sm text-destructive">{remedyError}</p>}<Button disabled={granting||!verified||reason.trim().length<10}>1 hak tanımla</Button></form></section>:null}</>}</div></AdminDetailDrawer>
      </CardContent>
    </Card>
  );
}
