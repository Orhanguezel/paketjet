export type PaymentStatus = {payment_ref: string; kind: 'listing' | 'credits' | 'legacy_wallet' | 'legacy_booking'; provider?: string; ilan_id: string | null; amount: string; state: 'initializing' | 'pending' | 'completed' | 'failed' | 'review' | 'refund_pending' | 'refunded'; error_code: string | null; expires_at?: string};
export type PaymentAvailability = {provider: 'iyzico' | 'paytr' | null; enabled: boolean; reason: string | null};
export type BankDetails = {iban:string;account_name:string;bank_name:string;description:string};
export type BankAvailability = {enabled:boolean;mode:'test'|'real'|null;provider:'bank_test'|'bank_transfer'|null;bank_details:BankDetails|null};
export type BankOrder = {provider:'bank_test'|'bank_transfer';mode:'test'|'real';conversationId:string;amount:number;bank_details:BankDetails|null;transfer_description:string};
export type BankOrderStatus = {provider:'bank_test'|'bank_transfer';mode:'test'|'real';amount:string;state:string;expires_at:string;bank_details:BankDetails|null;transfer_description:string};
