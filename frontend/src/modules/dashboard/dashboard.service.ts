import { apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";

export interface CarrierDashboard {
  active_ilanlar: number;
  total_bookings: number;
  pending_bookings: number;
  pending_earnings: number;
  pending_earnings_count: number;
  balance: string;
  total_earnings: string;
}

export interface CustomerDashboard {
  active_bookings: number;
  total_bookings: number;
  balance: string;
}

export const getCarrierDashboard = () =>
  apiGet<CarrierDashboard>(API.dashboard.carrier);

export const getCustomerDashboard = () =>
  apiGet<CustomerDashboard>(API.dashboard.customer);
