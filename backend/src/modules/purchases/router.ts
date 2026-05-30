// src/modules/purchases/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { authSecurity, okResponseSchema } from "@/modules/_shared";
import { getIlanIletisim, getMyCredits, listCreditPackages, listSatinAldiklarim, satinAlIlan } from "./controller";

const idParams = { type: "object", properties: { id: { type: "string" } }, required: ["id"] } as const;
const ok = { response: { 200: okResponseSchema } };
const authOk = { security: authSecurity, ...ok };

export async function registerPurchases(app: FastifyInstance) {
  app.post("/ilanlar/:id/satin-al", {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
    schema: { tags: ["purchases"], summary: "İlan satın al (iletişim aç)", security: authSecurity, params: idParams, response: { 201: okResponseSchema } },
  }, satinAlIlan);
  app.get("/ilanlar/:id/iletisim", {
    preHandler: [requireAuth],
    schema: { tags: ["purchases"], summary: "Satın alınan ilanın iletişimi", params: idParams, ...authOk },
  }, getIlanIletisim);
  app.get("/satin-aldiklarim", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "Satın aldıklarım", ...authOk } }, listSatinAldiklarim);
  app.get("/ilan-alma-hakki", {
    preHandler: [requireAuth],
    schema: { tags: ["purchases"], summary: "İlan Alma Hakkı bakiyesi + hareketler", ...authOk },
  }, getMyCredits);
  app.get("/ilan-alma-hakki/paketler", { schema: { tags: ["purchases"], summary: "İlan Alma Hakkı paketleri", ...ok } }, listCreditPackages);
}
