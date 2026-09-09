import { env } from '@/core/env';
export type PaymentProvider = 'iyzico' | 'paytr';
export function paymentAvailability() {
  const selected = process.env.PAYMENT_PROVIDER;
  const provider: PaymentProvider | null = selected === 'iyzico' || selected === 'paytr' ? selected : null;
  const configured = provider === 'iyzico' ? Boolean(env.IYZICO_API_KEY && env.IYZICO_SECRET_KEY) : provider === 'paytr' ? Boolean(env.PAYTR_MERCHANT_ID && env.PAYTR_MERCHANT_KEY && env.PAYTR_MERCHANT_SALT) : false;
  const sandbox = provider === 'iyzico' ? env.IYZICO_TEST_MODE || env.IYZICO_BASE_URL.includes('sandbox') : env.PAYTR_TEST_MODE;
  const enabled = configured && (env.NODE_ENV !== 'production' || !sandbox);
  return { provider, enabled, reason: enabled ? null : 'payments_unavailable' };
}
export function requirePaymentProvider(requested?: string): PaymentProvider {
  const policy = paymentAvailability();
  if (!policy.enabled || !policy.provider || (requested && requested !== policy.provider)) {
    throw Object.assign(new Error('payments_unavailable'), { statusCode: 503 });
  }
  return policy.provider;
}
