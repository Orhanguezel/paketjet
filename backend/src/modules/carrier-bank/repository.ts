// src/modules/carrier-bank/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { carrierBankAccounts } from "./schema";

export async function repoGetBankByUserId(userId: string) {
  const [row] = await db
    .select()
    .from(carrierBankAccounts)
    .where(eq(carrierBankAccounts.user_id, userId))
    .limit(1);
  return row ?? null;
}

export async function repoUpsertBank(userId: string, data: {
  iban: string;
  account_holder: string;
  bank_name: string;
}) {
  const existing = await repoGetBankByUserId(userId);

  if (existing) {
    await db
      .update(carrierBankAccounts)
      .set({ iban: data.iban, account_holder: data.account_holder, bank_name: data.bank_name })
      .where(eq(carrierBankAccounts.user_id, userId));
    return repoGetBankByUserId(userId);
  }

  const id = randomUUID();
  await db.insert(carrierBankAccounts).values({
    id,
    user_id: userId,
    iban: data.iban,
    account_holder: data.account_holder,
    bank_name: data.bank_name,
  });
  return repoGetBankByUserId(userId);
}

export async function repoDeleteBank(userId: string) {
  await db.delete(carrierBankAccounts).where(eq(carrierBankAccounts.user_id, userId));
}
