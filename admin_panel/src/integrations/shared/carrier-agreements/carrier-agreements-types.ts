// src/integrations/shared/carrier-agreements/carrier-agreements-types.ts

export const ADMIN_CARRIER_AGREEMENTS_BASE = '/admin/carrier-agreements';

export type AgreementType = 'commission' | 'subscription';
export type AgreementStatus = 'active' | 'suspended' | 'expired';

export const AGREEMENT_TYPES: AgreementType[] = ['commission', 'subscription'];
export const AGREEMENT_STATUSES: AgreementStatus[] = ['active', 'suspended', 'expired'];

export const ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT = 20;

// ── DTO (backend yanıtı) ────────────────────────────────────────────────────

export type CarrierAgreementDto = {
  id: string;
  user_id: string;
  agreement_type: AgreementType;
  commission_rate: string | null;
  plan_id: string | null;
  status: AgreementStatus;
  starts_at: string;
  expires_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at?: string;
  carrier_name: string | null;
  carrier_email: string | null;
  plan_name: string | null;
  plan_commission_rate: string | null;
};

export type CarrierAgreementListResponse = {
  items: CarrierAgreementDto[];
  total: number;
};

// ── Query params ─────────────────────────────────────────────────────────────

export type CarrierAgreementListParams = {
  status?: AgreementStatus;
  type?: AgreementType;
  limit?: number;
  offset?: number;
};

// ── Mutation bodies ──────────────────────────────────────────────────────────

export type CreateCarrierAgreementBody = {
  user_id: string;
  agreement_type: AgreementType;
  commission_rate?: number;
  plan_id?: string;
  admin_note?: string;
};

export type UpdateCarrierAgreementBody = {
  id: string;
  agreement_type?: AgreementType;
  commission_rate?: number | null;
  plan_id?: string | null;
  status?: AgreementStatus;
  admin_note?: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function buildCarrierAgreementListParams(
  params?: CarrierAgreementListParams,
): URLSearchParams {
  const sp = new URLSearchParams();
  if (!params) return sp;
  if (params.status) sp.set('status', params.status);
  if (params.type) sp.set('type', params.type);
  sp.set('limit', String(params.limit ?? ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT));
  if (params.offset) sp.set('offset', String(params.offset));
  return sp;
}

export function pickCarrierAgreementListQuery(
  sp: URLSearchParams,
): CarrierAgreementListParams {
  return {
    status: (sp.get('status') as AgreementStatus) || undefined,
    type: (sp.get('type') as AgreementType) || undefined,
    limit: sp.get('limit') ? Number(sp.get('limit')) : ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT,
    offset: sp.get('offset') ? Number(sp.get('offset')) : 0,
  };
}

export function toCarrierAgreementSearchParams(
  params: CarrierAgreementListParams,
): string {
  const sp = buildCarrierAgreementListParams(params);
  return sp.toString();
}
