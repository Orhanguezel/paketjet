import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError } from '@/modules/_shared';
import { repoCheckHealth } from './repository';

export async function getHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await repoCheckHealth(req.server);
    return reply.code(result.status === "ok" ? 200 : 503).send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'health_check_failed');
  }
}
