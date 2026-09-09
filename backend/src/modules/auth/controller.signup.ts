import { requireAuth } from '@/common/middleware/auth';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { hash as argonHash } from 'argon2';
import { handleRouteError } from "@/modules/_shared";
import { getPrimaryRole } from '@/modules/userRoles';
import { sendWelcomeMail, sendPasswordChangedMail } from '@/modules/mail';
import { telegramNotify } from '@/modules/telegram';
import {
  signupBody,
  tokenBody,
  updateBody,
  passwordResetRequestBody,
  passwordResetConfirmBody,
} from './validation';
import {
  repoGetUserByEmail,
  repoGetUserById,
  repoCreateUser,
  repoUpdateUserEmail,
  repoUpdateUserPassword,
  repoUpdateLastSignIn,
  repoAssignRole,
  repoEnsureProfileRow,
  repoGetRefreshToken,
  repoRevokeRefreshToken,
  repoRevokeAllUserRefreshTokens,
  repoRotateRefreshToken,
  repoCreatePasswordChangedNotification,
} from './repository';
import {
  type Role,
  type JWTPayload,
  getJWTFromReq,
  bearerFrom,
  setAccessCookie,
  setRefreshCookie,
  clearAuthCookies,
  issueTokens,
  verifyPasswordSmart,
  parseAdminEmailAllowlist,
  ACCESS_MAX_AGE,
} from './helpers';
import { getSignupLegalConsentVersions } from './legal-consent';
import {update} from './controller.update';
export async function signup(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = signupBody.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: { message: 'invalid_body' } });

    const { email, password } = parsed.data;
    const meta = (parsed.data.options?.data ?? {}) as Record<string, unknown>;
    const full_name = (parsed.data.full_name ?? (typeof meta['full_name'] === 'string' ? meta['full_name'] : undefined)) || undefined;
    const phone = (parsed.data.phone ?? (typeof meta['phone'] === 'string' ? meta['phone'] : undefined)) || undefined;
    const requestedRole = meta['role'] === 'carrier' ? 'carrier' : 'customer';
    const rulesAccepted = parsed.data.rules_accepted === true;
    const kvkkConsentAt = parsed.data.kvkk_explicit_consent === true ? new Date() : undefined;
    const consentVersions = await getSignupLegalConsentVersions();

    const exists = await repoGetUserByEmail(email);
    if (exists) return reply.status(409).send({ error: { message: 'user_exists' } });

    const id = randomUUID();
    const password_hash = await argonHash(password);
    await repoCreateUser({
      id,
      email,
      password_hash,
      full_name,
      phone,
      rules_accepted_at: rulesAccepted ? new Date() : undefined,
      rules_accepted_version: consentVersions.rules_accepted_version,
      kvkk_explicit_consent: kvkkConsentAt ? 1 : 0,
      kvkk_consent_at: kvkkConsentAt,
      kvkk_consent_version: consentVersions.kvkk_consent_version,
    });

    const assignedRole: Role = requestedRole;
    await repoAssignRole(id, assignedRole);
    await repoEnsureProfileRow(id, { full_name: full_name ?? null, phone: phone ?? null });

    void sendWelcomeMail({ to: email, user_name: full_name || email.split('@')[0], user_email: email }).catch((err) => req.log?.error?.(err, 'welcome_mail_failed'));
    void telegramNotify({ event: 'new_user', data: { user_name: full_name || email.split('@')[0], user_email: email, role: assignedRole, created_at: new Date().toISOString() } });

    const u = await repoGetUserById(id);
    const { access, refresh } = await issueTokens(req.server, u!, assignedRole);
    setAccessCookie(reply, access);
    setRefreshCookie(reply, refresh);

    return reply.send({
      access_token: access,
      token_type: 'bearer',
      user: { id, email, full_name: full_name ?? null, phone: phone ?? null, email_verified: 0, is_active: 1, role: assignedRole },
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_signup');
  }
}
export async function token(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = tokenBody.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: { message: 'invalid_body' } });

    const u = await repoGetUserByEmail(parsed.data.email);
    if (!u || !u.is_active || !(await verifyPasswordSmart(u.password_hash, parsed.data.password))) {
      return reply.status(401).send({ error: { message: 'invalid_credentials' } });
    }

    await repoUpdateLastSignIn(u.id);
    await repoEnsureProfileRow(u.id);
    const role = await getPrimaryRole(u.id);
    const { access, refresh } = await issueTokens(req.server, u, role);
    setAccessCookie(reply, access);
    setRefreshCookie(reply, refresh);

    return reply.send({
      access_token: access,
      token_type: 'bearer',
      user: { id: u.id, email: u.email, full_name: u.full_name ?? null, phone: u.phone ?? null, email_verified: u.email_verified, is_active: u.is_active, role },
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_token');
  }
}
export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  try {
    const jwt = getJWTFromReq(req);
    const raw = ((req.cookies as Record<string, string | undefined> | undefined)?.refresh_token ?? '').trim();
    if (!raw.includes('.')) return reply.status(401).send({ error: { message: 'no_refresh' } });

    const jti = raw.split('.', 1)[0] ?? '';
    const row = await repoGetRefreshToken(jti);
    if (!row) return reply.status(401).send({ error: { message: 'invalid_refresh' } });
    if (row.revoked_at) return reply.status(401).send({ error: { message: 'refresh_revoked' } });
    if (new Date(row.expires_at).getTime() < Date.now()) return reply.status(401).send({ error: { message: 'refresh_expired' } });

    const { createHash } = await import('crypto');
    const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
    if (row.token_hash !== sha256(raw)) return reply.status(401).send({ error: { message: 'invalid_refresh' } });

    const u = await repoGetUserById(row.user_id);
    if (!u || !u.is_active) return reply.status(401).send({ error: { message: 'invalid_user' } });

    const role = await getPrimaryRole(u.id);
    const access = jwt.sign({ sub: u.id, email: u.email ?? undefined, role, v: u.auth_version }, { expiresIn: `${ACCESS_MAX_AGE}s` });
    const newRaw = await repoRotateRefreshToken(raw, u.id);
    setAccessCookie(reply, access);
    setRefreshCookie(reply, newRaw);

    return reply.send({ access_token: access, token_type: 'bearer' });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_refresh');
  }
}
export async function me(req: FastifyRequest, reply: FastifyReply) {
  try {
    const p = req.user as {sub:string};
    const user = await repoGetUserById(p.sub);
    if(!user)return reply.code(401).send({error:{message:'invalid_user'}});
    const role = await getPrimaryRole(user.id);
    return reply.send({user:{id:user.id,email:user.email,role,full_name:user.full_name,phone:user.phone,email_verified:user.email_verified,is_active:user.is_active}});
  } catch (error) {
    return handleRouteError(reply, req, error, "auth_request_failed");
  }
}
export async function status(req: FastifyRequest, reply: FastifyReply) {
  try {
    await requireAuth(req, reply);
    const p = req.user as {sub:string;email?:string};
    const role = await getPrimaryRole(p.sub);
    return reply.send({ authenticated: true, is_admin: role === 'admin', user: { id: p.sub, email: p.email ?? null, role } });
  } catch (error) {
    if ((error as {statusCode?:number}).statusCode === 401) return reply.send({ authenticated: false, is_admin: false });
    return handleRouteError(reply, req, error, "auth_request_failed");
  }
}