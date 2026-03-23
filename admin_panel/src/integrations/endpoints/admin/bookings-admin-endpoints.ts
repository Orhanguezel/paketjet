// =============================================================
// FILE: src/integrations/endpoints/admin/bookings-admin-endpoints.ts
// PaketJet — Admin booking management
// =============================================================
import { baseApi } from '@/integrations/base-api';
import type {
  BookingAdminItem,
  BookingAdminListParams,
  BookingAdminListResponse,
  UpdateBookingStatusAdminPayload,
} from '@/integrations/shared';

const bookingsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listBookingsAdmin: b.query<BookingAdminListResponse, BookingAdminListParams>({
      query: ({ status, page = 1, customer_id, carrier_id } = {}) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (page > 1) params.set('page', String(page));
        if (customer_id) params.set('customer_id', customer_id);
        if (carrier_id) params.set('carrier_id', carrier_id);
        const qs = params.toString();
        return `/admin/bookings${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Bookings' as const, id: 'LIST' }],
    }),

    updateBookingStatusAdmin: b.mutation<BookingAdminItem, UpdateBookingStatusAdminPayload>({
      query: ({ id, status, carrier_notes }) => ({
        url: `/admin/bookings/${id}/status`,
        method: 'PATCH',
        body: { status, carrier_notes },
      }),
      invalidatesTags: [{ type: 'Bookings' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListBookingsAdminQuery, useUpdateBookingStatusAdminMutation } = bookingsAdminApi;
