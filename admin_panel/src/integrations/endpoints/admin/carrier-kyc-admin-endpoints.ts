import { baseApi } from '@/integrations/base-api';
import type {
  KycDocumentListResponse,
  KycListParams,
  CarrierKycDetail,
  ReviewDocumentPayload,
} from '@/integrations/shared/carrier-kyc';
import { KYC_ADMIN_BASE } from '@/integrations/shared/carrier-kyc';

export const carrierKycAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listKycDocuments: build.query<KycDocumentListResponse, KycListParams | void>({
      query: (params?: KycListParams) => ({
        url: KYC_ADMIN_BASE,
        method: 'GET',
        params: params ?? { status: 'pending' },
      }),
      providesTags: [{ type: 'CarrierKyc' as const, id: 'LIST' }],
    }),

    getCarrierKyc: build.query<CarrierKycDetail, string>({
      query: (carrierId) => ({
        url: `${KYC_ADMIN_BASE}/carrier/${carrierId}`,
        method: 'GET',
      }),
      providesTags: (_result, _err, id) => [{ type: 'CarrierKyc' as const, id }],
    }),

    reviewKycDocument: build.mutation<unknown, ReviewDocumentPayload>({
      query: ({ id, ...body }) => ({
        url: `${KYC_ADMIN_BASE}/${id}/review`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'CarrierKyc' as const, id: 'LIST' }],
    }),

    createSubMerchant: build.mutation<{ sub_merchant_key: string; type: string }, string>({
      query: (carrierId) => ({
        url: `${KYC_ADMIN_BASE}/carrier/${carrierId}/create-sub-merchant`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _err, id) => [{ type: 'CarrierKyc' as const, id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListKycDocumentsQuery,
  useGetCarrierKycQuery,
  useReviewKycDocumentMutation,
  useCreateSubMerchantMutation,
} = carrierKycAdminApi;
