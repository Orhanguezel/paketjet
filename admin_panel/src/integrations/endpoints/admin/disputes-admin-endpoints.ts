import { baseApi } from '@/integrations/base-api';
import type { DisputeListResponse, DisputeItem } from '@/integrations/shared/disputes';
import { DISPUTES_ADMIN_BASE } from '@/integrations/shared/disputes';

export const disputesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listDisputes: build.query<DisputeListResponse, { status?: string; page?: number } | void>({
      query: (params) => ({
        url: DISPUTES_ADMIN_BASE,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: [{ type: 'Disputes' as const, id: 'LIST' }],
    }),

    resolveDispute: build.mutation<DisputeItem, { id: string; resolution: string; status?: 'resolved' | 'closed' }>({
      query: ({ id, ...body }) => ({
        url: `${DISPUTES_ADMIN_BASE}/${id}/resolve`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Disputes' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListDisputesQuery, useResolveDisputeMutation } = disputesAdminApi;
