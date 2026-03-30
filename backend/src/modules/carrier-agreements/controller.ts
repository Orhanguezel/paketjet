// src/modules/carrier-agreements/controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound } from "@/modules/_shared";
import { repoGetAgreementByUserId } from "./repository";

/** Taşıyıcı: kendi anlaşmasını görüntüle */
export const getMyAgreement: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const agreement = await repoGetAgreementByUserId(userId);
    if (!agreement) return sendNotFound(reply);
    return reply.send(agreement);
  } catch (e) {
    return handleRouteError(reply, req, e, "agreement_get_failed");
  }
};
