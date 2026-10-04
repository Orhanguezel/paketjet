// src/modules/partner-api/auth.ts
// Yalniz /api/v1/partner uclarinda kullanilir. Normal oturum (JWT) uclari API anahtarini KABUL ETMEZ;
// anahtar admin yetkisi tasimaz.
import type { FastifyReply, FastifyRequest } from 'fastify';
import { repoGetUserById } from '@/modules/auth';
import { getPrimaryRole } from '@/modules/userRoles';
import { hashApiKey, readApiKey } from './keys';
import { repoFindApiKeyByHash, repoTouchApiKey } from './repository';

const TOUCH_EVERY_MS = 60_000;
const touched = new Map<string, number>();

export async function requireApiKey(req: FastifyRequest, reply: FastifyReply) {
  const key = readApiKey(req.headers);
  if (!key) return reply.code(401).send({ error: { code: 'api_key_missing', message: 'Authorization: Bearer <API anahtari> gerekli.' } });
  const row = await repoFindApiKeyByHash(hashApiKey(key));
  if (!row || row.revoked_at) return reply.code(401).send({ error: { code: 'api_key_invalid', message: 'API anahtari gecersiz veya iptal edilmis.' } });
  const user = await repoGetUserById(row.user_id);
  if (!user || !user.is_active) return reply.code(403).send({ error: { code: 'account_disabled', message: 'Hesap kullanima kapali.' } });
  const role = await getPrimaryRole(user.id);
  (req as FastifyRequest & { user: unknown }).user = { sub: user.id, role: role === 'admin' ? 'customer' : role, roles: [role === 'admin' ? 'customer' : role], is_admin: false, via: 'api_key', api_key_id: row.id };
  const last = touched.get(row.id) ?? 0;
  if (Date.now() - last > TOUCH_EVERY_MS) {
    touched.set(row.id, Date.now());
    void repoTouchApiKey(row.id, req.ip).catch(() => undefined);
  }
}

/** Hiz siniri anahtar basina: onRequest asamasinda calisir, ozet uzerinden. */
export const apiKeyRateKey = (req: FastifyRequest) => {
  const key = readApiKey(req.headers);
  return key ? `pk:${hashApiKey(key).slice(0, 32)}` : `ip:${req.ip}`;
};
