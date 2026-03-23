import { baseApi } from '@/integrations/base-api';
import type {
  CarrierDetail,
  CarrierDetailDto,
  CarrierListQueryParams,
  CarrierListResponse,
  CarrierListResponseDto,
} from '@/integrations/shared';
import {
  CARRIERS_ADMIN_BASE,
  normalizeCarrierDetail,
  normalizeCarrierListResponse,
} from '@/integrations/shared';

export const carriersAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCarriersAdmin: build.query<CarrierListResponse, CarrierListQueryParams | void>({
      query: (params?: CarrierListQueryParams) => ({
        url: CARRIERS_ADMIN_BASE,
        method: 'GET',
        params,
      }),
      transformResponse: (response: CarrierListResponseDto) =>
        normalizeCarrierListResponse(response),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((item) => ({ type: 'Carrier' as const, id: item.id })),
              { type: 'Carriers' as const, id: 'LIST' },
            ]
          : [{ type: 'Carriers' as const, id: 'LIST' }],
    }),
    getCarrierAdmin: build.query<CarrierDetail, { id: string }>({
      query: ({ id }) => ({
        url: `${CARRIERS_ADMIN_BASE}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: CarrierDetailDto) => normalizeCarrierDetail(response),
      providesTags: (_result, _error, arg) => [{ type: 'Carrier' as const, id: arg.id }],
    }),
  }),
  overrideExisting: false,
});

export const { useListCarriersAdminQuery, useGetCarrierAdminQuery } = carriersAdminApi;
