// src/modules/identity/admin.controller.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthUserId, handleRouteError, sendNotFound } from '@/modules/_shared';
import { repoGetIdentityFront, repoListIdentityDocuments, repoReviewIdentityFront } from './repository';
import { sendIdentityImage, toIdentityDto } from './helpers';
import { identityAdminListSchema, identityReviewSchema } from './validation';

type UserParams = { userId: string };

/** GET /admin/identity?status= */
export async function adminListIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { status } = identityAdminListSchema.parse(req.query ?? {});
    return reply.header('cache-control', 'no-store').send(await repoListIdentityDocuments(status));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_list');
  }
}

/** GET /admin/identity/:userId/front — gorsel; her goruntuleme loglanir */
export async function adminGetIdentityFront(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = req.params as UserParams;
    req.log.info({ event: 'identity_front_viewed_by_admin', userId, adminId: getAuthUserId(req) }, 'identity_front_viewed_by_admin');
    return sendIdentityImage(reply, await repoGetIdentityFront(userId));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_front_get');
  }
}

/** PATCH /admin/identity/:userId { status, reject_reason? } */
export async function adminReviewIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = req.params as UserParams;
    const input = identityReviewSchema.parse(req.body ?? {});
    if (!(await repoGetIdentityFront(userId))) return sendNotFound(reply);
    const row = await repoReviewIdentityFront(userId, getAuthUserId(req), input.status, input.reject_reason ?? null);
    req.log.info({ event: 'identity_front_reviewed', userId, status: input.status }, 'identity_front_reviewed');
    return reply.send(toIdentityDto(row));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_review');
  }
}
