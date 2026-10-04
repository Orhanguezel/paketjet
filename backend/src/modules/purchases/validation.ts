import { z } from "zod";

export const purchaseDeclarationSchema = z.object({
  estimated_value: z.coerce.number().positive().max(99999999),
  estimated_value_currency: z.literal("TRY").optional().default("TRY"),
  content_declared: z.literal(true, {
    errorMap: () => ({ message: "content_declaration_required" }),
  }),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "terms_acceptance_required" }),
  }),
});

export const purchaseCreditPackageSchema = z.object({
  package_key: z.string().min(1).max(80),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "terms_acceptance_required" }),
  }),
  provider: z.enum(["shopier"]).optional(),
});

export const purchaseIlanSchema = purchaseDeclarationSchema;

export const initiateIlanPaymentSchema = purchaseDeclarationSchema.extend({
  provider: z.enum(["shopier"]).optional(),
});
