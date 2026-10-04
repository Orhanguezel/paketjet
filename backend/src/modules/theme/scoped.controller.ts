import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError } from '@/modules/_shared';
import { deepMergeThemeConfig } from './helpers';
import { repoGetScopedTheme, repoResetScopedTheme, repoSaveScopedTheme } from './scoped.repository';
import { scopedThemeDefaults } from './scoped-defaults';
import { themeUpdateSchema } from './validation';
import { z } from 'zod';

const paramsSchema = z.object({ scope: z.enum(['storefront', 'admin-panel']) });

export async function publicGetScopedTheme(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { scope } = paramsSchema.parse(req.params);
    const theme = await repoGetScopedTheme(scope);
    return reply.header('Cache-Control', 'public, max-age=30').send(theme);
  } catch (error) {
    return handleRouteError(reply, req, error, 'public_get_scoped_theme');
  }
}

export async function adminGetScopedTheme(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { scope } = paramsSchema.parse(req.params);
    return reply.send(await repoGetScopedTheme(scope));
  } catch (error) {
    return handleRouteError(reply, req, error, 'admin_get_scoped_theme');
  }
}

export async function adminUpdateScopedTheme(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { scope } = paramsSchema.parse(req.params);
    const patch = themeUpdateSchema.parse(req.body ?? {});
    const current = await repoGetScopedTheme(scope);
    const merged = deepMergeThemeConfig(current.enabled ? current : scopedThemeDefaults[scope], patch);
    await repoSaveScopedTheme(scope, merged);
    return reply.send({ ...merged, enabled: true });
  } catch (error) {
    return handleRouteError(reply, req, error, 'admin_update_scoped_theme');
  }
}

export async function adminResetScopedTheme(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { scope } = paramsSchema.parse(req.params);
    return reply.send(await repoResetScopedTheme(scope));
  } catch (error) {
    return handleRouteError(reply, req, error, 'admin_reset_scoped_theme');
  }
}
