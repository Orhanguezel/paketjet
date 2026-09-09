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
import {status} from './controller.signup';
export async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const p = req.user as JWTPayload;

    const parsed = updateBody.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: { message: 'invalid_body' } });

    const { email, password, current_password } = parsed.data as { email?: string; password?: string; current_password?: string };

    if (email) { await repoUpdateUserEmail(p.sub, email); p.email = email; }
    if (password) {
      if (!current_password) return reply.status(400).send({ error: { message: 'current_password_required' } });
      const u = await repoGetUserById(p.sub);
      if (!u || !u.is_active || !(await verifyPasswordSmart(u.password_hash, current_password))) {
        return reply.status(400).send({ error: { message: 'current_password_wrong' } });
      }
      await repoUpdateUserPassword(p.sub, password);
      await repoRevokeAllUserRefreshTokens(p.sub);
      clearAuthCookies(reply);
      try { await repoCreatePasswordChangedNotification(p.sub); } catch (err) { req.log.error({ err }, 'password_change_notification_failed'); }
      const targetEmail = email ?? p.email;
      if (targetEmail) {
        void sendPasswordChangedMail({ to: targetEmail, user_name: targetEmail.split('@')[0] }).catch((err) => req.log.error({ err }, 'password_change_mail_failed'));
      }
    }

    const role = await getPrimaryRole(p.sub);
    return reply.send({ user: { id: p.sub, email: p.email ?? null, role } });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_update');
  }
}
export async function logout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const raw = ((reply.request?.cookies as Record<string, string | undefined> | undefined)?.refresh_token ?? '').trim();
    if (raw.includes('.')) {
      const jti = raw.split('.', 1)[0] ?? '';
      await repoRevokeRefreshToken(jti);
    }
    clearAuthCookies(reply);
    return reply.status(204).send();
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_logout');
  }
}