import type { FastifyInstance } from "fastify";
import { adminListIlanPurchases } from "./admin.controller";

import { adminPayments,adminPayment,adminPaymentNote,adminCredits,adminCreditAdjustment,adminCommerceSummary } from "./operations.controller";
import { registerBankTransferAdmin } from './bank-transfer.routes';
import { adminRefundPayment, adminSyncRefund } from './refund.controller';
import { adminRebuildShopierWebhooks, adminShopierStatus, adminTestShopier, adminUpdateShopier } from './shopier-admin.controller';

export async function registerPurchasesAdmin(app: FastifyInstance) {
  await registerBankTransferAdmin(app);
  app.get("/ilan-purchases", adminListIlanPurchases);
  app.get("/payment-operations", adminPayments);
  app.get("/payment-operations/:ref", adminPayment);
  app.post("/payment-operations/:ref/notes", adminPaymentNote);
  app.post("/payment-operations/:ref/refund", adminRefundPayment);
  app.post("/payment-operations/:ref/refund/sync", adminSyncRefund);
  app.get("/payment-settings/shopier", adminShopierStatus);
  app.put("/payment-settings/shopier", adminUpdateShopier);
  app.post("/payment-settings/shopier/test", adminTestShopier);
  app.post("/payment-settings/shopier/webhooks", adminRebuildShopierWebhooks);
  app.get("/credits", adminCredits);
  app.post("/credits/adjust", adminCreditAdjustment);
  app.get("/commerce-summary", adminCommerceSummary);
}
