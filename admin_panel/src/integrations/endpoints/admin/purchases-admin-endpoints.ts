import { baseApi } from '@/integrations/base-api';
import type { IlanPurchaseAdminListParams, IlanPurchaseAdminListResponse } from '@/integrations/shared';
import { buildIlanPurchasesAdminListUrl } from '@/integrations/shared';

const purchasesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listIlanPurchasesAdmin: b.query<IlanPurchaseAdminListResponse, IlanPurchaseAdminListParams>({
      query: (params) => buildIlanPurchasesAdminListUrl(params),
      providesTags: [{ type: 'IlanPurchases' as const, id: 'LIST' }],
    }),
    grantPurchaseCreditRemedy: b.mutation<{ok:boolean;already_processed:boolean},{id:string;reason:string;verified:true}>({
      query: ({id,...body}) => ({url:`/admin/ilan-purchases/${encodeURIComponent(id)}/credit-remedy`,method:'POST',body}),
      invalidatesTags: [{ type: 'IlanPurchases' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListIlanPurchasesAdminQuery, useGrantPurchaseCreditRemedyMutation } = purchasesAdminApi;
