export interface PaymentOperation {
 payment_ref:string; user_id:string; ilan_id?:string|null; kind:string; provider:string; amount:string; state:string; error_code:string|null; provider_payment_id:string|null; created_at:string; updated_at:string;
 events?:Array<{id:string;actor_id:string;event:string;note:string|null;created_at:string}>;
}
export interface CreditAccount {user_id:string;email:string;balance:number;}
export interface CommerceSummary {active_listings:number;moderation:number;contact_sales:number;listing_receipts:string;package_receipts:string;credit_spends:number;payment_queue:number;}
export interface CommercePage<T> {data:T[];total:number;page:number;limit:number;}
export interface CommerceFilters {page:number;search?:string;state?:string;}
export const paymentStateLabels:Record<string,string>={initializing:'Başlatılıyor',pending:'Bildirim bekleniyor',completed:'Tamamlandı',failed:'Başarısız',review:'İncelemede',refund_pending:'İade bekliyor',refunded:'İade edildi'};
