import { z } from "zod";

export const carrierBankSchema = z.object({
  iban: z
    .string()
    .min(1, "IBAN zorunludur")
    .regex(/^TR\d{24}$/, "Geçerli bir TR IBAN giriniz (TR + 24 rakam)"),
  account_holder: z
    .string()
    .min(3, "Hesap sahibi en az 3 karakter olmalıdır"),
  bank_name: z
    .string()
    .min(2, "Banka adı en az 2 karakter olmalıdır"),
});

export type CarrierBankFormData = z.infer<typeof carrierBankSchema>;
