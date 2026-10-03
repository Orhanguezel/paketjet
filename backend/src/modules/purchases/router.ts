import { getPaymentAvailability, getPaymentStatus, getListingAccess } from "./status.controller";
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { authSecurity, fromZodSchema, okResponseSchema } from "@/modules/_shared";
import { getIlanIletisim, getMyCredits, listCreditPackages, listSatinAldiklarim, satinAlIlan } from "./controller";
import { initiateIlanPayment, purchaseCreditPackage } from "./payment.controller";
import { registerShopierPayments } from "./shopier.routes";
import { initiateIlanPaymentSchema, purchaseCreditPackageSchema, purchaseIlanSchema } from "./validation";
import { registerBankTransfer } from './bank-transfer.routes';

const idParams = { type: "object", properties: { id: { type: "string" } }, required: ["id"] } as const;
const ok = { response: { 200: okResponseSchema } };
const authOk = { security: authSecurity, ...ok };

export async function registerPurchases(app: FastifyInstance) {
  await registerBankTransfer(app);
  await registerShopierPayments(app);
  app.get("/ilanlar/:id/access", {preHandler: [requireAuth]}, getListingAccess);
  app.get("/payments/availability", getPaymentAvailability);
  app.get("/payments/:ref", {preHandler: [requireAuth]}, getPaymentStatus);
  app.post("/ilanlar/:id/satin-al", { preHandler: [requireAuth], config: { rateLimit: { max: 20, timeWindow: "1 minute" } }, schema: { tags: ["purchases"], summary: "İlan satın al (iletişim aç)", security: authSecurity, params: idParams, body: fromZodSchema(purchaseIlanSchema, "PurchaseIlanBody"), response: { 201: okResponseSchema } } }, satinAlIlan);
  app.post("/ilanlar/:id/satin-al/odeme", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "İlan iletişim ödemesi başlat", security: authSecurity, params: idParams, body: fromZodSchema(initiateIlanPaymentSchema, "InitiateIlanPaymentBody"), ...ok } }, initiateIlanPayment);
  app.get("/ilanlar/:id/iletisim", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "Satın alınan ilanın iletişimi", params: idParams, ...authOk } }, getIlanIletisim);
  app.get("/satin-aldiklarim", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "Satın aldıklarım", ...authOk } }, listSatinAldiklarim);
  app.get("/ilan-alma-hakki", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "İlan Alma Hakkı bakiyesi + hareketler", ...authOk } }, getMyCredits);
  app.get("/ilan-alma-hakki/paketler", { schema: { tags: ["purchases"], summary: "İlan Alma Hakkı paketleri", ...ok } }, listCreditPackages);
  app.post("/ilan-alma-hakki/satin-al", { preHandler: [requireAuth], schema: { tags: ["purchases"], summary: "İlan Alma Hakkı satın al", security: authSecurity, body: fromZodSchema(purchaseCreditPackageSchema, "PurchaseCreditPackageBody"), ...ok } }, purchaseCreditPackage);
}
