// src/integrations/shared/carrier-agreements/carrier-agreements-ui.ts

import type { CarrierAgreementDto } from './carrier-agreements-types';

/** Taşıyıcı adını göster, yoksa fallback */
export function getAgreementCarrierName(
  a: Pick<CarrierAgreementDto, 'carrier_name'>,
  fallback = 'İsimsiz Taşıyıcı',
): string {
  return a.carrier_name?.trim() || fallback;
}

/** Komisyon oranını % formatında göster */
export function formatCommissionRate(rate: string | null): string {
  if (rate == null) return '—';
  const n = parseFloat(rate);
  return isNaN(n) ? '—' : `%${n}`;
}

/** Efektif komisyon oranını hesapla (agreement → plan → null) */
export function getEffectiveCommissionRate(
  a: Pick<CarrierAgreementDto, 'commission_rate' | 'plan_commission_rate'>,
): string | null {
  if (a.commission_rate != null) return a.commission_rate;
  if (a.plan_commission_rate != null) return a.plan_commission_rate;
  return null;
}

/** Sayfalama yardımcıları */
export function getAgreementsPreviousOffset(offset: number, limit: number): number {
  return Math.max(0, offset - limit);
}

export function getAgreementsNextOffset(offset: number, limit: number): number {
  return offset + limit;
}
