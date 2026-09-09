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
import {normalizeClientIp,normalizeUrlAndPath,normalizeUserContext,normalizeUserAgent,normalizeReferer,normalizeGeo,sanitizeRequestBody} from './service.is-record';
import {type RequestWithUrl,type ReplyWithStatus} from './service.shared';
export async function writeRequestAuditLog(args: {
  req: FastifyRequest;
  reply: FastifyReply;
  reqId: string;
  responseTimeMs: number;
}) {
  const { req, reply } = args;

  const { url, path } = normalizeUrlAndPath(req);
  const ip = normalizeClientIp(req);
  const { userId, isAdmin } = normalizeUserContext(req);

  const statusCode =
    typeof reply.statusCode === 'number'
      ? reply.statusCode
      : Number((reply as ReplyWithStatus).raw?.statusCode ?? 0);

  const ua = normalizeUserAgent(req);
  const referer = normalizeReferer(req);
  const geo = normalizeGeo(req, ip);
  const method = String(req.method || '').toUpperCase();

  const auditError = (req as RequestWithUrl).auditError;

  let errorMessage: string | null = null;
  let errorCode: string | null = null;

  if (statusCode >= 400 && auditError) {
    errorMessage = auditError.message ? String(auditError.message).slice(0, 512) : null;
    errorCode = auditError.code ? String(auditError.code).slice(0, 64) : null;
  }

  let requestBody: string | null = null;
  const logBody = process.env.LOG_REQUEST_BODY === 'true';

  if (logBody && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    requestBody = sanitizeRequestBody(req.body);
  }

  await repoInsertRequestLog({
    req_id: String(args.reqId || ''),
    method,
    url,
    path,
    status_code: Number(statusCode || 0),
    response_time_ms: Math.max(0, Math.round(Number(args.responseTimeMs || 0))),
    ip,
    user_agent: ua,
    referer,
    user_id: userId,
    is_admin: isAdmin,
    country: geo.country,
    city: geo.city,
    error_message: errorMessage,
    error_code: errorCode,
    request_body: requestBody,
  });

  emitAppEvent({
    level: Number(statusCode) >= 500 ? 'error' : Number(statusCode) >= 400 ? 'warn' : 'info',
    topic: 'audit.request.logged',
    message: 'request_logged',
    meta: {
      method,
      path,
      status_code: Number(statusCode || 0),
      ip,
      response_time_ms: Math.max(0, Math.round(Number(args.responseTimeMs || 0))),
      user_id: userId,
      is_admin: isAdmin,
      error_message: errorMessage,
      error_code: errorCode,
    },
    entity: null,
  });
}
export function startRetentionJob() {
  const RETENTION_REQUEST_DAYS = Number(process.env.AUDIT_RETENTION_REQUEST_LOGS_DAYS || 90);
  const RETENTION_AUTH_DAYS = Number(process.env.AUDIT_RETENTION_AUTH_EVENTS_DAYS || 180);
  const RETENTION_EVENTS_DAYS = Number(process.env.AUDIT_RETENTION_AUDIT_EVENTS_DAYS || 30);

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  async function runCleanup() {
    try {
      await repoDeleteOldRequestLogs(RETENTION_REQUEST_DAYS);
      await repoDeleteOldAuthEvents(RETENTION_AUTH_DAYS);
      await repoDeleteOldAuditEvents(RETENTION_EVENTS_DAYS);

      console.log(
        `[audit] Retention cleanup done — request_logs: ${RETENTION_REQUEST_DAYS}d, auth_events: ${RETENTION_AUTH_DAYS}d, audit_events: ${RETENTION_EVENTS_DAYS}d`,
      );
    } catch (err) {
      console.error('[audit] Retention cleanup failed:', err);
    }
  }

  setTimeout(runCleanup, 30_000);
  setInterval(runCleanup, ONE_DAY_MS);
}