import { baseApi } from '@/integrations/base-api';
import type { IlanPurchaseAdminListParams, IlanPurchaseAdminListResponse } from '@/integrations/shared';
import { buildIlanPurchasesAdminListUrl } from '@/integrations/shared';

const purchasesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listIlanPurchasesAdmin: b.query<IlanPurchaseAdminListResponse, IlanPurchaseAdminListParams>({
      query: (params) => buildIlanPurchasesAdminListUrl(params),
      providesTags: [{ type: 'IlanPurchases' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListIlanPurchasesAdminQuery } = purchasesAdminApi;
