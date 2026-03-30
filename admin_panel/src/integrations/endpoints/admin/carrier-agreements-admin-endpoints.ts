// src/integrations/endpoints/admin/carrier-agreements-admin-endpoints.ts

import { baseApi } from '@/integrations/base-api';
import type {
  CarrierAgreementDto,
  CarrierAgreementListResponse,
  CarrierAgreementListParams,
  CreateCarrierAgreementBody,
  UpdateCarrierAgreementBody,
} from '@/integrations/shared';
import {
  ADMIN_CARRIER_AGREEMENTS_BASE,
  buildCarrierAgreementListParams,
} from '@/integrations/shared';

export const carrierAgreementsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCarrierAgreementsAdmin: build.query<
      CarrierAgreementListResponse,
      CarrierAgreementListParams | void
    >({
      query: (params?: CarrierAgreementListParams) => {
        const qs = buildCarrierAgreementListParams(params ?? undefined).toString();
        return {
          url: qs ? `${ADMIN_CARRIER_AGREEMENTS_BASE}?${qs}` : ADMIN_CARRIER_AGREEMENTS_BASE,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => ({
                type: 'CarrierAgreement' as const,
                id: a.id,
              })),
              { type: 'CarrierAgreement' as const, id: 'LIST' },
            ]
          : [{ type: 'CarrierAgreement' as const, id: 'LIST' }],
    }),

    getCarrierAgreementAdmin: build.query<CarrierAgreementDto, { id: string }>({
      query: ({ id }) => ({
        url: `${ADMIN_CARRIER_AGREEMENTS_BASE}/${id}`,
        method: 'GET',
      }),
      providesTags: (_r, _e, arg) => [{ type: 'CarrierAgreement' as const, id: arg.id }],
    }),

    createCarrierAgreementAdmin: build.mutation<CarrierAgreementDto, CreateCarrierAgreementBody>({
      query: (body) => ({
        url: ADMIN_CARRIER_AGREEMENTS_BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'CarrierAgreement' as const, id: 'LIST' }],
    }),

    updateCarrierAgreementAdmin: build.mutation<CarrierAgreementDto, UpdateCarrierAgreementBody>({
      query: ({ id, ...patch }) => ({
        url: `${ADMIN_CARRIER_AGREEMENTS_BASE}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'CarrierAgreement' as const, id: arg.id },
        { type: 'CarrierAgreement' as const, id: 'LIST' },
      ],
    }),

    deleteCarrierAgreementAdmin: build.mutation<{ ok: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `${ADMIN_CARRIER_AGREEMENTS_BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'CarrierAgreement' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCarrierAgreementsAdminQuery,
  useGetCarrierAgreementAdminQuery,
  useCreateCarrierAgreementAdminMutation,
  useUpdateCarrierAgreementAdminMutation,
  useDeleteCarrierAgreementAdminMutation,
} = carrierAgreementsAdminApi;
