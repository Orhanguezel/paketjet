'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCcw, Search } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  ADMIN_CARRIERS_ACTIVE_ILAN_OPTIONS,
  ADMIN_CARRIERS_ACTIVE_OPTIONS,
  ADMIN_CARRIERS_DEFAULT_FILTERS,
  buildAdminCarrierDetailHref,
  buildAdminCarriersListParams,
  formatAdminCarrierDate,
  formatAdminCarrierRating,
  getAdminCarrierDisplayName,
  getAdminCarrierStatusKey,
  getAdminCarrierWalletStatusKey,
  type AdminCarriersActiveFilter,
  type AdminCarriersFilters,
} from '@/integrations/shared';
import { useListCarriersAdminQuery } from '@/integrations/hooks';

export default function AdminCarriersClient() {
  const t = useAdminT('admin.carriers');
  const [filters, setFilters] = React.useState<AdminCarriersFilters>(ADMIN_CARRIERS_DEFAULT_FILTERS);

  const queryParams = React.useMemo(
    () => buildAdminCarriersListParams(filters),
    [filters],
  );

  const listQ = useListCarriersAdminQuery(queryParams, { refetchOnMountOrArgChange: true });
  const rows = listQ.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('header.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => listQ.refetch()}
          disabled={listQ.isFetching}
        >
          <RefreshCcw className="mr-2 size-4" />
          {t('admin.common.refresh')}
        </Button>
      </div>

      {listQ.error ? (
        <div className="rounded-lg border bg-card p-3 text-sm text-destructive">
          {t('messages.loadError')}
        </div>
      ) : null}

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('filters.title')}</CardTitle>
          <CardDescription>{t('filters.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>{t('admin.common.search')}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder={t('filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.statusLabel')}</Label>
            <Select
              value={filters.isActive}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, isActive: value as AdminCarriersActiveFilter }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_CARRIERS_ACTIVE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`filters.${option.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.activeIlanLabel')}</Label>
            <Select
              value={filters.hasActiveIlan}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, hasActiveIlan: value as AdminCarriersFilters['hasActiveIlan'] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_CARRIERS_ACTIVE_ILAN_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`filters.${option.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('list.title')}</CardTitle>
          <CardDescription>{t('list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.carrier')}</TableHead>
                <TableHead>{t('columns.phone')}</TableHead>
                <TableHead>{t('columns.status')}</TableHead>
                <TableHead>{t('columns.ilanlar')}</TableHead>
                <TableHead>{t('columns.bookings')}</TableHead>
                <TableHead>{t('columns.rating')}</TableHead>
                <TableHead>{t('columns.wallet')}</TableHead>
                <TableHead>{t('columns.createdAt')}</TableHead>
                <TableHead>{t('columns.lastLogin')}</TableHead>
                <TableHead>{t('columns.detail')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && listQ.isFetching && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-muted-foreground">
                    {t('list.loading')}
                  </TableCell>
                </TableRow>
              )}

              {rows.length === 0 && !listQ.isFetching && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-muted-foreground">
                    {t('list.empty')}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{getAdminCarrierDisplayName(item)}</div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.phone || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge variant={item.is_active ? 'default' : 'outline'}>
                        {t(`status.${getAdminCarrierStatusKey(item.is_active)}`)}
                      </Badge>
                      <Badge variant={item.email_verified ? 'secondary' : 'outline'}>
                        {item.email_verified ? t('admin.common.yes') : t('admin.common.no')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>{item.ilan_count}</div>
                      <div className="text-muted-foreground">
                        {item.active_ilan_count} {t('stats.activeIlan')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>{item.booking_count}</div>
                      <div className="text-muted-foreground">
                        {item.delivered_booking_count} {t('stats.delivered')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>{formatAdminCarrierRating(item.rating_avg)}</div>
                      <div className="text-muted-foreground">{item.rating_count}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>{item.wallet_balance}</div>
                      <div className="text-muted-foreground">
                        {t(`walletStatus.${getAdminCarrierWalletStatusKey(item.wallet_status)}`)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatAdminCarrierDate(item.created_at)}</TableCell>
                  <TableCell>{formatAdminCarrierDate(item.last_sign_in_at)}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildAdminCarrierDetailHref(item.id)}>
                        {t('list.detailButton')}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
