// src/modules/carriers/controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { handleRouteError } from "@/modules/_shared";
import { parseCarrierDetailParams, parseCarriersListParams } from "./helpers";
import { repoGetCarrierById, repoListCarriers } from "./repository";

/** GET /admin/carriers */
export async function adminListCarriers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = parseCarriersListParams(req.query);
    const result = await repoListCarriers(params);
    reply.header("x-total-count", String(result.total));
    return reply.send({
      data: result.data,
      total: result.total,
      limit: params.limit,
      offset: params.offset,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_carriers_list");
  }
}

/** GET /admin/carriers/:id */
export async function adminGetCarrier(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = parseCarrierDetailParams(req.params);
    const carrier = await repoGetCarrierById(id);
    if (!carrier) {
      return reply.code(404).send({ error: { message: "carrier_not_found" } });
    }
    return reply.send(carrier);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_carrier_get");
  }
}
