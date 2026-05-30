import { z } from "zod";

export const purchaseCreditPackageSchema = z.object({
  package_key: z.string().min(1).max(80),
  provider: z.enum(["iyzico", "paytr"]).optional().default("paytr"),
});
