import type { FastifyInstance } from "fastify";
import { adminListIlanPurchases } from "./admin.controller";

import { adminPayments,adminPayment,adminPaymentNote,adminCredits,adminCreditAdjustment,adminCommerceSummary } from "./operations.controller";
import { registerBankTransferAdmin } from './bank-transfer.routes';

export async function registerPurchasesAdmin(app: FastifyInstance) {
  await registerBankTransferAdmin(app);
  app.get("/ilan-purchases", adminListIlanPurchases);
  app.get("/payment-operations", adminPayments);
  app.get("/payment-operations/:ref", adminPayment);
  app.post("/payment-operations/:ref/notes", adminPaymentNote);
  app.get("/credits", adminCredits);
  app.post("/credits/adjust", adminCreditAdjustment);
  app.get("/commerce-summary", adminCommerceSummary);
}
