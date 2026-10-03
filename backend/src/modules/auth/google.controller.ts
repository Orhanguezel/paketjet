// src/modules/auth/google.controller.ts
// Google ile giris/kayit (Google Identity Services id_token). Kaynak yaklasim: GZLTemizlik shared-backend.
//
// - id_token google-auth-library ile imza + audience dogrulanir; client id yoksa uc KAPALI (fail-closed).
// - Client id tek kaynaktan: getGoogleSettings (site_settings > env). /auth/google-config ayni yerden okur.
// - email_verified === true sart: eslesme e-posta uzerinden, dogrulanmamis adres baskasinin hesabina giremez.
// - Yeni kullanici, normal kayittaki gibi Kullanim Kosullari + KVKK onayini vermeden hesap acamaz.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { hash as argonHash } from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { handleRouteError } from '@/modules/_shared';
import { getGoogleSettings } from '@/modules/siteSettings';
import { getPrimaryRole } from '@/modules/userRoles';
import { sendWelcomeMail } from '@/modules/mail';
import { telegramNotify } from '@/modules/telegram';
import { googleBody } from './validation';
import { getSignupLegalConsentVersions } from './legal-consent';
import { repoGetUserByEmail, repoCreateUser, repoGetUserById, repoAssignRole, repoEnsureProfileRow, repoUpdateLastSignIn } from './repository';
import { type Role, issueTokens, setAccessCookie, setRefreshCookie } from './helpers';

const clients = new Map<string, OAuth2Client>();
const clientFor = (id: string) => {
  let c = clients.get(id);
  if (!c) clients.set(id, (c = new OAuth2Client(id)));
  return c;
};

async function googleClientId() {
  return (await getGoogleSettings()).clientId?.trim() || '';
}

/** GET /auth/google-config — dugme yalniz dogrulayicinin kullanacagi client id ile cizilir. */
export async function googleConfig(req: FastifyRequest, reply: FastifyReply) {
  try {
    const clientId = await googleClientId();
    return reply.header('cache-control', 'no-store').send({ configured: Boolean(clientId), clientId: clientId || null });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_google_config');
  }
}

/** POST /auth/google */
export async function googleAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = googleBody.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: { message: 'invalid_body' } });
    const clientId = await googleClientId();
    if (!clientId) return reply.status(503).send({ error: { message: 'google_oauth_not_configured' } });

    let payload;
    try {
      payload = (await clientFor(clientId).verifyIdToken({ idToken: parsed.data.id_token, audience: clientId })).getPayload();
    } catch {
      return reply.status(401).send({ error: { message: 'invalid_google_token' } });
    }
    const email = payload?.email?.trim().toLowerCase();
    if (!email) return reply.status(401).send({ error: { message: 'google_email_missing' } });
    if (payload?.email_verified !== true) return reply.status(403).send({ error: { message: 'email_not_verified' } });
    const name = payload?.name?.trim() || null;

    let u = await repoGetUserByEmail(email);
    let role: Role;
    if (!u) {
      const { rules_accepted, kvkk_explicit_consent } = parsed.data;
      if (rules_accepted !== true || kvkk_explicit_consent !== true) {
        // Hesap acilmadi; on yuz onay adimini gosterip ayni id_token ile tekrar gonderir.
        return reply.status(409).send({ error: { message: 'consent_required' }, profile: { email, name } });
      }
      const consent = await getSignupLegalConsentVersions();
      const now = new Date();
      const id = randomUUID();
      await repoCreateUser({
        id,
        email,
        password_hash: await argonHash(randomUUID() + randomUUID()), // kullanilamaz parola: yalniz Google ile giris / sifre sifirlama
        full_name: name ?? undefined,
        email_verified: 1,
        rules_accepted_at: now,
        rules_accepted_version: consent.rules_accepted_version,
        kvkk_explicit_consent: 1,
        kvkk_consent_at: now,
        kvkk_consent_version: consent.kvkk_consent_version,
      });
      role = parsed.data.role === 'carrier' ? 'carrier' : 'customer';
      await repoAssignRole(id, role);
      await repoEnsureProfileRow(id, { full_name: name, phone: null });
      void sendWelcomeMail({ to: email, user_name: name || email.split('@')[0], user_email: email }).catch((err) => req.log.error({ err, event: 'welcome_mail_failed' }, 'welcome_mail_failed'));
      void telegramNotify({ event: 'new_user', data: { user_name: name || email.split('@')[0], user_email: email, role, created_at: now.toISOString(), provider: 'google' } });
      req.log.info({ event: 'google_signup', userId: id, role }, 'google_signup');
      u = await repoGetUserById(id);
    } else {
      role = await getPrimaryRole(u.id);
    }
    if (!u) return reply.status(500).send({ error: { message: 'user_create_failed' } });
    if (!u.is_active) return reply.status(403).send({ error: { message: 'account_disabled' } });

    await repoUpdateLastSignIn(u.id);
    const { access, refresh } = await issueTokens(req.server, u, role);
    setAccessCookie(reply, access);
    setRefreshCookie(reply, refresh);
    return reply.send({ access_token: access, token_type: 'bearer', user: { id: u.id, email, full_name: u.full_name ?? name, role } });
  } catch (e) {
    return handleRouteError(reply, req, e, 'auth_google');
  }
}
