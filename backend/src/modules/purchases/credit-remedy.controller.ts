import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getAuthUserId, handleRouteError, repoInvalidateDashboardCache } from '@/modules/_shared';
import { repoGrantPurchaseCreditRemedy } from './credit-remedy.repository';

export async function adminGrantPurchaseCreditRemedy(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const { reason } = z.object({ reason: z.string().trim().min(10).max(500), verified: z.literal(true) }).strict().parse(req.body);
    const result = await repoGrantPurchaseCreditRemedy(id, getAuthUserId(req), reason);
    if (!result.ok) return reply.code(result.code === 'not_found' ? 404 : 409).send({ error: { message: result.code } });
    if (!result.already_processed) await repoInvalidateDashboardCache([result.user_id]);
    return reply.send(result);
  } catch (error) { return handleRouteError(reply, req, error, 'purchase_credit_remedy'); }
}
