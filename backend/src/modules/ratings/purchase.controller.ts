import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getAuthUserId, handleRouteError } from '@/modules/_shared';
import { repoCreatePurchaseRating, repoGetEligiblePurchaseRatings, repoGetMemberPurchaseRatings } from './purchase.repository';

const idParam = z.object({ id: z.string().uuid() });
const ratingBody = z.object({ score: z.number().int().min(1).max(5), comment: z.string().trim().max(500).refine(value => !/(?:https?:\/\/|www\.|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?90|0)\s*5\d{2}[\s().-]*\d{3}[\s().-]*\d{2}[\s().-]*\d{2})/i.test(value), 'personal_contact_not_allowed').optional() }).strict();

export async function createPurchaseRating(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = idParam.parse(req.params);
    const { score, comment } = ratingBody.parse(req.body);
    const result = await repoCreatePurchaseRating(id, getAuthUserId(req), score, comment || null);
    if (!result.ok) return reply.code(result.code === 'not_found' ? 404 : result.code === 'forbidden' ? 403 : 409).send({ error: { message: result.code } });
    return reply.code(201).send(result);
  } catch (error) { return handleRouteError(reply, req, error, 'purchase_rating_create'); }
}

export async function getMemberPurchaseRatings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = idParam.parse(req.params);
    const result = await repoGetMemberPurchaseRatings(id);
    return result ? reply.header('Cache-Control', 'public, max-age=60').send(result) : reply.code(404).send({ error: { message: 'not_found' } });
  } catch (error) { return handleRouteError(reply, req, error, 'member_ratings'); }
}

export async function getEligiblePurchaseRatings(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.header('Cache-Control', 'private, no-store').send({ data: await repoGetEligiblePurchaseRatings(getAuthUserId(req)) }); }
  catch (error) { return handleRouteError(reply, req, error, 'eligible_ratings'); }
}
