// src/modules/carrier-bank/validation.ts
import { z } from "zod";

const ibanRegex = /^TR\d{24}$/;

export const upsertBankSchema = z.object({
  iban: z.string().regex(ibanRegex, "Geçerli bir TR IBAN giriniz (TR + 24 rakam)"),
  account_holder: z.string().min(3, "Hesap sahibi en az 3 karakter olmalıdır"),
  bank_name: z.string().min(2, "Banka adı en az 2 karakter olmalıdır"),
});
