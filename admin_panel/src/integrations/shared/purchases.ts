import { withQuery } from '@/integrations/shared/api';

export const ILAN_PURCHASES_ADMIN_BASE = '/admin/ilan-purchases';

export interface IlanPurchaseAdminItem {
  id: string;
  ilan_id: string;
  buyer_id: string;
  seller_id: string;
  price_paid: string;
  pay_method: 'credit' | 'card' | string;
  credit_used: number;
  payment_ref?: string | null;
  estimated_value?: string | null;
  contact?: {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;
  status: string;
  created_at: string;
  from_city?: string | null;
  to_city?: string | null;
  title?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  seller_name?: string | null;
  seller_email?: string | null;
}

export interface IlanPurchaseAdminListResponse {
  data: IlanPurchaseAdminItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IlanPurchaseAdminListParams {
  page?: number;
}

export const buildIlanPurchasesAdminListUrl = (params: IlanPurchaseAdminListParams = {}) =>
  withQuery(ILAN_PURCHASES_ADMIN_BASE, {
    page: params.page && params.page > 1 ? params.page : undefined,
  });

export const formatIlanPurchaseMoney = (value?: string | number | null) =>
  value === undefined || value === null || value === '' ? '-' : `₺${Number(value).toLocaleString('tr-TR')}`;

export const formatIlanPurchaseDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString('tr-TR') : '-';
