import { baseApi } from '@/integrations/base-api';
import type { PaymentOperation,CreditAccount,CommerceSummary,CommercePage,CommerceFilters,ShopierStatus,ShopierTest } from '@/integrations/shared';
const commerceApi=baseApi.injectEndpoints({endpoints:b=>({
 paymentAvailability:b.query<{provider:string|null;enabled:boolean;reason:string|null},void>({query:()=>'/payments/availability'}),
 listPaymentOperations:b.query<CommercePage<PaymentOperation>,CommerceFilters>({query:params=>({url:'/admin/payment-operations',params})}),
 paymentOperation:b.query<PaymentOperation,string>({query:ref=>`/admin/payment-operations/${encodeURIComponent(ref)}`}),
 addPaymentNote:b.mutation<{ok:boolean},{ref:string;note:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/notes`,method:'POST',body})}),
 approveBankTransfer:b.mutation<{ok:boolean},{ref:string;amount:number;transaction_id?:string;confirmed_on_statement:true}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/bank-approve`,method:'POST',body})}),
 rejectBankTransfer:b.mutation<{ok:boolean},{ref:string;reason:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/bank-reject`,method:'POST',body})}),
 shopierStatus:b.query<ShopierStatus,void>({query:()=>'/admin/payment-settings/shopier',providesTags:['PaymentSettings']}),
 updateShopierSettings:b.mutation<ShopierStatus,{card_enabled?:boolean;product_image_url?:string|null;pat?:string|null}>({query:body=>({url:'/admin/payment-settings/shopier',method:'PUT',body}),invalidatesTags:['PaymentSettings']}),
 testShopierConnection:b.mutation<ShopierTest,void>({query:()=>({url:'/admin/payment-settings/shopier/test',method:'POST',body:{}})}),
 rebuildShopierWebhooks:b.mutation<ShopierStatus,void>({query:()=>({url:'/admin/payment-settings/shopier/webhooks',method:'POST',body:{}}),invalidatesTags:['PaymentSettings']}),
 refundPayment:b.mutation<{ok:boolean;state:string;refundId:string},{ref:string;note:string}>({query:({ref,...body})=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/refund`,method:'POST',body})}),
 syncPaymentRefund:b.mutation<{state:string|null},string>({query:ref=>({url:`/admin/payment-operations/${encodeURIComponent(ref)}/refund/sync`,method:'POST',body:{}})}),
 creditAccounts:b.query<CommercePage<CreditAccount>,CommerceFilters>({query:params=>({url:'/admin/credits',params})}),
 adjustCredits:b.mutation<{ok:boolean;balance:number},{id:string;user_id:string;delta:number;reason:string}>({query:body=>({url:'/admin/credits/adjust',method:'POST',body})}),
 commerceSummary:b.query<CommerceSummary,void>({query:()=>'/admin/commerce-summary'}),
})});
export const {usePaymentAvailabilityQuery,useListPaymentOperationsQuery,usePaymentOperationQuery,useAddPaymentNoteMutation,useApproveBankTransferMutation,useRejectBankTransferMutation,useRefundPaymentMutation,useSyncPaymentRefundMutation,useShopierStatusQuery,useUpdateShopierSettingsMutation,useTestShopierConnectionMutation,useRebuildShopierWebhooksMutation,useCreditAccountsQuery,useAdjustCreditsMutation,useCommerceSummaryQuery}=commerceApi;
