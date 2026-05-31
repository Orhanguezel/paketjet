'use client';

import * as React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useListIlanPurchasesAdminQuery } from '@/integrations/hooks';
import { formatIlanPurchaseDate, formatIlanPurchaseMoney } from '@/integrations/shared';

export default function AdminIlanPurchasesClient() {
  const t = useAdminT('admin.purchases');
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isFetching, refetch } = useListIlanPurchasesAdminQuery({ page });
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
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
