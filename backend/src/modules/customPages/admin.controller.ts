import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError, sendNotFound } from '@/modules/_shared';
import { createSchema, listQuerySchema, reorderSchema, updateSchema } from './validation';
import {
  repoCreateCustomPage,
  repoDeleteCustomPage,
  repoGetCustomPageById,
  repoListCustomPages,
  repoReorderCustomPages,
  repoUpdateCustomPage,
} from './repository';

export async function adminListPages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = listQuerySchema.parse(req.query ?? {});
    return reply.send(await repoListCustomPages(params));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_pages_list');
  }
}

export async function adminGetPage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const locale = (req.query as { locale?: string } | undefined)?.locale ?? 'tr';
    const row = await repoGetCustomPageById(id, locale);
    if (!row) return sendNotFound(reply);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_page_get');
  }
}

export async function adminCreatePage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = createSchema.parse(req.body ?? {});
    const { id } = await repoCreateCustomPage(data);
    const row = await repoGetCustomPageById(id, data.locale);
    return reply.code(201).send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_page_create');
  }
}

export async function adminUpdatePage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const data = updateSchema.parse(req.body ?? {});
    const existing = await repoGetCustomPageById(id, data.locale);
    if (!existing) return sendNotFound(reply);
    await repoUpdateCustomPage(id, data);
    return reply.send(await repoGetCustomPageById(id, data.locale));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_page_update');
  }
}

export async function adminDeletePage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetCustomPageById(id, 'tr');
    if (!existing) return sendNotFound(reply);
    await repoDeleteCustomPage(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_page_delete');
  }
}

export async function adminReorderPages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { items } = reorderSchema.parse(req.body ?? {});
    await repoReorderCustomPages(items);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_custom_page_reorder');
  }
}
