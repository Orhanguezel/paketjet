import { baseApi } from '@/integrations/base-api';
import { IDENTITY_ADMIN_BASE, type IdentityListItem, type IdentityStatus } from '@/integrations/shared';

export const identityAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listIdentityDocuments: build.query<IdentityListItem[], { status?: IdentityStatus } | void>({
      query: (params) => ({ url: IDENTITY_ADMIN_BASE, method: 'GET', params: params ?? {} }),
      providesTags: [{ type: 'Identity' as const, id: 'LIST' }],
    }),
    reviewIdentityDocument: build.mutation<unknown, { userId: string; status: 'approved' | 'rejected'; reject_reason?: string }>({
      query: ({ userId, ...body }) => ({ url: `${IDENTITY_ADMIN_BASE}/${userId}`, method: 'PATCH', body }),
      invalidatesTags: [{ type: 'Identity' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListIdentityDocumentsQuery, useReviewIdentityDocumentMutation } = identityAdminApi;
