// src/modules/carrier-kyc/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { getKycStatus, getDocuments, uploadDocument, deleteDocument } from "./controller";

export async function registerCarrierKyc(app: FastifyInstance) {
  const B = "/carrier-kyc";
  const auth = { preHandler: [requireAuth] };
  app.get(`${B}/status`, auth, getKycStatus);
  app.get(`${B}/documents`, auth, getDocuments);
  app.post(`${B}/upload`, auth, uploadDocument);
  app.delete(`${B}/:id`, auth, deleteDocument);
}
