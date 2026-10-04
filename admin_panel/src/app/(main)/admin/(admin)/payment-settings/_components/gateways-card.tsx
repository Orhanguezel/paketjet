'use client';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import {
  useRebuildShopierWebhooksMutation,
  useShopierStatusQuery,
  useTestShopierConnectionMutation,
  useUpdateShopierSettingsMutation,
} from '@/integrations/hooks';
import type { ShopierSource, ShopierTest } from '@/integrations/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdminConfirmDrawer } from '@/components/admin/admin-confirm-drawer';

const SOURCE: Record<string, string> = { panel: 'panelden', server: 'sunucu ayarından' };
const sourceText = (s: ShopierSource | 'panel' | 'server') => (s ? SOURCE[s] : 'tanımlı değil');
const errorText = (e: unknown) => {
  const code = (e as { data?: { error?: { message?: string } } }).data?.error?.message;
  return code === 'shopier_pat_rejected' ? 'Shopier bu anahtarı reddetti. Panelden yeni anahtar oluşturup tekrar deneyin.'
    : code === 'shopier_pat_unverified' ? "Anahtar doğrulanamadı; Shopier'e ulaşılamadı. Biraz sonra tekrar deneyin."
    : code === 'validation_error' ? 'Girilen değer geçersiz.' : 'İşlem tamamlanamadı.';
};

