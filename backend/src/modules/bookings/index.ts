// src/modules/bookings/index.ts
// External module surface for bookings. Keep explicit; no export *.

export { registerBookings } from './router';
export { registerBookingsAdmin } from './admin.routes';

export {
  createBooking,
  listMyBookings,
  getBooking,
  confirmBooking,
  updateBookingStatus,
  cancelBooking,
} from './controller';

export {
  adminListBookings,
  adminGetBooking,
  adminUpdateBookingStatus,
} from './admin.controller';

export {
  repoGetBookingById,
  repoListBookings,
  repoCreateBooking,
  repoUpdateBookingStatus,
  repoUpdatePaymentStatus,
} from './repository';

export {
  mapBookingRow,
  buildCreateBookingInsert,
  buildBookingStatusPatch,
  parseBookingsListParams,
  createUpdateBookingStatusExtra,
} from './helpers';
export type { BookingStatusExtra } from './helpers';

export {
  repoAdminListBookings,
} from './admin.repository';

export {
  createBookingSchema,
  updateBookingStatusSchema,
  cancelBookingSchema,
} from './validation';

export {
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyBookingInTransit,
  notifyBookingDelivered,
  notifyBookingCancelled,
} from './notify';

export { bookings } from './schema';
export type { Booking, NewBooking } from './schema';
