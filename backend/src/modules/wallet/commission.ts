// src/modules/wallet/commission.ts
// Platform commission is disabled in the lead/contact-rights model.

export interface CommissionConfig {
  rate: number;
  type: "percentage";
}

const DEFAULT_CONFIG: CommissionConfig = { rate: 0, type: "percentage" };

/** Platform geneli varsayılan komisyon oranını getir (site_settings) */
export async function getPlatformCommissionRate(): Promise<CommissionConfig> {
  return DEFAULT_CONFIG;
}

/**
 * Taşıyıcıya özel efektif komisyon oranını getir
 * Commission is disabled; keep this API as a compatibility no-op.
 */
export async function getCommissionRateForCarrier(_carrierId: string): Promise<CommissionConfig> {
  return DEFAULT_CONFIG;
}

/** Eski API — geriye uyumluluk (platform default döner) */
export async function getCommissionRate(): Promise<CommissionConfig> {
  return DEFAULT_CONFIG;
}

export function calculateCarrierPayout(totalPrice: number, _rate: number) {
  const carrierPayout = Math.round(totalPrice * 100) / 100;
  return { carrierPayout, commissionAmount: 0 };
}
