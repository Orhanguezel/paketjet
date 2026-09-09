import { API } from '@/config/api-endpoints';
import { apiGet } from '@/lib/api-client';
import type { PaymentStatus, PaymentAvailability } from './payments.type';
export const getPaymentStatus = (ref: string) => apiGet<PaymentStatus>(API.payments.status(ref), {cache: 'no-store'});
export const getPaymentAvailability = () => apiGet<PaymentAvailability>(API.payments.availability, {cache: 'no-store'});
