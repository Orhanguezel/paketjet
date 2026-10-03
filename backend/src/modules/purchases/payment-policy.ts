import { getShopierConfig } from './shopier-config';
export type PaymentProvider = 'shopier';
/** Kart odemesi yalniz Shopier. Admin panelindeki ac/kapa (yoksa PAYMENT_PROVIDER) VE tam yapilandirma gerekir. */
export async function paymentAvailability() {
  const config = await getShopierConfig();
  const provider: PaymentProvider | null = config.cardEnabled ? 'shopier' : null;
  const enabled = provider === 'shopier' && config.configured;
  return { provider, enabled, reason: enabled ? null : 'payments_unavailable' };
}
export async function requirePaymentProvider(requested?: string): Promise<PaymentProvider> {
  const policy = await paymentAvailability();
  if (!policy.enabled || !policy.provider || (requested && requested !== policy.provider)) {
    throw Object.assign(new Error('payments_unavailable'), { statusCode: 503 });
  }
  return policy.provider;
}
