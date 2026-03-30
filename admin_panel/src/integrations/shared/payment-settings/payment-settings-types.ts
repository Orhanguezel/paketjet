// src/integrations/shared/payment-settings/payment-settings-types.ts

/** iyzico ayarları — site_settings integration.iyzico.* key'leri */
export interface IyzicoSettings {
  enabled: boolean;
  api_key: string;
  secret_key: string;
  base_url: string;
  test_mode: boolean;
}

/** PayTR ayarları — site_settings integration.paytr.* key'leri */
export interface PayTRSettings {
  enabled: boolean;
  merchant_id: string;
  merchant_key: string;
  merchant_salt: string;
  test_mode: boolean;
}

/** Banka / Havale bilgileri — site_settings bank_details key'i */
export interface BankDetails {
  iban: string;
  account_name: string;
  bank_name: string;
  description: string;
}

export const IYZICO_SETTINGS_KEYS = [
  'integration.iyzico.enabled',
  'integration.iyzico.api_key',
  'integration.iyzico.secret_key',
  'integration.iyzico.base_url',
] as const;

export const PAYTR_SETTINGS_KEYS = [
  'integration.paytr.enabled',
  'integration.paytr.merchant_id',
  'integration.paytr.merchant_key',
  'integration.paytr.merchant_salt',
] as const;

export const IYZICO_SANDBOX_URL = 'https://sandbox-api.iyzipay.com';
export const IYZICO_PRODUCTION_URL = 'https://api.iyzipay.com';

export function defaultIyzicoSettings(): IyzicoSettings {
  return { enabled: false, api_key: '', secret_key: '', base_url: IYZICO_SANDBOX_URL, test_mode: true };
}

export function defaultPayTRSettings(): PayTRSettings {
  return { enabled: false, merchant_id: '', merchant_key: '', merchant_salt: '', test_mode: true };
}

export function defaultBankDetails(): BankDetails {
  return { iban: '', account_name: '', bank_name: '', description: '' };
}
