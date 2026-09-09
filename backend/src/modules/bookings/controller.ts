import type {RouteHandler} from 'fastify';
import {getAuthUserId,handleRouteError,sendNotFound,sendForbidden} from '@/modules/_shared';
import {parseBookingsListParams} from './helpers';
import {repoGetBookingById,repoListBookings} from './repository';
export {retiredOperation as createBooking,retiredOperation as confirmBooking,retiredOperation as updateBookingStatus,retiredOperation as cancelBooking,retiredOperation as confirmDelivery,retiredOperation as getBankDetails} from '../purchases/legacy.controller';
export const listMyBookings: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const q = req.query as Record<string, string>;
    const params = parseBookingsListParams(q);
    const result = await repoListBookings({ userId, ...params });
    reply.header("x-total-count", String(result.total));
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "bookings_list_failed");
  }
};
export const getBooking: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const booking = await repoGetBookingById(id);
    if (!booking) return sendNotFound(reply);
    if (booking.customer_id !== userId && booking.carrier_id !== userId) return sendForbidden(reply);
    return reply.send(booking);
  } catch (e) {
    return handleRouteError(reply, req, e, "booking_get_failed");
  }
};
