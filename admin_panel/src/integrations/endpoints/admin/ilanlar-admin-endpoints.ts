// =============================================================
// FILE: src/integrations/endpoints/admin/ilanlar-admin-endpoints.ts
// PaketJet — Admin ilan management
// =============================================================
import { baseApi } from '@/integrations/base-api';
import type {
  IlanAdminItem,
  IlanAdminListParams,
  IlanAdminListResponse,
  UpdateIlanStatusAdminPayload,
} from '@/integrations/shared';
import { buildIlanlarAdminListUrl, ILANLAR_ADMIN_BASE } from '@/integrations/shared';

const ilanlarAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listIlanlarAdmin: b.query<IlanAdminListResponse, IlanAdminListParams>({
      query: (params) => buildIlanlarAdminListUrl(params),
      providesTags: [{ type: 'Ilanlar' as const, id: 'LIST' }],
    }),

    updateIlanStatusAdmin: b.mutation<IlanAdminItem, UpdateIlanStatusAdminPayload>({
      query: ({ id, status }) => ({
        url: `${ILANLAR_ADMIN_BASE}/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Ilanlar' as const, id: 'LIST' }],
    }),

    deleteIlanAdmin: b.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `${ILANLAR_ADMIN_BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Ilanlar' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListIlanlarAdminQuery,
  useUpdateIlanStatusAdminMutation,
  useDeleteIlanAdminMutation,
} = ilanlarAdminApi;
