import type { FastifyReply, FastifyRequest } from 'fastify';
import { emitAppEvent } from '@/common/events/bus';
import geoip from 'geoip-lite';
import { env } from '@/core/env';
import {
  repoInsertRequestLog,
  repoDeleteOldRequestLogs,
  repoDeleteOldAuthEvents,
  repoDeleteOldAuditEvents,
} from './repository';
import {type HeaderCarrier,type RequestWithUrl,type RequestUserRecord,type SanitizableRecord,SENSITIVE_FIELDS,MAX_BODY_SIZE} from './service.shared';
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function firstHeader(req: FastifyRequest, name: string): string {
  const v = (req as HeaderCarrier).headers?.[name.toLowerCase()];
  if (Array.isArray(v)) return String(v[0] ?? '').trim();
  return String(v ?? '').trim();
}
export function parseFirstIpFromXff(xff: string): string {
  return (
    xff
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)[0] || ''
  );
}
export function shouldSkipAuditLog(req: FastifyRequest): boolean {
  const method = String(req.method || '').toUpperCase();
  if (method === 'OPTIONS') return true;

  const rawUrl = String((req as RequestWithUrl).raw?.url ?? (req as RequestWithUrl).url ?? '');
  const path = (rawUrl.split('?')[0] || '/').trim();

  if (path === '/api/health' || path === '/health') return true;
  if (path.startsWith('/uploads/')) return true;
  if (path.startsWith('/api/admin/audit/stream')) return true;

  const excludeIps = Array.isArray((env as { AUDIT_EXCLUDE_IPS?: unknown }).AUDIT_EXCLUDE_IPS)
    ? ((env as { AUDIT_EXCLUDE_IPS?: unknown[] }).AUDIT_EXCLUDE_IPS ?? [])
    : [];
  if (excludeIps.length > 0) {
    const ip = normalizeClientIp(req);
    if (ip && excludeIps.includes(ip)) return true;
  }

  return false;
}
export function normalizeClientIp(req: FastifyRequest): string {
  const cf = firstHeader(req, 'cf-connecting-ip');
  if (cf) return cf;

  const xReal = firstHeader(req, 'x-real-ip');
  if (xReal) return xReal;

  const xff = firstHeader(req, 'x-forwarded-for');
  if (xff) {
    const ip = parseFirstIpFromXff(xff);
    if (ip) return ip;
  }

  const socket = req.socket as { remoteAddress?: string | null };
  return String(req.ip || socket?.remoteAddress || '').trim();
}
export function normalizeUrlAndPath(req: FastifyRequest): { url: string; path: string } {
  const rawUrl = String((req as RequestWithUrl).raw?.url ?? (req as RequestWithUrl).url ?? '').trim() || '/';
  const path = rawUrl.split('?')[0] || '/';
  return { url: rawUrl, path };
}
export function normalizeUserContext(req: FastifyRequest): { userId: string | null; isAdmin: number } {
  const request = req as RequestWithUrl & { user?: unknown };
  const userCandidate =
    request.user ??
    request.auth?.user ??
    request.requestContext?.get?.('user') ??
    null;

  const u: RequestUserRecord | null = isRecord(userCandidate) ? userCandidate : null;

  const userId = u?.id ? String(u.id) : null;

  let isAdmin = 0;
  if (u) {
    if (u.is_admin === true || u.is_admin === 1 || u.is_admin === '1') isAdmin = 1;
    const role = String(u.role ?? '');
    if (role === 'admin') isAdmin = 1;
    const roles = Array.isArray(u.roles) ? u.roles.map(String) : [];
    if (roles.includes('admin')) isAdmin = 1;
  }

  return { userId, isAdmin };
}
export function normalizeUserAgent(req: FastifyRequest): string | null {
  const ua = firstHeader(req, 'user-agent');
  return ua ? ua : null;
}
export function normalizeReferer(req: FastifyRequest): string | null {
  const ref = firstHeader(req, 'referer');
  return ref ? ref : null;
}
export function normalizeGeo(req: FastifyRequest, ip: string): { country: string | null; city: string | null } {
  const cfCountry = firstHeader(req, 'cf-ipcountry') || null;
  const cfCity = firstHeader(req, 'x-geo-city') || null;
  if (cfCountry) return { country: cfCountry, city: cfCity };

  const isLocal =
    !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

  if (!isLocal) {
    const geo = geoip.lookup(ip);
    if (geo) {
      return { country: geo.country || null, city: geo.city || null };
    }
  }

  if (isLocal) return { country: 'LOCAL', city: null };

  return { country: null, city: null };
}
export function stripSensitive(obj: SanitizableRecord): void {
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      obj[key] = '[REDACTED]';
    } else if (isRecord(obj[key])) {
      stripSensitive(obj[key]);
    }
  }
}
export function sanitizeRequestBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;

  try {
    const cloned = JSON.parse(JSON.stringify(body));
    if (typeof cloned === 'object' && cloned !== null) {
      stripSensitive(cloned);
    }
    const json = JSON.stringify(cloned);
    if (json.length > MAX_BODY_SIZE) {
      return json.slice(0, MAX_BODY_SIZE) + '...[TRUNCATED]';
    }
    return json;
  } catch {
    return null;
  }
}