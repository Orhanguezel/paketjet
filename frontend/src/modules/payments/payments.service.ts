import { API } from '@/config/api-endpoints';
import { apiGet, apiPost } from '@/lib/api-client';
import type { PaymentStatus, PaymentAvailability, BankAvailability, BankOrderStatus } from './payments.type';
export const getPaymentStatus = (ref: string) => apiGet<PaymentStatus>(API.payments.status(ref), {cache: 'no-store'});
export const getPaymentAvailability = () => apiGet<PaymentAvailability>(API.payments.availability, {cache: 'no-store'});
export const getBankAvailability = () => apiGet<BankAvailability>(API.payments.bankAvailability, {cache: 'no-store'});
export const getBankOrder = (ref:string) => apiGet<BankOrderStatus>(API.payments.bankOrder(ref), {cache:'no-store'});
export const reportBankTransfer = (ref:string) => apiPost<{ok:boolean;state:string}>(API.payments.bankReport(ref), {});
