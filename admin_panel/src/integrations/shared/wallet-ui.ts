import type { WalletStatus, WalletTxStatus } from '@/integrations/shared/wallet-types';
import type { WalletTxType } from '@/integrations/shared/wallet-types';

export type WalletTransactionsProps = {
  walletId: string;
};

export const ADMIN_WALLET_LIST_PAGE_SIZE = 20;
export const ADMIN_WALLET_TRANSACTIONS_PAGE_SIZE = 20;

export function formatAdminWalletAmount(amount: string, currency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(
    parseFloat(amount) || 0,
  );
}

export function formatAdminWalletDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ADMIN_WALLET_STATUS_BADGE_CLASS: Record<WalletStatus, string> = {
  active: 'bg-success-muted text-success',
  suspended: 'bg-warning-muted text-warning',
  closed: 'bg-danger-muted text-danger',
};

export const ADMIN_WALLET_TX_STATUS_BADGE_CLASS: Record<WalletTxStatus, string> = {
  pending: 'bg-warning-muted text-warning',
  completed: 'bg-success-muted text-success',
  failed: 'bg-danger-muted text-danger',
  refunded: 'bg-info-muted text-primary',
};

export const ADMIN_WALLET_TX_TYPE_BADGE_CLASS: Record<WalletTxType, string> = {
  credit: 'bg-success-muted text-success',
  debit: 'bg-danger-muted text-danger',
};

export const ADMIN_WALLET_TX_AMOUNT_CLASS: Record<WalletTxType, string> = {
  credit: 'text-success',
  debit: 'text-danger',
};

export function getAdminWalletSignedAmountPrefix(type: WalletTxType) {
  return type === 'credit' ? '+' : '-';
}
