import type { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";
import "@fastify/cookie";
import { repoGetUserById } from "@/modules/auth/repository";
import { getPrimaryRole } from "@/modules/userRoles";
import { setSentryUserContext } from "@/plugins/sentry";

/** JWT payload'ın bizde aradığımız minimum alanları */
export interface JwtUser {
  sub?: string;
  email?: string;
  role?: string;
  roles?: string[];
  is_admin?: boolean;
  [k: string]: unknown;
}

function authError(message: string): Error {
  const err = new Error(message);
  (err as Error & { statusCode: number }).statusCode = 401;
  return err;
}

/**
 * Cookie-first + Header fallback
 * - Cookies: access_token | accessToken
 * - Header: Authorization: Bearer <token>
 * Doğrulama başarılıysa req.user'ı set eder.
 */
async function validateAccess(req: FastifyRequest, token: string) {
  const payload = await req.server.jwt.verify<JwtUser>(token);
  if (typeof payload.sub !== "string" || (payload.purpose && payload.purpose !== "access")) throw authError("invalid_token");
  const user = await repoGetUserById(payload.sub);
  if (!user?.is_active || (payload.v ?? 0) !== user.auth_version) throw authError("invalid_token");
  const role = await getPrimaryRole(user.id);
  req.user = { ...payload, role, roles: [role], is_admin: role === "admin" };
  setSentryUserContext(user.id);
}

export async function requireAuth(req: FastifyRequest, _reply: FastifyReply) {
  _reply.header("Cache-Control", "private, no-store");
  const cookies = req.cookies ?? {};
  const cookieToken = cookies.access_token ?? cookies.accessToken;
  if (cookieToken) {
    try { await validateAccess(req, cookieToken); return; } catch { /* Try explicit bearer credentials. */ }
  }
  const auth = req.headers.authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    try { await validateAccess(req, auth.slice(7)); return; } catch { throw authError("invalid_token"); }
  }
  throw authError(cookieToken ? "invalid_token" : "no_token");
}
