// src/modules/subscription/service.ts
// Cuzdan entegrasyonu — plan satin alma islemleri

import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { getOrCreateWallet } from "@/modules/wallet";
import { eq, sql } from "drizzle-orm";
import { wallets, walletTransactions } from "../wallet/schema";

/** Cuzdandan plan bedeli dus. Basarili ise transaction ref doner. */
export async function deductForPlan(userId: string, amount: number, planId: string): Promise<string> {
  const wallet = await getOrCreateWallet(userId);
  const balance = parseFloat(wallet.balance);
  if (balance < amount) throw new Error("insufficient_balance");

  const txRef = randomUUID();

  await db.transaction(async (tx) => {
    await tx
      .update(wallets)
      .set({ balance: sql`balance - ${amount}` })
      .where(eq(wallets.id, wallet.id));

    await tx.insert(walletTransactions).values({
      id: txRef,
      wallet_id: wallet.id,
      user_id: userId,
      type: "debit",
      amount: amount.toFixed(2),
      purpose: "plan_purchase",
      description: `Plan #${planId} satin alma`,
      payment_status: "completed",
      transaction_ref: planId,
    });
  });

  return txRef;
}
