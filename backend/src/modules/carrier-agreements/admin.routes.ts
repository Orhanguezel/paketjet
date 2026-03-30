// src/modules/carrier-agreements/admin.routes.ts
import type { FastifyInstance } from "fastify";
import {
  adminListAgreements,
  adminGetAgreement,
  adminCreateAgreement,
  adminUpdateAgreement,
  adminDeleteAgreement,
} from "./admin.controller";

export async function registerCarrierAgreementsAdmin(app: FastifyInstance) {
  const B = "/carrier-agreements";
  app.get(B, adminListAgreements);
  app.get(`${B}/:id`, adminGetAgreement);
  app.post(B, adminCreateAgreement);
  app.put(`${B}/:id`, adminUpdateAgreement);
  app.delete(`${B}/:id`, adminDeleteAgreement);
}
