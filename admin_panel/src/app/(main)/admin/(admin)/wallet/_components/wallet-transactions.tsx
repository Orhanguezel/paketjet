'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
  useListWalletTransactionsAdminQuery,
  useUpdateTransactionStatusAdminMutation,
} from '@/integrations/hooks';
import {
  ADMIN_WALLET_TRANSACTIONS_PAGE_SIZE,
  ADMIN_WALLET_TX_AMOUNT_CLASS,
  ADMIN_WALLET_TX_STATUS_BADGE_CLASS,
  ADMIN_WALLET_TX_TYPE_BADGE_CLASS,
  formatAdminWalletAmount,
  formatAdminWalletDateTime,
  getAdminWalletSignedAmountPrefix,
  type WalletTransactionsProps,
  type WalletTxStatus,
} from '@/integrations/shared';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

export function WalletTransactions({ walletId }: WalletTransactionsProps) {
  const t = useAdminT('admin.wallet');
  const [page, setPage] = React.useState(1);
  const { data, isLoading, refetch } = useListWalletTransactionsAdminQuery({
    walletId,
    page,
    limit: ADMIN_WALLET_TRANSACTIONS_PAGE_SIZE,
  });
  const [updateTxStatus] = useUpdateTransactionStatusAdminMutation();

  const transactions = data?.data ?? [];
  const hasMore = transactions.length === ADMIN_WALLET_TRANSACTIONS_PAGE_SIZE;

  const handleStatusChange = async (id: string, payment_status: WalletTxStatus) => {
    try {
      await updateTxStatus({ id, body: { payment_status } }).unwrap();
      toast.success(t('transactions.messages.statusUpdated'));
      refetch();
    } catch {
      toast.error(t('transactions.messages.statusUpdateError'));
    }
  };

  if (isLoading) {
    return <p className="py-4 text-center text-sm text-muted-foreground">{t('common.loading')}</p>;
  }
  if (transactions.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">{t('transactions.empty')}</p>;
  }

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('transactions.columns.date')}</TableHead>
            <TableHead>{t('transactions.columns.type')}</TableHead>
            <TableHead>{t('transactions.columns.amount')}</TableHead>
            <TableHead>{t('transactions.columns.purpose')}</TableHead>
            <TableHead>{t('transactions.columns.status')}</TableHead>
            <TableHead>{t('transactions.columns.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-xs">{formatAdminWalletDateTime(tx.created_at)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  ADMIN_WALLET_TX_TYPE_BADGE_CLASS[tx.type]
                }`}>
                  {tx.type === 'credit'
                    ? `↓ ${t('transactionType.credit')}`
                    : `↑ ${t('transactionType.debit')}`}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                <span className={ADMIN_WALLET_TX_AMOUNT_CLASS[tx.type]}>
                  {getAdminWalletSignedAmountPrefix(tx.type)}{formatAdminWalletAmount(tx.amount, tx.currency)}
                </span>
              </TableCell>
              <TableCell className="max-w-[140px] truncate text-xs">{tx.purpose}</TableCell>
              <TableCell>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  ADMIN_WALLET_TX_STATUS_BADGE_CLASS[tx.payment_status] ?? ''
                }`}>
                  {t(`transactionStatus.${tx.payment_status}`)}
                </span>
              </TableCell>
              <TableCell>
                <Select
                  value={tx.payment_status}
                  onValueChange={(v) => handleStatusChange(tx.id, v as WalletTxStatus)}
                >
                  <SelectTrigger className="h-7 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('transactionStatus.pending')}</SelectItem>
                    <SelectItem value="completed">{t('transactionStatus.completed')}</SelectItem>
                    <SelectItem value="failed">{t('transactionStatus.failed')}</SelectItem>
                    <SelectItem value="refunded">{t('transactionStatus.refunded')}</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            {t('pagination.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('pagination.page', { page: String(page) })}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
            {t('pagination.next')}
          </Button>
        </div>
      )}
    </div>
  );
}
