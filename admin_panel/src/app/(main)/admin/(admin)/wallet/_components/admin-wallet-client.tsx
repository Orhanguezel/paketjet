'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Wallet, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  useListWalletsAdminQuery,
  useUpdateWalletStatusAdminMutation,
  useAdjustWalletAdminMutation,
} from '@/integrations/hooks';
import {
  ADMIN_WALLET_LIST_PAGE_SIZE,
  ADMIN_WALLET_STATUS_BADGE_CLASS,
  formatAdminWalletAmount,
  type WalletAdminView,
  type WalletStatus,
  type WalletTxType,
} from '@/integrations/shared';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { WalletTransactions } from './wallet-transactions';

/* ===================== Main Component ===================== */
export default function AdminWalletClient() {
  const t = useAdminT('admin.wallet');
  const [page, setPage] = React.useState(1);
  const { data, isLoading, refetch } = useListWalletsAdminQuery({ page, limit: ADMIN_WALLET_LIST_PAGE_SIZE });
  const [updateStatus] = useUpdateWalletStatusAdminMutation();
  const [adjustWallet, { isLoading: isAdjusting }] = useAdjustWalletAdminMutation();

  const [expandedWalletId, setExpandedWalletId] = React.useState<string | null>(null);
  const [adjustDialog, setAdjustDialog] = React.useState<WalletAdminView | null>(null);
  const [adjustForm, setAdjustForm] = React.useState({
    type: 'credit' as WalletTxType,
    amount: '',
    purpose: '',
    description: '',
  });

  const wallets = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasMore = wallets.length === ADMIN_WALLET_LIST_PAGE_SIZE;

  const handleStatusChange = async (id: string, status: WalletStatus) => {
    try {
      await updateStatus({ id, body: { status } }).unwrap();
      toast.success(t('messages.walletStatusUpdated'));
      refetch();
    } catch {
      toast.error(t('messages.walletStatusUpdateError'));
    }
  };

  const handleAdjust = async () => {
    if (!adjustDialog) return;
    const amount = parseFloat(adjustForm.amount);
    if (!amount || amount <= 0) {
      toast.error(t('messages.invalidAmount'));
      return;
    }
    try {
      await adjustWallet({
        user_id: adjustDialog.user_id,
        type: adjustForm.type,
        amount,
        purpose:
          adjustForm.purpose ||
          (adjustForm.type === 'credit'
            ? t('defaults.creditPurpose')
            : t('defaults.debitPurpose')),
        description: adjustForm.description || undefined,
        payment_status: 'completed',
      }).unwrap();
      toast.success(t('messages.adjusted'));
      setAdjustDialog(null);
      setAdjustForm({ type: 'credit', amount: '', purpose: '', description: '' });
      refetch();
    } catch {
      toast.error(t('messages.adjustError'));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> {t('header.title')}
            </CardTitle>
            <CardDescription>
              {t('header.description', { total: String(total) })}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="mr-1 h-3 w-3" /> {t('common.refresh')}
          </Button>
        </CardHeader>
      </Card>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">{t('common.loading')}</p>
      ) : wallets.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">{t('table.empty')}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{t('table.user')}</TableHead>
                <TableHead>{t('table.balance')}</TableHead>
                <TableHead>{t('table.totalEarnings')}</TableHead>
                <TableHead>{t('table.totalWithdrawn')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map((w) => (
                <React.Fragment key={w.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedWalletId(expandedWalletId === w.id ? null : w.id)}
                  >
                    <TableCell className="w-8">
                      {expandedWalletId === w.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{w.full_name ?? t('common.unknown')}</p>
                        <p className="text-xs text-muted-foreground">{w.email ?? w.user_id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatAdminWalletAmount(w.balance, w.currency)}</TableCell>
                    <TableCell className="text-green-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {formatAdminWalletAmount(w.total_earnings, w.currency)}
                      </span>
                    </TableCell>
                    <TableCell className="text-orange-600">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {formatAdminWalletAmount(w.total_withdrawn, w.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ADMIN_WALLET_STATUS_BADGE_CLASS[w.status]}`}>
                        {t(`walletStatus.${w.status}`)}
                      </span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAdjustDialog(w);
                            setAdjustForm({ type: 'credit', amount: '', purpose: '', description: '' });
                          }}
                        >
                          {t('actions.adjust')}
                        </Button>
                        <Select
                          value={w.status}
                          onValueChange={(v) => handleStatusChange(w.id, v as WalletStatus)}
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">{t('walletStatusActions.active')}</SelectItem>
                            <SelectItem value="suspended">{t('walletStatusActions.suspended')}</SelectItem>
                            <SelectItem value="closed">{t('walletStatusActions.closed')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedWalletId === w.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          {t('transactions.historyTitle')}
                        </p>
                        <WalletTransactions walletId={w.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            {t('pagination.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('pagination.page', { page: String(page) })}
          </span>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
            {t('pagination.next')}
          </Button>
        </div>
      )}

      {/* Adjust Balance Dialog */}
      <Dialog open={!!adjustDialog} onOpenChange={(o) => !o && setAdjustDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('adjustDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('adjustDialog.description', {
                name: adjustDialog?.full_name ?? adjustDialog?.email ?? '',
                balance: adjustDialog
                  ? formatAdminWalletAmount(adjustDialog.balance, adjustDialog.currency)
                  : '',
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('adjustDialog.typeLabel')}</Label>
              <Select
                value={adjustForm.type}
                onValueChange={(v) => setAdjustForm((f) => ({ ...f, type: v as WalletTxType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">{t('transactionTypeOption.credit')}</SelectItem>
                  <SelectItem value="debit">{t('transactionTypeOption.debit')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('adjustDialog.amountLabel')}</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder={t('adjustDialog.amountPlaceholder')}
                value={adjustForm.amount}
                onChange={(e) => setAdjustForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('adjustDialog.purposeLabel')}</Label>
              <Input
                placeholder={t('adjustDialog.purposePlaceholder')}
                value={adjustForm.purpose}
                onChange={(e) => setAdjustForm((f) => ({ ...f, purpose: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('adjustDialog.descriptionLabel')}</Label>
              <Input
                placeholder={t('adjustDialog.descriptionPlaceholder')}
                value={adjustForm.description}
                onChange={(e) => setAdjustForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialog(null)}>
              {t('adjustDialog.cancel')}
            </Button>
            <Button onClick={handleAdjust} disabled={isAdjusting}>
              {isAdjusting ? t('adjustDialog.submitting') : t('adjustDialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
