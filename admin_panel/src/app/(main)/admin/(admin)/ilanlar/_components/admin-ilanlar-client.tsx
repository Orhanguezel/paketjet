'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/ilanlar/_components/admin-ilanlar-client.tsx
// PaketJet — Admin İlanlar
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Search, Trash2 } from 'lucide-react';

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  useListIlanlarAdminQuery,
  useUpdateIlanStatusAdminMutation,
  useDeleteIlanAdminMutation,
} from '@/integrations/hooks';
import {
  ADMIN_ILANLAR_EMPTY_VALUE,
  formatAdminIlanDate,
  formatAdminIlanPrice,
  formatAdminIlanWeight,
  getAdminIlanRouteLabel,
  getAdminIlanStatusVariant,
  type IlanStatus,
  type IlanAdminItem,
} from '@/integrations/shared';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export default function AdminIlanlarClient() {
  const t = useAdminT('admin.ilanlar');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<IlanAdminItem | null>(null);

  const statusLabels: Record<IlanStatus, string> = {
    active: t('status.active'),
    inactive: t('status.inactive'),
    pending: t('status.pending'),
    cancelled: t('status.cancelled'),
  };

  const { data, isLoading, isFetching, refetch } = useListIlanlarAdminQuery({
    status: statusFilter || undefined,
    page,
  });

  const [updateStatus] = useUpdateIlanStatusAdminMutation();
  const [deleteIlan, { isLoading: isDeleting }] = useDeleteIlanAdminMutation();

  const filteredItems = React.useMemo(() => {
    if (!data?.data) return [];
    const q = search.toLowerCase();
    if (!q) return data.data;
    return data.data.filter(
      (ilan) =>
        ilan.from_city.toLowerCase().includes(q) ||
        ilan.to_city.toLowerCase().includes(q) ||
        ilan.carrier_name?.toLowerCase().includes(q) ||
        ilan.id.includes(q),
    );
  }, [data, search]);

  const handleStatusChange = async (ilan: IlanAdminItem, status: IlanStatus) => {
    try {
      await updateStatus({ id: ilan.id, status }).unwrap();
      toast.success(t('messages.statusUpdated', { status: statusLabels[status] }));
    } catch {
      toast.error(t('messages.statusUpdateError'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteIlan({ id: deleteTarget.id }).unwrap();
      toast.success(t('messages.deleted'));
    } catch {
      toast.error(t('messages.deleteError'));
    } finally {
      setDeleteTarget(null);
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
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
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
                    <TableHead>{t('table.carrier')}</TableHead>
                    <TableHead>{t('table.route')}</TableHead>
                    <TableHead>{t('table.date')}</TableHead>
                    <TableHead>{t('table.capacity')}</TableHead>
                    <TableHead>{t('table.pricePerKg')}</TableHead>
                    <TableHead>{t('table.status')}</TableHead>
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
                    filteredItems.map((ilan) => (
                      <TableRow key={ilan.id}>
                        <TableCell className="font-medium">
                          {ilan.carrier_name ?? ADMIN_ILANLAR_EMPTY_VALUE}
                          <div className="text-xs text-muted-foreground font-mono">{ilan.id.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{getAdminIlanRouteLabel(ilan.from_city, ilan.to_city)}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatAdminIlanDate(ilan.departure_date)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatAdminIlanWeight(ilan.available_kg)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatAdminIlanPrice(ilan.price_per_kg)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAdminIlanStatusVariant(ilan.status)}>
                            {statusLabels[ilan.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={ilan.status}
                              onValueChange={(v) => handleStatusChange(ilan, v as IlanStatus)}
                            >
                              <SelectTrigger className="h-8 w-[100px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">{t('status.active')}</SelectItem>
                                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(ilan)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialog.deleteDescription', {
                from: deleteTarget?.from_city ?? '',
                to: deleteTarget?.to_city ?? '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t('dialog.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
