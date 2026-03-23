// =============================================================
// FILE: src/modules/bookings/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminListBookings, adminGetBooking, adminUpdateBookingStatus, adminConfirmTransferPayment, adminGetCommissionRate, adminSetCommissionRate } from './admin.controller';
const B = '/bookings';

export async function registerBookingsAdmin(app: FastifyInstance) {
  app.get(`${B}`, adminListBookings);
  app.get(`${B}/commission`, adminGetCommissionRate);
  app.put(`${B}/commission`, adminSetCommissionRate);
  app.get(`${B}/:id`, adminGetBooking);
  app.patch(`${B}/:id/status`, adminUpdateBookingStatus);
  app.patch(`${B}/:id/confirm-payment`, adminConfirmTransferPayment);
}
