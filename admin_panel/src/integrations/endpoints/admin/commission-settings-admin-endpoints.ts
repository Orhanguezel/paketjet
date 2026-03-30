// src/integrations/endpoints/admin/commission-settings-admin-endpoints.ts

import { baseApi } from '@/integrations/base-api';
import type {
  CommissionConfig,
  UpdateCommissionBody,
  PlanDto,
  CreatePlanBody,
  UpdatePlanBody,
} from '@/integrations/shared';
import { ADMIN_COMMISSION_BASE, ADMIN_PLANS_BASE } from '@/integrations/shared';

export const commissionSettingsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Komisyon ──────────────────────────────────────────────────────────
    getCommissionRate: build.query<CommissionConfig, void>({
      query: () => ({ url: ADMIN_COMMISSION_BASE, method: 'GET' }),
      providesTags: [{ type: 'SiteSettings' as const, id: 'commission' }],
    }),

    updateCommissionRate: build.mutation<CommissionConfig, UpdateCommissionBody>({
      query: (body) => ({ url: ADMIN_COMMISSION_BASE, method: 'PUT', body }),
      invalidatesTags: [{ type: 'SiteSettings' as const, id: 'commission' }],
    }),

    // ── Planlar ───────────────────────────────────────────────────────────
    listPlansAdmin: build.query<PlanDto[], void>({
      query: () => ({ url: ADMIN_PLANS_BASE, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Subscriptions' as const, id: p.id })),
              { type: 'Subscriptions' as const, id: 'LIST' },
            ]
          : [{ type: 'Subscriptions' as const, id: 'LIST' }],
    }),

    getPlanAdmin: build.query<PlanDto, { id: string }>({
      query: ({ id }) => ({ url: `${ADMIN_PLANS_BASE}/${id}`, method: 'GET' }),
      providesTags: (_r, _e, arg) => [{ type: 'Subscriptions' as const, id: arg.id }],
    }),

    createPlanAdmin: build.mutation<PlanDto, CreatePlanBody>({
      query: (body) => ({ url: ADMIN_PLANS_BASE, method: 'POST', body }),
      invalidatesTags: [{ type: 'Subscriptions' as const, id: 'LIST' }],
    }),

    updatePlanAdmin: build.mutation<PlanDto, UpdatePlanBody>({
      query: ({ id, ...patch }) => ({
        url: `${ADMIN_PLANS_BASE}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Subscriptions' as const, id: arg.id },
        { type: 'Subscriptions' as const, id: 'LIST' },
      ],
    }),

    deletePlanAdmin: build.mutation<{ ok: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `${ADMIN_PLANS_BASE}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Subscriptions' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommissionRateQuery,
  useUpdateCommissionRateMutation,
  useListPlansAdminQuery,
  useGetPlanAdminQuery,
  useCreatePlanAdminMutation,
  useUpdatePlanAdminMutation,
  useDeletePlanAdminMutation,
} = commissionSettingsAdminApi;
