// src/integrations/shared/commission-settings/commission-settings-types.ts

export const ADMIN_COMMISSION_BASE = '/admin/bookings/commission';
export const ADMIN_PLANS_BASE = '/admin/subscription/plans';

// ── Komisyon ─────────────────────────────────────────────────────────────────

export interface CommissionConfig {
  rate: number;
  type: 'percentage';
}

export interface UpdateCommissionBody {
  rate: number;
}

// ── Plan ─────────────────────────────────────────────────────────────────────

export interface PlanDto {
  id: string;
  name: string;
  slug: string;
  price: string;
  ilan_limit: number;
  commission_rate: string | null;
  duration_days: number;
  features: string[];
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanBody {
  name: string;
  slug: string;
  price: number;
  ilan_limit: number;
  commission_rate?: number | null;
  duration_days: number;
  features: string[];
  sort_order: number;
  is_active: number;
}

export interface UpdatePlanBody {
  id: string;
  name?: string;
  slug?: string;
  price?: number;
  ilan_limit?: number;
  commission_rate?: number | null;
  duration_days?: number;
  features?: string[];
  sort_order?: number;
  is_active?: number;
}
