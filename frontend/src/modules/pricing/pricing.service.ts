import {API} from '@/config/api-endpoints';
import {apiGet} from '@/lib/api-client';
import type {CreditPackage,PricingSetting} from './pricing.type';
export async function getListingCreditPrice(){
 const row=await apiGet<PricingSetting<number|string>>(API.siteSettings.byKey('pricing.listing_credit_price'));
 const price=Number(row.value);
 if(!Number.isFinite(price)||price<=0)throw new Error('Fiyat şu anda kullanılamıyor.');
 return price;
}
export async function getCreditPackages(){
 const response=await apiGet<{data:CreditPackage[]}>(API.purchases.creditPackages);
 return response.data;
}
