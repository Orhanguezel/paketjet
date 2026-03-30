'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  AGREEMENT_TYPES,
  AGREEMENT_STATUSES,
  formatCommissionRate,
  type AgreementType,
  type AgreementStatus,
} from '@/integrations/shared';
import {
  useGetCarrierAgreementAdminQuery,
  useUpdateCarrierAgreementAdminMutation,
  useDeleteCarrierAgreementAdminMutation,
} from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function CarrierAgreementDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const t = useAdminT('admin.carrier-agreements');

  const detailQ = useGetCarrierAgreementAdminQuery({ id });
  const [updateAgreement, updateState] = useUpdateCarrierAgreementAdminMutation();
  const [deleteAgreement, deleteState] = useDeleteCarrierAgreementAdminMutation();

  const a = detailQ.data;

  // Form state
  const [agreementType, setAgreementType] = React.useState<AgreementType>('commission');
  const [commissionRate, setCommissionRate] = React.useState('');
  const [status, setStatus] = React.useState<AgreementStatus>('active');
  const [adminNote, setAdminNote] = React.useState('');

  // Hydrate form
  React.useEffect(() => {
    if (!a) return;
    setAgreementType(a.agreement_type as AgreementType);
    setCommissionRate(a.commission_rate ?? '');
    setStatus(a.status as AgreementStatus);
    setAdminNote(a.admin_note ?? '');
  }, [a]);

  const busy = updateState.isLoading || deleteState.isLoading;

  async function handleSave() {
    try {
      const rate = commissionRate.trim() ? parseFloat(commissionRate) : null;
      await updateAgreement({
        id,
        agreement_type: agreementType,
        commission_rate: rate,
        status,
        admin_note: adminNote.trim() || null,
      }).unwrap();
      toast.success(t('detail.info.saved'));
    } catch {
      toast.error(t('detail.errorFallback'));
    }
  }

  async function handleDelete() {
    if (!confirm(t('detail.delete.confirm'))) return;
    try {
      await deleteAgreement({ id }).unwrap();
      toast.success(t('detail.delete.deleted'));
      router.push('/admin/carrier-agreements');
    } catch {
      toast.error(t('detail.errorFallback'));
    }
  }

  if (detailQ.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">{t('detail.loading')}</div>;
  }

  if (detailQ.isError || !a) {
    return (
      <div className="p-6 text-sm">
        {t('detail.loadError')}{' '}
        <Button variant="link" className="px-1" onClick={() => detailQ.refetch()}>
          {t('detail.retryButton')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/carrier-agreements')}>
          <ArrowLeft className="mr-1 size-4" />
          {t('detail.backButton')}
        </Button>
        <h1 className="text-lg font-semibold">{t('detail.title')}</h1>
      </div>

      {/* Taşıyıcı Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.carrier.title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">{t('detail.carrier.name')}: </span>
            <span className="font-medium">{a.carrier_name ?? '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('detail.carrier.email')}: </span>
            <span className="font-medium">{a.carrier_email ?? '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('detail.carrier.startDate')}: </span>
            <span className="font-medium">
              {a.starts_at ? new Date(a.starts_at).toLocaleDateString('tr-TR') : '—'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('detail.carrier.expiryDate')}: </span>
            <span className="font-medium">
              {a.expires_at
                ? new Date(a.expires_at).toLocaleDateString('tr-TR')
                : t('detail.carrier.noExpiry')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Efektif Komisyon */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.commission.title')}</CardTitle>
          <CardDescription>{t('detail.commission.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">{t('detail.commission.carrierRate')}: </span>
            <Badge variant={a.commission_rate ? 'default' : 'outline'}>
              {a.commission_rate ? formatCommissionRate(a.commission_rate) : t('detail.commission.notSet')}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">{t('detail.commission.planRate')}: </span>
            <Badge variant={a.plan_commission_rate ? 'secondary' : 'outline'}>
              {a.plan_commission_rate
                ? formatCommissionRate(a.plan_commission_rate)
                : t('detail.commission.notSet')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Anlaşma Düzenleme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.info.title')}</CardTitle>
          <CardDescription>{t('detail.info.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('detail.info.typeLabel')}</Label>
              <Select
                value={agreementType}
                onValueChange={(v) => setAgreementType(v as AgreementType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGREEMENT_TYPES.map((at) => (
                    <SelectItem key={at} value={at}>
                      {t(`types.${at}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('detail.info.commissionRateLabel')}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder={t('detail.info.commissionRatePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('detail.info.statusLabel')}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AgreementStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGREEMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`statuses.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('detail.info.adminNoteLabel')}</Label>
            <Textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder={t('detail.info.adminNotePlaceholder')}
              rows={3}
            />
          </div>

          <Button onClick={handleSave} disabled={busy}>
            {t('detail.info.saveButton')}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Silme */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">{t('detail.delete.title')}</CardTitle>
          <CardDescription>{t('detail.delete.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDelete} disabled={busy}>
            {t('detail.delete.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
