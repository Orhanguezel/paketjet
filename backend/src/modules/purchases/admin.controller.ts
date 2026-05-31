import type { FastifyReply, FastifyRequest } from "fastify";
import { handleRouteError, parsePage } from "@/modules/_shared";
import { repoAdminListIlanPurchases } from "./admin.repository";

export async function adminListIlanPurchases(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { page, limit, offset } = parsePage(req.query as Record<string, string>);
    const result = await repoAdminListIlanPurchases({ limit, offset });
    reply.header("x-total-count", String(result.total));
    return reply.send({ data: result.data, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_ilan_purchases_list");
  }
}
