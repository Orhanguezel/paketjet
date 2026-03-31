// src/modules/carrier-kyc/admin.routes.ts
import type { FastifyInstance } from "fastify";
import { adminListKyc, adminGetCarrierKyc, adminReviewDocument, adminCreateSubMerchant } from "./admin.controller";

export async function registerCarrierKycAdmin(app: FastifyInstance) {
  const B = "/kyc";
  app.get(B, adminListKyc);
  app.get(`${B}/carrier/:id`, adminGetCarrierKyc);
  app.put(`${B}/:id/review`, adminReviewDocument);
  app.post(`${B}/carrier/:id/create-sub-merchant`, adminCreateSubMerchant);
}
