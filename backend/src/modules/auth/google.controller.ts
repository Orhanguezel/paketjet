// src/modules/auth/google.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { hash as argonHash } from 'argon2';
import { handleRouteError } from '@/modules/_shared';
import { env } from '@/core/env';
import { getPrimaryRole } from '@/modules/userRoles';
import { googleBody } from './validation';
import {
  repoGetUserByEmail,
  repoCreateUser,
  repoGetUserById,
  repoAssignRole,
  repoEnsureProfileRow,
  repoUpdateLastSignIn,
} from './repository';
import {
  type Role,
  issueTokens,
  setAccessCookie,
  setRefreshCookie,
  parseAdminEmailAllowlist,
} from './helpers';

const adminEmails = parseAdminEmailAllowlist();

interface GoogleTokenInfo {
  aud?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  sub?: string;
}

/** POST /auth/google — Google Identity Services id_token ile giris/kayit (uye girisi) */
export async function googleAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = googleBody.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: { message: 'invalid_body' } });

    // id_token dogrula — Google tokeninfo (harici bagimlilik yok)
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(parsed.data.id_token)}`,
    );
    if (!res.ok) return reply.status(401).send({ error: { message: 'invalid_google_token' } });
    const info = (await res.json()) as GoogleTokenInfo;

    if (!info.email) return reply.status(401).send({ error: { message: 'invalid_token_payload' } });
    // Audience (client id) eslesmesi — yapilandirilmissa zorunlu
    if (env.GOOGLE.CLIENT_ID && info.aud !== env.GOOGLE.CLIENT_ID) {
      return reply.status(401).send({ error: { message: 'invalid_audience' } });
    }
    if (info.email_verified === 'false' || info.email_verified === false) {
      return reply.status(401).send({ error: { message: 'email_not_verified' } });
    }

    const email = info.email.toLowerCase();
    let u = await repoGetUserByEmail(email);
    let role: Role;

    if (!u) {
      // Yeni kullanici — kullanilamaz parola (yalnizca Google ile giris)
      const id = randomUUID();
      const password_hash = await argonHash(randomUUID() + randomUUID());
      await repoCreateUser({ id, email, password_hash, full_name: info.name, rules_accepted_at: new Date() });
      role = adminEmails.has(email) ? 'admin' : 'customer';
      await repoAssignRole(id, role);
      await repoEnsureProfileRow(id, { full_name: info.name ?? null, phone: null });
      u = await repoGetUserById(id);
    } else {
      role = await getPrimaryRole(u.id);
    }

    if (!u) return reply.status(500).send({ error: { message: 'user_create_failed' } });

    await repoUpdateLastSignIn(u.id);
    const { access, refresh } = await issueTokens(req.server, u, role);
    setAccessCookie(reply, access);
    setRefreshCookie(reply, refresh);

    return reply.send({
      access_token: access,
      token_type: 'bearer',
      user: { id: u.id, email, full_name: u.full_name ?? info.name ?? null, role },
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_google');
  }
}
