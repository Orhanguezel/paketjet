// src/modules/carrier-agreements/admin.controller.ts
import type { RouteHandler } from "fastify";
import { handleRouteError, parsePage, sendNotFound } from "@/modules/_shared";
import {
  repoListAgreements,
  repoGetAgreementById,
  repoGetAgreementByUserId,
  repoCreateAgreement,
  repoUpdateAgreement,
  repoDeleteAgreement,
} from "./repository";
import { createAgreementSchema, updateAgreementSchema } from "./validation";

/** Admin: anlaşma listesi */
export const adminListAgreements: RouteHandler = async (req, reply) => {
  try {
    const q = req.query as Record<string, string>;
    const { limit, offset } = parsePage(q);
    const result = await repoListAgreements({
      status: q.status,
      type: q.type,
      limit,
      offset,
    });
    reply.header("x-total-count", String(result.total));
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_agreements_list");
  }
};

/** Admin: tekil anlaşma detayı */
export const adminGetAgreement: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const agreement = await repoGetAgreementById(id);
    if (!agreement) return sendNotFound(reply);
    return reply.send(agreement);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_agreement_get");
  }
};

/** Admin: yeni anlaşma oluştur */
export const adminCreateAgreement: RouteHandler = async (req, reply) => {
  try {
    const body = createAgreementSchema.parse(req.body ?? {});

    // Aynı taşıyıcıda zaten anlaşma var mı?
    const existing = await repoGetAgreementByUserId(body.user_id);
    if (existing) {
      return reply.code(409).send({ error: { message: "agreement_already_exists" } });
    }

    const agreement = await repoCreateAgreement(body);
    return reply.code(201).send(agreement);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_agreement_create");
  }
};

/** Admin: anlaşma güncelle */
export const adminUpdateAgreement: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const body = updateAgreementSchema.parse(req.body ?? {});

    const existing = await repoGetAgreementById(id);
    if (!existing) return sendNotFound(reply);

    const updated = await repoUpdateAgreement(id, body);
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_agreement_update");
  }
};

/** Admin: anlaşma sil */
export const adminDeleteAgreement: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await repoGetAgreementById(id);
    if (!existing) return sendNotFound(reply);
    await repoDeleteAgreement(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_agreement_delete");
  }
};
