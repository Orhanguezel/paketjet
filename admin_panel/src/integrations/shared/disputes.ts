// src/integrations/shared/disputes.ts

export const DISPUTES_ADMIN_BASE = '/admin/disputes';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface DisputeItem {
  id: string;
  booking_id: string | null;
  ilan_id: string | null;
  purchase_id: string | null;
  opened_by: string;
  opened_against: string | null;
  issue_type: string;
  declared_value: string | null;
  declared_value_currency: string;
  reason: string;
  status: DisputeStatus;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  opener_name: string | null;
  opener_email: string | null;
  from_city: string | null;
  to_city: string | null;
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

export const DISPUTE_ISSUE_LABEL: Record<string, string> = {
  damage: 'Hasar',
  loss: 'Kayıp',
  forbidden_content: 'Yasaklı içerik',
  payment: 'Ödeme',
  other: 'Diğer',
};
