// =============================================================
// FILE: src/modules/audit/requestLogger.plugin.ts
// PaketJet – Request Logger Plugin (Fastify onResponse)
// =============================================================

import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { writeRequestAuditLog, shouldSkipAuditLog } from './helpers';

type RequestLoggerOpts = Record<never, never>;
type ReplyWithElapsed = { elapsedTime?: unknown };

// NOT: fp() ile sarmalanmazsa onResponse hook'u plugin kapsulune hapsolur ve
// kardes route'lara (gercek isteklere) uygulanmaz -> audit tablolari hep bos kalir.
const requestLoggerImpl: FastifyPluginAsync<RequestLoggerOpts> = async (app, _opts) => {
  app.addHook('onResponse', async (req, reply) => {
    try {
      if (shouldSkipAuditLog(req)) return;

      const reqId = String(req.id || '');
      const elapsedReply = reply as typeof reply & ReplyWithElapsed;
      const elapsed = typeof elapsedReply.elapsedTime === 'number' ? elapsedReply.elapsedTime : 0;

      await writeRequestAuditLog({
        req,
        reply,
        reqId,
        responseTimeMs: elapsed,
      });
    } catch (err) {
      req.log.warn({ err }, 'audit_request_log_failed');
    }
  });
};

export const requestLoggerPlugin = fp(requestLoggerImpl, {
  name: 'request-logger',
});
