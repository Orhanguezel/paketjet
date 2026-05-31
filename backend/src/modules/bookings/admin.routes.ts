// =============================================================
// FILE: src/modules/bookings/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminListBookings, adminGetBooking, adminUpdateBookingStatus, adminConfirmTransferPayment } from './admin.controller';
const B = '/bookings';

export async function registerBookingsAdmin(app: FastifyInstance) {
  app.get(`${B}`, adminListBookings);
  app.get(`${B}/:id`, adminGetBooking);
  app.patch(`${B}/:id/status`, adminUpdateBookingStatus);
  app.patch(`${B}/:id/confirm-payment`, adminConfirmTransferPayment);
}
