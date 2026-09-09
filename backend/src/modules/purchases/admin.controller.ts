import {z} from 'zod';
import type { FastifyReply, FastifyRequest } from "fastify";
import { handleRouteError, parsePage } from "@/modules/_shared";
import { repoAdminListIlanPurchases } from "./admin.repository";

export async function adminListIlanPurchases(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { page, limit, offset } = parsePage(req.query as Record<string, string>);
    const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v)));
    const filters=z.object({search:z.string().max(200).optional(),method:z.enum(['card','credit']).optional(),status:z.enum(['completed','pending','failed','refunded']).optional(),from:day.optional(),to:day.optional()}).parse(req.query);
    const result = await repoAdminListIlanPurchases({ limit, offset,...filters });
    reply.header("x-total-count", String(result.total));
    return reply.send({ data: result.data, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_ilan_purchases_list");
  }
}
