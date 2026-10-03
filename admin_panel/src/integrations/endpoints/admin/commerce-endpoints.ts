import { baseApi } from '@/integrations/base-api';
import type { PaymentOperation,CreditAccount,CommerceSummary,CommercePage,CommerceFilters } from '@/integrations/shared';
const commerceApi=baseApi.injectEndpoints({endpoints:b=>({
 paymentAvailability:b.query<{provider:string|null;enabled:boolean;reason:string|null},void>({query:()=>'/payments/availability'}),
 listPaymentOperations:b.query<CommercePage<PaymentOperation>,CommerceFilters>({query:params=>({url:'/admin/payment-operations',params})}),
 paymentOperation:b.query<PaymentOperation,string>({query:ref=>`/admin/payment-operations/${encodeURIComponent(ref)}`}),
 addPaymentNote:b.mutation<{ok:boolean},{ref:string;note:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/notes`,method:'POST',body})}),
 approveBankTransfer:b.mutation<{ok:boolean},{ref:string;amount:number;transaction_id?:string;confirmed_on_statement:true}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/bank-approve`,method:'POST',body})}),
 rejectBankTransfer:b.mutation<{ok:boolean},{ref:string;reason:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/bank-reject`,method:'POST',body})}),
 refundPayment:b.mutation<{ok:boolean;state:string;refundId:string},{ref:string;note:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/refund`,method:'POST',body})}),
 syncPaymentRefund:b.mutation<{state:string|null},string>({query:ref=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/refund/sync`,method:'POST',body:{}})}),
 creditAccounts:b.query<CommercePage<CreditAccount>,CommerceFilters>({query:params=>({url:'/admin/credits',params})}),
 adjustCredits:b.mutation<{ok:boolean;balance:number},{id:string;user_id:string;delta:number;reason:string}>({query:body=>({url:'/admin/credits/adjust',method:'POST',body})}),
 commerceSummary:b.query<CommerceSummary,void>({query:()=>'/admin/commerce-summary'}),
})});
export const {usePaymentAvailabilityQuery,useListPaymentOperationsQuery,usePaymentOperationQuery,useAddPaymentNoteMutation,useApproveBankTransferMutation,useRejectBankTransferMutation,useRefundPaymentMutation,useSyncPaymentRefundMutation,useCreditAccountsQuery,useAdjustCreditsMutation,useCommerceSummaryQuery}=commerceApi;
