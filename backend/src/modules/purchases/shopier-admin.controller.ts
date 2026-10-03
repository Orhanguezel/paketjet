// src/modules/purchases/shopier-admin.controller.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getAuthUserId, handleRouteError } from '@/modules/_shared';
import { rebuildShopierWebhooks, shopierStatus, testShopierConnection, updateShopierSettings } from './shopier-admin.service';

const settingsBody = z.object({
  card_enabled: z.boolean().optional(),
  product_image_url: z.string().trim().url().startsWith('https://').max(500).nullable().optional(),
  pat: z.string().trim().regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'pat_format').max(4000).nullable().optional(),
}).strict();

/** GET /admin/payment-settings/shopier */
export async function adminShopierStatus(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.header('cache-control', 'no-store').send(await shopierStatus()); } catch (e) { return handleRouteError(reply, req, e, 'shopier_settings_get'); }
}

/** PUT /admin/payment-settings/shopier — yeni anahtar kaydetmeden once Shopier'de dogrulanir. */
export async function adminUpdateShopier(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = settingsBody.parse(req.body ?? {});
    const status = await updateShopierSettings(body, getAuthUserId(req));
    req.log.info({ event: 'shopier_settings_updated', fields: Object.keys(body), adminId: getAuthUserId(req) }, 'shopier_settings_updated');
    return reply.send(status);
  } catch (e) { return handleRouteError(reply, req, e, 'shopier_settings_update'); }
}

/** POST /admin/payment-settings/shopier/test */
export async function adminTestShopier(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.send(await testShopierConnection()); } catch (e) { return handleRouteError(reply, req, e, 'shopier_settings_test'); }
}

/** POST /admin/payment-settings/shopier/webhooks */
export async function adminRebuildShopierWebhooks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = await rebuildShopierWebhooks(getAuthUserId(req));
    req.log.info({ event: 'shopier_webhooks_rebuilt', adminId: getAuthUserId(req) }, 'shopier_webhooks_rebuilt');
    return reply.send(status);
  } catch (e) { return handleRouteError(reply, req, e, 'shopier_webhooks_rebuild'); }
}