export default function GatewaysCard() {
  const id = useId();
  const status = useShopierStatusQuery();
  const [update, updating] = useUpdateShopierSettingsMutation();
  const [testConn, testing] = useTestShopierConnectionMutation();
  const [rebuild, rebuilding] = useRebuildShopierWebhooksMutation();
  const [pat, setPat] = useState(''), [image, setImage] = useState<string | null>(null), [test, setTest] = useState<ShopierTest | null>(null);
  const [pendingAction, setPendingAction] = useState<'delete-pat' | 'rebuild-webhooks' | null>(null);
  const s = status.data;
  if (status.isError) return <Card><CardContent className="pt-6"><p role="alert">Shopier ayarları alınamadı. <Button variant="outline" onClick={() => status.refetch()}>Tekrar dene</Button></p></CardContent></Card>;
  if (!s) return <Card><CardContent className="pt-6"><output>Yükleniyor…</output></CardContent></Card>;

  const save = async (body: Parameters<typeof update>[0], ok: string) => {
    try { await update(body).unwrap(); toast.success(ok); return true; } catch (e) { toast.error(errorText(e)); return false; }
  };
  const expires = s.pat.expires_at ? new Date(s.pat.expires_at) : null;
  const expiringSoon = expires ? expires.getTime() - Date.now() < 30 * 86400000 : false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">Kartla ödeme · Shopier <Badge variant={s.available ? 'default' : 'secondary'}>{s.available ? 'Açık' : 'Kapalı'}</Badge></CardTitle>
          <CardDescription>Ödemeler Shopier güvenli ödeme sayfasında alınır; kart bilgisi bu sisteme gelmez. Her ödeme için Shopier'de vitrinde görünmeyen tek kullanımlık bir ürün açılır.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div>
              <label htmlFor={`${id}-enabled`} className="font-medium">Sitede kartla ödemeyi aç</label>
              <p className="text-sm text-muted-foreground">Kapatınca yeni kart ödemesi başlatılamaz; devam eden ödemeler ve iadeler etkilenmez. Ayar {sourceText(s.card_enabled_source)} geliyor.</p>
              {s.card_enabled && !s.configured && <p role="alert" className="mt-2 text-sm text-destructive">Açık ama yapılandırma eksik (anahtar, webhook veya ürün görseli); ödeme başlatılamaz.</p>}
            </div>
            <Switch id={`${id}-enabled`} checked={s.card_enabled} disabled={updating.isLoading} onCheckedChange={(v) => void save({ card_enabled: v }, v ? 'Kartla ödeme açıldı.' : 'Kartla ödeme kapatıldı.')} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={testing.isLoading} onClick={async () => { try { setTest(await testConn().unwrap()); } catch { setTest({ ok: false, error: 'request_failed' }); } }}>{testing.isLoading ? 'Test ediliyor…' : 'Bağlantıyı test et'}</Button>
            <Button variant="outline" disabled={status.isFetching} onClick={() => status.refetch()}>Durumu yenile</Button>
          </div>
          {test && (test.ok ? (
            <output className="block space-y-2 rounded-md border p-4 text-sm">
              <p>Bağlantı çalışıyor · Mağaza: <strong>{test.shop_name || '—'}</strong> {test.shop_url && <a className="underline" href={test.shop_url} target="_blank" rel="noopener noreferrer">{test.shop_url}</a>}</p>
              <p>Bildirimler: {test.signing_ready ? 'üç bildirim kurulu ve imza anahtarları tanımlı.' : `eksik — ${test.missing_events.length ? test.missing_events.join(', ') : 'imza anahtarları'}. Aşağıdan yeniden kurun.`}</p>
            </output>
          ) : <p role="alert" className="text-sm text-destructive">Bağlantı kurulamadı ({test.error}). Anahtarı kontrol edin.</p>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>API bağlantısı</CardTitle><CardDescription>Shopier paneli → Hesap Yönetimi → Kişisel Erişim Anahtarı. Anahtar kaydedilmeden önce Shopier'de doğrulanır, şifreli saklanır ve bu ekranda bir daha gösterilmez.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Erişim anahtarı</dt>
            <dd>{s.pat.set ? <>Tanımlı · …{s.pat.last4} · {sourceText(s.pat.source)}{expires && <span className={expiringSoon ? 'text-destructive' : ''}> · bitiş {expires.toLocaleDateString('tr-TR')}</span>}</> : <span className="text-destructive">Tanımlı değil</span>}</dd>
            {!!s.pat.scopes?.length && <><dt className="text-muted-foreground">Yetkiler</dt><dd className="break-words">{s.pat.scopes.join(', ')}</dd></>}
          </dl>
          <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); if (await save({ pat: pat.trim() }, 'Anahtar doğrulandı ve kaydedildi.')) setPat(''); }}>
            <label htmlFor={`${id}-pat`} className="text-sm font-medium">{s.pat.set ? 'Anahtarı değiştir' : 'Anahtar ekle'}</label>
            <Input id={`${id}-pat`} type="password" autoComplete="off" spellCheck={false} placeholder="eyJ…" value={pat} onChange={(e) => setPat(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={!pat.trim() || updating.isLoading}>Doğrula ve kaydet</Button>
              {s.pat.source === 'panel' && <Button type="button" variant="ghost" disabled={updating.isLoading} onClick={() => setPendingAction('delete-pat')}>Paneldeki anahtarı sil</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ödeme bildirimleri (webhook)</CardTitle><CardDescription>Shopier ödeme ve iade olaylarını bu adrese imzalı olarak bildirir: <code className="break-all">{s.webhook.url}</code></CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">İmza anahtarı: {s.webhook.count}/{s.webhook.expected} · {sourceText(s.webhook.source)}</p>
          <p className="text-sm text-muted-foreground">Anahtar değiştirdiyseniz veya test eksik bildirim gösteriyorsa yeniden kurun. Bu siteye ait abonelikler silinip yeniden oluşturulur; birkaç saniyelik aralıkta gelen bildirim kaçarsa ödeme sonuç sayfası durumu Shopier'den kendisi sorgular.</p>
          <Button variant="outline" disabled={rebuilding.isLoading || !s.pat.set} onClick={() => setPendingAction('rebuild-webhooks')}>{rebuilding.isLoading ? 'Kuruluyor…' : 'Bildirimleri yeniden kur'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ödeme sayfası görseli</CardTitle><CardDescription>Shopier ödeme sayfasında ürün görseli olarak görünür. Herkese açık https jpg/png adresi.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); if (await save({ product_image_url: (image ?? '').trim() || null }, 'Görsel kaydedildi.')) setImage(null); }}>
            <label htmlFor={`${id}-image`} className="text-sm font-medium">Görsel adresi ({sourceText(s.product_image.source)})</label>
            <div className="flex flex-wrap items-center gap-3">
              {/* biome-ignore lint/performance/noImgElement: harici Shopier gorsel adresi onizlemesi */}
              {s.product_image.url && <img src={s.product_image.url} alt="" className="size-12 rounded border object-contain" />}
              <Input id={`${id}-image`} type="url" className="min-w-64 flex-1" value={image ?? s.product_image.url ?? ''} onChange={(e) => setImage(e.target.value)} />
              <Button type="submit" variant="outline" disabled={image === null || updating.isLoading}>Kaydet</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <AdminConfirmDrawer open={!!pendingAction} onOpenChange={open => { if (!open) setPendingAction(null); }} title={pendingAction === 'delete-pat' ? 'Paneldeki anahtarı sil' : 'Bildirimleri yeniden kur'} description={pendingAction === 'delete-pat' ? 'Paneldeki anahtar silinsin mi? Sunucu ayarında anahtar varsa o kullanılır.' : 'Bildirim abonelikleri yeniden kurulsun mu?'} busy={updating.isLoading || rebuilding.isLoading} onConfirm={async () => { if (pendingAction === 'delete-pat') { if (await save({ pat: null }, 'Paneldeki anahtar silindi.')) setPendingAction(null); } else if (pendingAction === 'rebuild-webhooks') { try { await rebuild().unwrap(); toast.success('Bildirimler yeniden kuruldu.'); setTest(null); setPendingAction(null); } catch { toast.error('Bildirimler kurulamadı. Anahtarı ve bağlantıyı kontrol edin.'); } } }} />
    </div>
  );
}
