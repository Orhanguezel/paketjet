'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  formatAdminCarrierDate,
  formatAdminCarrierMoney,
  formatAdminCarrierRating,
  getErrorMessage,
  getAdminCarrierDisplayName,
  getAdminCarrierStatusKey,
  getAdminCarrierWalletStatusKey,
} from '@/integrations/shared';
import {
  useGetCarrierAdminQuery,
  useSetUserActiveAdminMutation,
} from '@/integrations/hooks';

type CarrierDetailClientProps = {
  id: string;
};

export default function CarrierDetailClient({ id }: CarrierDetailClientProps) {
  const router = useRouter();
  const t = useAdminT('admin.carriers');
  const carrierQ = useGetCarrierAdminQuery({ id });
  const [setUserActive, setUserActiveState] = useSetUserActiveAdminMutation();
  const carrier = carrierQ.data;

  async function onToggleActive() {
    if (!carrier) return;
    try {
      await setUserActive({ id: carrier.id, is_active: !carrier.is_active }).unwrap();
      toast.success(
        carrier.is_active ? t('detail.actions.deactivated') : t('detail.actions.activated'),
      );
      carrierQ.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, t('detail.actions.errorFallback')));
    }
  }

  if (carrierQ.isError) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/admin/carriers')}>
          <ArrowLeft className="mr-2 size-4" />
          {t('detail.backButton')}
        </Button>
        <div className="rounded-lg border bg-card p-4 text-sm text-destructive">
          {t('detail.loadError')}
        </div>
      </div>
    );
  }

  if (!carrier) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/admin/carriers')}>
          <ArrowLeft className="mr-2 size-4" />
          {t('detail.backButton')}
        </Button>
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          {t('detail.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/carriers')}>
              <ArrowLeft className="mr-2 size-4" />
              {t('detail.backButton')}
            </Button>
            <h1 className="text-lg font-semibold">{getAdminCarrierDisplayName(carrier)}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{carrier.email}</p>
        </div>

        <div className="flex gap-2">
          <Badge variant={carrier.is_active ? 'default' : 'outline'}>
            {t(`status.${getAdminCarrierStatusKey(carrier.is_active)}`)}
          </Badge>
          <Badge variant={carrier.email_verified ? 'secondary' : 'outline'}>
            {carrier.email_verified ? t('admin.common.yes') : t('admin.common.no')}
          </Badge>
          <Button variant="outline" onClick={() => carrierQ.refetch()} disabled={carrierQ.isFetching}>
            <RefreshCcw className="mr-2 size-4" />
            {t('admin.common.refresh')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.actions.title')}</CardTitle>
          <CardDescription>{t('detail.actions.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/admin/users/${carrier.id}`}>{t('detail.actions.openUser')}</Link>
          </Button>
          <Button
            type="button"
            variant={carrier.is_active ? 'destructive' : 'default'}
            onClick={onToggleActive}
            disabled={setUserActiveState.isLoading}
          >
            {carrier.is_active
              ? t('detail.actions.deactivate')
              : t('detail.actions.activate')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.profile.title')}</CardTitle>
          <CardDescription>{t('detail.profile.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('detail.profile.phone')}</div>
            <div className="font-medium">{carrier.phone || '-'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('detail.profile.createdAt')}</div>
            <div className="font-medium">{formatAdminCarrierDate(carrier.created_at)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('detail.profile.lastLogin')}</div>
            <div className="font-medium">{formatAdminCarrierDate(carrier.last_sign_in_at)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('detail.profile.walletStatus')}</div>
            <div className="font-medium">
              {t(`walletStatus.${getAdminCarrierWalletStatusKey(carrier.stats.wallet_status)}`)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('detail.metrics.ilanCount')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{carrier.stats.ilan_count}</div>
            <div className="text-xs text-muted-foreground">
              {carrier.stats.active_ilan_count} {t('stats.activeIlan')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('detail.metrics.bookingCount')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{carrier.stats.booking_count}</div>
            <div className="text-xs text-muted-foreground">
              {carrier.stats.delivered_booking_count} {t('stats.delivered')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('detail.metrics.rating')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatAdminCarrierRating(carrier.stats.rating_avg)}
            </div>
            <div className="text-xs text-muted-foreground">{carrier.stats.rating_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('detail.metrics.walletBalance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatAdminCarrierMoney(carrier.stats.wallet_balance)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('detail.metrics.totalTransactions')}: {carrier.stats.total_transaction_count}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('detail.wallet.title')}</CardTitle>
            <CardDescription>{t('detail.wallet.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">{t('detail.wallet.balance')}</div>
              <div className="font-medium">
                {formatAdminCarrierMoney(carrier.stats.wallet_balance)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">{t('detail.wallet.status')}</div>
              <div className="font-medium">
                {t(`walletStatus.${getAdminCarrierWalletStatusKey(carrier.stats.wallet_status)}`)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">{t('detail.wallet.totalEarnings')}</div>
              <div className="font-medium">
                {formatAdminCarrierMoney(carrier.stats.wallet_total_earnings)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">{t('detail.wallet.totalWithdrawn')}</div>
              <div className="font-medium">
                {formatAdminCarrierMoney(carrier.stats.wallet_total_withdrawn)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('detail.recentRatings.title')}</CardTitle>
            <CardDescription>{t('detail.recentRatings.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {carrier.recent_ratings.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t('detail.recentRatings.empty')}</div>
            ) : (
              carrier.recent_ratings.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">
                      {formatAdminCarrierRating(item.score)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatAdminCarrierDate(item.created_at)}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {item.comment || t('detail.recentRatings.noComment')}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.recentIlanlar.title')}</CardTitle>
          <CardDescription>{t('detail.recentIlanlar.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('detail.recentIlanlar.route')}</TableHead>
                <TableHead>{t('detail.recentIlanlar.departure')}</TableHead>
                <TableHead>{t('detail.recentIlanlar.status')}</TableHead>
                <TableHead>{t('detail.recentIlanlar.capacity')}</TableHead>
                <TableHead>{t('detail.recentIlanlar.price')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carrier.recent_ilanlar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    {t('detail.recentIlanlar.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                carrier.recent_ilanlar.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.from_city} → {item.to_city}</TableCell>
                    <TableCell>{formatAdminCarrierDate(item.departure_date)}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.available_capacity_kg}</TableCell>
                    <TableCell>{formatAdminCarrierMoney(item.price_per_kg, item.currency)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('detail.recentBookings.title')}</CardTitle>
          <CardDescription>{t('detail.recentBookings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('detail.recentBookings.id')}</TableHead>
                <TableHead>{t('detail.recentBookings.status')}</TableHead>
                <TableHead>{t('detail.recentBookings.paymentStatus')}</TableHead>
                <TableHead>{t('detail.recentBookings.kg')}</TableHead>
                <TableHead>{t('detail.recentBookings.total')}</TableHead>
                <TableHead>{t('detail.recentBookings.createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carrier.recent_bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    {t('detail.recentBookings.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                carrier.recent_bookings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id.slice(0, 8)}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.payment_status}</TableCell>
                    <TableCell>{item.kg_amount}</TableCell>
                    <TableCell>{formatAdminCarrierMoney(item.total_price, item.currency)}</TableCell>
                    <TableCell>{formatAdminCarrierDate(item.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
