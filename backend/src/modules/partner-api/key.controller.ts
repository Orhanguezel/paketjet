// src/modules/partner-api/key.controller.ts — panel: kendi API anahtarlarini yonet (normal oturum ile).
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthUserId, handleRouteError, sendNotFound } from '@/modules/_shared';
import { generateApiKey } from './keys';
import { repoCountActiveApiKeys, repoCreateApiKey, repoListApiKeys, repoRevokeApiKey } from './repository';
import { MAX_ACTIVE_KEYS, createKeySchema } from './validation';

export async function listMyApiKeys(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.header('cache-control', 'no-store').send({ data: await repoListApiKeys(getAuthUserId(req)), max_active: MAX_ACTIVE_KEYS }); }
  catch (e) { return handleRouteError(reply, req, e, 'api_keys_list'); }
}

/** Anahtarin tamami YALNIZ bu yanitta doner; sonra geri alinamaz. */
export async function createMyApiKey(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const { name } = createKeySchema.parse(req.body ?? {});
    if ((await repoCountActiveApiKeys(userId)) >= MAX_ACTIVE_KEYS) return reply.code(409).send({ error: { message: 'api_key_limit' } });
    const k = generateApiKey();
    const id = await repoCreateApiKey({ user_id: userId, name, prefix: k.prefix, key_hash: k.hash });
    req.log.info({ event: 'api_key_created', userId, apiKeyId: id }, 'api_key_created');
    return reply.code(201).header('cache-control', 'no-store').send({ id, name, prefix: k.prefix, key: k.key });
  } catch (e) { return handleRouteError(reply, req, e, 'api_key_create'); }
}

export async function revokeMyApiKey(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    if (!(await repoRevokeApiKey(userId, id))) return sendNotFound(reply);
    req.log.info({ event: 'api_key_revoked', userId, apiKeyId: id }, 'api_key_revoked');
    return reply.send({ ok: true });
  } catch (e) { return handleRouteError(reply, req, e, 'api_key_revoke'); }
}
