export interface PaymentOperation {
 payment_ref:string; user_id:string; ilan_id?:string|null; kind:string; provider:string; amount:string; state:string; error_code:string|null; provider_payment_id:string|null; receipt?:{paymentId?:string;refundId?:string}|null; created_at:string; updated_at:string;
 events?:Array<{id:string;actor_id:string;event:string;note:string|null;created_at:string}>;
}
export interface CreditAccount {user_id:string;email:string;balance:number;}
export interface CommerceSummary {active_listings:number;moderation:number;contact_sales:number;listing_receipts:string;package_receipts:string;credit_spends:number;payment_queue:number;}
export interface CommercePage<T> {data:T[];total:number;page:number;limit:number;}
export interface CommerceFilters {page:number;search?:string;state?:string;}
export const paymentStateLabels:Record<string,string>={initializing:'Başlatılıyor',pending:'Bildirim bekleniyor',completed:'Tamamlandı',failed:'Başarısız',review:'İncelemede',refund_pending:'İade bekliyor',refunded:'İade edildi'};
export type ShopierSource='panel'|'server'|null;
export interface ShopierStatus{card_enabled:boolean;card_enabled_source:'panel'|'server';configured:boolean;available:boolean;pat:{set:boolean;last4?:string;expires_at?:string|null;scopes?:string[];source:ShopierSource};webhook:{count:number;expected:number;source:ShopierSource;url:string};product_image:{url:string|null;source:ShopierSource};updated_at:string|null}
export type ShopierTest={ok:true;shop_name:string;shop_url:string;webhooks:{event:string;url:string;ours:boolean}[];missing_events:string[];signing_ready:boolean}|{ok:false;error:string};
