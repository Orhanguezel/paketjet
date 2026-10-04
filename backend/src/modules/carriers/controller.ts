// src/modules/carriers/controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { handleRouteError } from "@/modules/_shared";
import { parseCarrierDetailParams, parseCarriersListParams } from "./helpers";
import { repoGetCarrierById, repoListCarriers } from "./repository";
import { repoIdentitySummaries, type IdentitySummary } from "@/modules/identity";

// Kimlik belgesi yuklememis tasiyici icin durum "none" olur.
const identityOf = (summary?: IdentitySummary) => summary ?? { status: "none" as const, has_front: false, has_back: false, reject_reason: null, reviewed_at: null, updated_at: null };

/** GET /admin/carriers */
export async function adminListCarriers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = parseCarriersListParams(req.query);
    const result = await repoListCarriers(params);
    const identities = await repoIdentitySummaries(result.data.map((row) => row.id));
    reply.header("x-total-count", String(result.total));
    return reply.send({
      data: result.data.map((row) => ({ ...row, identity: identityOf(identities.get(row.id)) })),
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
    const identities = await repoIdentitySummaries([carrier.id]);
    return reply.send({ ...carrier, identity: identityOf(identities.get(carrier.id)) });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_carrier_get");
  }
}
