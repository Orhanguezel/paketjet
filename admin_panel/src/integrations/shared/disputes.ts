// src/integrations/shared/disputes.ts

export const DISPUTES_ADMIN_BASE = '/admin/disputes';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface DisputeItem {
  id: string;
  booking_id: string;
  opened_by: string;
  reason: string;
  status: DisputeStatus;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  opener_name: string | null;
  opener_email: string | null;
}

export interface DisputeListResponse {
  data: DisputeItem[];
  total: number;
  page: number;
  limit: number;
}

export const DISPUTE_STATUS_LABEL: Record<DisputeStatus, string> = {
  open: 'Açık',
  under_review: 'İnceleniyor',
  resolved: 'Çözüldü',
  closed: 'Kapatıldı',
};
