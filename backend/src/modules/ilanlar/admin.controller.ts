// =============================================================
// FILE: src/modules/ilanlar/admin.controller.ts
// Admin ilan handlers
// =============================================================
import type { FastifyRequest, FastifyReply } from 'fastify';
import { handleRouteError, sendNotFound } from "@/modules/_shared";
import { parseAdminIlanListParams } from './helpers';
import { updateIlanStatusSchema } from './validation';
import { repoGetIlanById, repoUpdateIlanStatus, repoDeleteIlan } from './repository';
import { repoAdminListIlans } from './admin.repository';

/** GET /admin/ilanlar */
export async function adminListIlans(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = parseAdminIlanListParams(req.query as Record<string, string>);
    const result = await repoAdminListIlans(params);

    reply.header('x-total-count', String(result.total));
    return reply.send({ data: result.data, total: result.total, page: params.page, limit: params.limit });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_ilanlar_list');
  }
}

/** GET /admin/ilanlar/:id */
export async function adminGetIlan(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const ilan = await repoGetIlanById(id);
    if (!ilan) return sendNotFound(reply);
    return reply.send(ilan);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_ilan_get');
  }
}

/** PATCH /admin/ilanlar/:id/status */
export async function adminUpdateIlanStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { status } = updateIlanStatusSchema.parse(req.body ?? {});
    const ilan = await repoGetIlanById(id);
    if (!ilan) return sendNotFound(reply);
    return reply.send(await repoUpdateIlanStatus(id, status));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_ilan_status');
  }
}

/** DELETE /admin/ilanlar/:id */
export async function adminDeleteIlan(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const ilan = await repoGetIlanById(id);
    if (!ilan) return sendNotFound(reply);
    await repoDeleteIlan(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_ilan_delete');
  }
}
