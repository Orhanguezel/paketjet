'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/bookings/_components/admin-bookings-client.tsx
// PaketJet — Admin Bookings (Rezervasyonlar)
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
  useListBookingsAdminQuery,
  useUpdateBookingStatusAdminMutation,
} from '@/integrations/hooks';
import {
  ADMIN_BOOKINGS_EMPTY_VALUE,
  getAdminBookingStatusVariant,
  formatAdminBookingDate,
  formatAdminBookingPrice,
  formatAdminBookingWeight,
  getAdminBookingRouteLabel,
  type BookingStatus,
  type BookingAdminItem,
} from '@/integrations/shared';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function AdminBookingsClient() {
  const t = useAdminT('admin.bookings');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const statusLabels: Record<BookingStatus, string> = {
    pending: t('status.pending'),
    confirmed: t('status.confirmed'),
    in_transit: t('status.inTransit'),
    delivered: t('status.delivered'),
    cancelled: t('status.cancelled'),
    refunded: t('status.refunded'),
  };

  const paymentLabels: Record<string, string> = {
    unpaid: t('payment.unpaid'),
    paid: t('payment.paid'),
    refunded: t('payment.refunded'),
  };

  const { data, isLoading, isFetching, refetch } = useListBookingsAdminQuery({
    status: statusFilter || undefined,
    page,
  });

  const [updateStatus] = useUpdateBookingStatusAdminMutation();

  const filteredItems = React.useMemo(() => {
    if (!data?.data) return [];
    const q = search.toLowerCase();
    if (!q) return data.data;
    return data.data.filter(
      (b) =>
        b.customer_name?.toLowerCase().includes(q) ||
        b.from_city?.toLowerCase().includes(q) ||
        b.to_city?.toLowerCase().includes(q) ||
        b.id.includes(q),
    );
  }, [data, search]);

  const handleStatusChange = async (booking: BookingAdminItem, status: BookingStatus) => {
    try {
      await updateStatus({ id: booking.id, status }).unwrap();
      toast.success(t('messages.statusUpdated', { status: statusLabels[status] }));
    } catch {
      toast.error(t('messages.statusUpdateError'));
    }
  };

  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{t('header.title')}</CardTitle>
              <CardDescription>{t('header.description')}</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('filters.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter || 'all'}
              onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={t('filters.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
                <SelectItem value="in_transit">{t('status.inTransit')}</SelectItem>
                <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                <SelectItem value="refunded">{t('status.refunded')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.customer')}</TableHead>
                    <TableHead>{t('table.route')}</TableHead>
                    <TableHead>{t('table.kgPrice')}</TableHead>
                    <TableHead>{t('table.status')}</TableHead>
                    <TableHead>{t('table.payment')}</TableHead>
                    <TableHead>{t('table.date')}</TableHead>
                    <TableHead>{t('table.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {t('table.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.customer_name ?? ADMIN_BOOKINGS_EMPTY_VALUE}
                          <div className="text-xs text-muted-foreground font-mono">{booking.id.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {getAdminBookingRouteLabel(booking.from_city, booking.to_city)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatAdminBookingWeight(booking.kg)}</span>
                          <div className="text-xs text-muted-foreground">{formatAdminBookingPrice(booking.total_price)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAdminBookingStatusVariant(booking.status)}>
                            {statusLabels[booking.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {paymentLabels[booking.payment_status] ?? booking.payment_status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatAdminBookingDate(booking.created_at)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(v) => handleStatusChange(booking, v as BookingStatus)}
                          >
                            <SelectTrigger className="h-8 w-[120px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{t('statusActions.pending')}</SelectItem>
                              <SelectItem value="confirmed">{t('statusActions.confirmed')}</SelectItem>
                              <SelectItem value="in_transit">{t('statusActions.inTransit')}</SelectItem>
                              <SelectItem value="delivered">{t('statusActions.delivered')}</SelectItem>
                              <SelectItem value="cancelled">{t('statusActions.cancelled')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('pagination.summary', {
                  total: String(total),
                  page: String(page),
                  totalPages: String(totalPages),
                })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  {t('pagination.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  {t('pagination.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
