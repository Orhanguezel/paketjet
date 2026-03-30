'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
  ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT,
  AGREEMENT_TYPES,
  AGREEMENT_STATUSES,
  pickCarrierAgreementListQuery,
  toCarrierAgreementSearchParams,
  getAgreementCarrierName,
  formatCommissionRate,
  getEffectiveCommissionRate,
  getAgreementsPreviousOffset,
  getAgreementsNextOffset,
  type AgreementType,
  type AgreementStatus,
  type CarrierAgreementDto,
  type CarrierAgreementListParams,
} from '@/integrations/shared';
import { useListCarrierAgreementsAdminQuery } from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

function statusVariant(s: AgreementStatus) {
  if (s === 'active') return 'secondary' as const;
  if (s === 'suspended') return 'outline' as const;
  return 'destructive' as const;
}

export default function CarrierAgreementsListClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useAdminT('admin.carrier-agreements');

  const params = React.useMemo(() => pickCarrierAgreementListQuery(sp), [sp]);
  const listQ = useListCarrierAgreementsAdminQuery(params);

  const [type, setType] = React.useState<AgreementType | 'all'>(params.type ?? 'all');
  const [status, setStatus] = React.useState<AgreementStatus | 'all'>(params.status ?? 'all');

  React.useEffect(() => {
    setType(params.type ?? 'all');
    setStatus(params.status ?? 'all');
  }, [params.type, params.status]);

  function apply(next: Partial<CarrierAgreementListParams>) {
    const merged: CarrierAgreementListParams = {
      ...params,
      ...next,
      offset: next.offset != null ? next.offset : 0,
    };
    if (!merged.type) delete merged.type;
    if (!merged.status) delete merged.status;
    const qs = toCarrierAgreementSearchParams(merged);
    router.push(qs ? `/admin/carrier-agreements?${qs}` : '/admin/carrier-agreements');
  }

  const limit = params.limit ?? ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT;
  const offset = params.offset ?? 0;
  const items = listQ.data?.items ?? [];
  const total = listQ.data?.total ?? 0;
  const canPrev = offset > 0;
  const canNext = items.length >= limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('list.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('list.description')}</p>
        </div>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('list.filters.title')}</CardTitle>
          <CardDescription>{t('list.filters.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="w-full space-y-2 lg:w-48">
              <Label>{t('list.filters.typeLabel')}</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  const vv = v as AgreementType | 'all';
                  setType(vv);
                  apply({ type: vv === 'all' ? undefined : vv });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('list.filters.typePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('list.filters.typePlaceholder')}</SelectItem>
                  {AGREEMENT_TYPES.map((at) => (
                    <SelectItem key={at} value={at}>
                      {t(`types.${at}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2 lg:w-48">
              <Label>{t('list.filters.statusLabel')}</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  const vv = v as AgreementStatus | 'all';
                  setStatus(vv);
                  apply({ status: vv === 'all' ? undefined : vv });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('list.filters.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('list.filters.statusPlaceholder')}</SelectItem>
                  {AGREEMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`statuses.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setType('all');
                  setStatus('all');
                  router.push('/admin/carrier-agreements');
                }}
                disabled={listQ.isFetching}
              >
                {t('list.filters.resetButton')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => listQ.refetch()}
                disabled={listQ.isFetching}
                title={t('list.filters.refreshButton')}
              >
                <RefreshCcw className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tablo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('list.table.title')}</CardTitle>
          <CardDescription>
            {listQ.isFetching
              ? t('list.table.loading')
              : t('list.table.totalRecords', { count: total })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {listQ.isError ? (
            <div className="rounded-md border p-4 text-sm">
              {t('list.table.loadError')}{' '}
              <Button variant="link" className="px-1" onClick={() => listQ.refetch()}>
                {t('list.table.retryButton')}
              </Button>
            </div>
          ) : null}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('list.table.carrier')}</TableHead>
                  <TableHead>{t('list.table.email')}</TableHead>
                  <TableHead>{t('list.table.type')}</TableHead>
                  <TableHead>{t('list.table.commissionRate')}</TableHead>
                  <TableHead>{t('list.table.plan')}</TableHead>
                  <TableHead>{t('list.table.status')}</TableHead>
                  <TableHead className="text-right">{t('list.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((a: CarrierAgreementDto) => {
                  const effective = getEffectiveCommissionRate(a);
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {getAgreementCarrierName(a, t('list.table.emptyValue'))}
                      </TableCell>
                      <TableCell>{a.carrier_email ?? t('list.table.emptyValue')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`types.${a.agreement_type}`)}</Badge>
                      </TableCell>
                      <TableCell>
                        {effective != null
                          ? formatCommissionRate(effective)
                          : t('list.table.emptyValue')}
                      </TableCell>
                      <TableCell>{a.plan_name ?? t('list.table.emptyValue')}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(a.status)}>
                          {t(`statuses.${a.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            prefetch={false}
                            href={`/admin/carrier-agreements/${encodeURIComponent(a.id)}`}
                          >
                            {t('list.table.viewButton')}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!listQ.isFetching && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      {t('list.table.noRecords')}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {t('list.pagination.offset', { offset })} •{' '}
              {t('list.pagination.limit', { limit })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canPrev || listQ.isFetching}
                onClick={() => apply({ offset: getAgreementsPreviousOffset(offset, limit) })}
              >
                <ChevronLeft className="mr-1 size-4" />
                {t('list.pagination.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canNext || listQ.isFetching}
                onClick={() => apply({ offset: getAgreementsNextOffset(offset, limit) })}
              >
                {t('list.pagination.next')}
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
