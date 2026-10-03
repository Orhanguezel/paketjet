import { shopierConfigured } from './shopier';
export type PaymentProvider = 'shopier';
/** Kart odemesi yalniz Shopier. PAYMENT_PROVIDER=shopier VE Shopier yapilandirmasi tam degilse kapali. */
export function paymentAvailability() {
  const provider: PaymentProvider | null = process.env.PAYMENT_PROVIDER === 'shopier' ? 'shopier' : null;
  const enabled = provider === 'shopier' && shopierConfigured();
  return { provider, enabled, reason: enabled ? null : 'payments_unavailable' };
}
export function requirePaymentProvider(requested?: string): PaymentProvider {
  const policy = paymentAvailability();
  if (!policy.enabled || !policy.provider || (requested && requested !== policy.provider)) {
    throw Object.assign(new Error('payments_unavailable'), { statusCode: 503 });
  }
  return policy.provider;
}
