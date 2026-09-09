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
export type HeaderCarrier = { headers: Record<string, unknown> };
export type RequestWithUrl = FastifyRequest & {
  raw?: { url?: string };
  url?: string;
  auth?: { user?: unknown };
  requestContext?: { get?: (key: string) => unknown };
  auditError?: { message?: string; code?: string; stack?: string };
};
export type ReplyWithStatus = FastifyReply & {
  raw?: { statusCode?: number };
};
export type RequestUserRecord = Record<string, unknown>;
export type SanitizableRecord = Record<string, unknown>;
export const SENSITIVE_FIELDS = new Set([
  'password',
  'password_hash',
  'token',
  'secret',
  'api_key',
  'apikey',
  'access_token',
  'refresh_token',
  'authorization',
  'credit_card',
  'cvv',
  'ssn',
  'pin',
  'current_password',
  'new_password',
  'confirm_password',
]);
export const MAX_BODY_SIZE = 4096;
