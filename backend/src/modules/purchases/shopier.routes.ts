import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { checkShopierPayment, shopierWebhook, type RawBodyRequest } from "./shopier.controller";

export async function registerShopierPayments(app: FastifyInstance) {
  const B = "/payments";
  app.post(`${B}/:ref/shopier/check`, { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, checkShopierPayment);
  // Imza ham govde uzerinden dogrulanir: bu kapsamda JSON ham olarak da saklanir.
  await app.register(async (scope) => {
    scope.addContentTypeParser("application/json", { parseAs: "buffer", bodyLimit: 1024 * 1024 }, (req, body, done) => {
      (req as RawBodyRequest).rawBody = body as Buffer;
      try { done(null, JSON.parse((body as Buffer).toString("utf8"))); } catch { done(null, {}); }
    });
    scope.post(`${B}/shopier/webhook`, { config: { rateLimit: false } }, shopierWebhook);
  });
}
