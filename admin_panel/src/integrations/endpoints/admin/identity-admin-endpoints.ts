import { baseApi } from '@/integrations/base-api';
import { BASE_URL } from '@/integrations/api-base';
import { tokenStore } from '@/integrations/core/token';

export const IDENTITY_ADMIN_BASE = '/admin/identity';

export type IdentityStatus = 'pending' | 'approved' | 'rejected';

export interface IdentityListItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  status: IdentityStatus;
  reject_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

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

/** Kimlik gorseli yetkili endpoint'ten blob olarak alinir; URL kullanimdan sonra revoke edilmelidir. */
export async function fetchIdentityFrontUrl(userId: string): Promise<string> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE_URL.replace(/\/$/, '')}${IDENTITY_ADMIN_BASE}/${encodeURIComponent(userId)}/front`, {
    credentials: 'include',
    cache: 'no-store',
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('identity_image_failed');
  return URL.createObjectURL(await res.blob());
}
