import { z } from "zod";

export const purchaseDeclarationSchema = z.object({
  estimated_value: z.coerce.number().positive().max(99999999),
  estimated_value_currency: z.string().trim().min(3).max(10).optional().default("TRY"),
  content_declared: z.literal(true, {
    errorMap: () => ({ message: "content_declaration_required" }),
  }),
});

export const purchaseCreditPackageSchema = z.object({
  package_key: z.string().min(1).max(80),
  provider: z.enum(["iyzico", "paytr"]).optional().default("paytr"),
});

export const purchaseIlanSchema = purchaseDeclarationSchema;

export const initiateIlanPaymentSchema = purchaseDeclarationSchema.extend({
  provider: z.enum(["iyzico", "paytr"]).optional().default("paytr"),
});
