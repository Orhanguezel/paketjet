// src/modules/carrier-agreements/router.ts
import type { FastifyInstance } from "fastify";
import { getMyAgreement } from "./controller";

export async function registerCarrierAgreements(app: FastifyInstance) {
  const B = "/carrier-agreements";
  app.get(`${B}/me`, getMyAgreement);
}
