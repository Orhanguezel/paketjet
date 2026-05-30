import { API } from "@/config/api-endpoints";
import { apiGet } from "@/lib/api-client";
import type { CreditPackage, PricingSetting } from "./pricing.type";

export async function getListingCreditPrice() {
  const setting = await apiGet<PricingSetting<number | string>>(API.siteSettings.byKey("pricing.listing_credit_price"));
  return Number(setting.value);
}

export async function getCreditPackages() {
  try {
    const response = await apiGet<{ data: CreditPackage[] }>(API.purchases.creditPackages);
    return response.data;
  } catch {
    const setting = await apiGet<PricingSetting<CreditPackage[]>>(API.siteSettings.byKey("pricing.credit_packages"));
    return Array.isArray(setting.value) ? setting.value : [];
  }
}
