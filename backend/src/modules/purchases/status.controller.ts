import { repoListingAccess } from "./access.repository";
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthUserId, handleRouteError } from '../_shared';
import { paymentAvailability } from './payment-policy';
import { repoMyPayment } from './session.repository';
export async function getPaymentAvailability(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.header('Cache-Control', 'no-store').send(paymentAvailability()); }
  catch (error) { return handleRouteError(reply, req, error, 'payment_availability'); }
}
export async function getPaymentStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {ref} = req.params as {ref: string};
    const row = await repoMyPayment(ref, getAuthUserId(req));
    reply.header('Cache-Control', 'private, no-store');
    return row ? reply.send(row) : reply.code(404).send({error: {message: 'payment_not_found'}});
  } catch (error) { return handleRouteError(reply, req, error, 'payment_status'); }
}

export async function getListingAccess(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {id} = req.params as {id: string};
    const access = await repoListingAccess(id, getAuthUserId(req));
    return access ? reply.header("Cache-Control", "private, no-store").send(access) : reply.code(404).send({error:{message:"not_found"}});
  } catch (error) { return handleRouteError(reply, req, error, "listing_access"); }
}
