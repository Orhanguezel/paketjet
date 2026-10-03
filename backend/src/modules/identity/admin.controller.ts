// src/modules/identity/admin.controller.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthUserId, handleRouteError, sendNotFound } from '@/modules/_shared';
import { repoGetIdentityDocuments, repoGetIdentitySide, repoListIdentityDocuments, repoReviewIdentityDocuments, type IdentitySide } from './repository';
import { sendIdentityImage, toIdentityDto } from './helpers';
import { identityAdminListSchema, identityReviewSchema } from './validation';

type UserParams = { userId: string; side?: string };

/** GET /admin/identity?status= */
export async function adminListIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { status } = identityAdminListSchema.parse(req.query ?? {});
    return reply.header('cache-control', 'no-store').send(await repoListIdentityDocuments(status));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_list');
  }
}

/** GET /admin/identity/:userId/:side — gorsel; her goruntuleme loglanir */
export async function adminGetIdentitySide(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId, side } = req.params as UserParams;
    if (side !== 'front' && side !== 'back') return sendNotFound(reply);
    req.log.info({ event: 'identity_side_viewed_by_admin', userId, side, adminId: getAuthUserId(req) }, 'identity_side_viewed_by_admin');
    return sendIdentityImage(reply, await repoGetIdentitySide(userId, side as IdentitySide));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_side_get');
  }
}

/** PATCH /admin/identity/:userId { status, reject_reason? } */
export async function adminReviewIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = req.params as UserParams;
    const input = identityReviewSchema.parse(req.body ?? {});
    const documents = await repoGetIdentityDocuments(userId);
    if (!documents.front && !documents.back) return sendNotFound(reply);
    if (!documents.front || !documents.back) return reply.code(409).send({ error: { message: 'identity_both_sides_required' } });
    const reviewed = await repoReviewIdentityDocuments(userId, getAuthUserId(req), input.status, input.reject_reason ?? null);
    if (!reviewed) return reply.code(409).send({ error: { message: 'identity_both_sides_required' } });
    req.log.info({ event: 'identity_documents_reviewed', userId, status: input.status }, 'identity_documents_reviewed');
    return reply.send(toIdentityDto(reviewed));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_identity_review');
  }
}
