// src/modules/wallet/commission.ts
// Platform komisyon hesaplama servisi
// Öncelik: carrier agreement → plan → platform default (site_settings)

import { repoGetFirstRowByFallback } from "@/modules/siteSettings/repository";
import { repoGetCarrierCommissionRate } from "@/modules/carrier-agreements/repository";

export interface CommissionConfig {
  rate: number;
  type: "percentage";
}

const DEFAULT_CONFIG: CommissionConfig = { rate: 0, type: "percentage" };

/** Platform geneli varsayılan komisyon oranını getir (site_settings) */
export async function getPlatformCommissionRate(): Promise<CommissionConfig> {
  const row = await repoGetFirstRowByFallback("platform_commission", ["*", "tr"]);
  if (!row) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(row.value) as CommissionConfig;
    if (typeof parsed.rate !== "number" || parsed.rate < 0 || parsed.rate > 100) return DEFAULT_CONFIG;
    return { rate: parsed.rate, type: "percentage" };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * Taşıyıcıya özel efektif komisyon oranını getir
 * Fallback zinciri: carrier_agreement.commission_rate → plan.commission_rate → platform default
 */
export async function getCommissionRateForCarrier(carrierId: string): Promise<CommissionConfig> {
  const carrierRate = await repoGetCarrierCommissionRate(carrierId);
  if (carrierRate != null) return { rate: carrierRate, type: "percentage" };
  return getPlatformCommissionRate();
}

/** Eski API — geriye uyumluluk (platform default döner) */
export async function getCommissionRate(): Promise<CommissionConfig> {
  return getPlatformCommissionRate();
}

export function calculateCarrierPayout(totalPrice: number, rate: number) {
  const commissionAmount = Math.round(totalPrice * (rate / 100) * 100) / 100;
  const carrierPayout = Math.round((totalPrice - commissionAmount) * 100) / 100;
  return { carrierPayout, commissionAmount };
}
