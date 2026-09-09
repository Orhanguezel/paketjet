import { repoTransitionPayment } from "./event.repository";
import { paymentSessions } from "./session.schema";
import { repoAcceptReceipt, repoFindReservation, type PaymentProof } from "./session.repository";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "../auth/schema";
import { ilanlar } from "../ilanlar/schema";
import {
  creditLedger,
  creditPackagePurchases,
  ilanPurchases,
  ilanPurchasePayments,
  userCredits,
  type PurchaseDeclaration,
  type CreditPackagePurchase,
  type IlanPurchasePayment,
} from "./schema";
import { repoGetCreditPackages, type CreditPackageDto } from "./repository";
import { repoGetFirstRowByFallback, rowToDto } from "../siteSettings/repository";

export type CreditPackagePaymentResult =
  | { ok: true; purchase: CreditPackagePurchase; pack: CreditPackageDto; user: typeof users.$inferSelect }
  | { ok: false; code: "user_not_found" | "package_not_found" };

export async function repoCreateCreditPackagePayment(userId: string, packageKey: string, provider: "iyzico" | "paytr") {
  const [[user], packages] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).limit(1),
    repoGetCreditPackages(),
  ]);
  if (!user) return { ok: false, code: "user_not_found" } satisfies CreditPackagePaymentResult;

  const pack = packages.find((item) => item.key === packageKey);
  if (!pack) return { ok: false, code: "package_not_found" } satisfies CreditPackagePaymentResult;

  const id = randomUUID();
  const paymentRef = randomUUID();
  await db.transaction(async (tx) => {
  await tx.insert(paymentSessions).values({payment_ref: paymentRef, user_id: userId, kind: "credits", provider, amount: pack.price.toFixed(2), expires_at: new Date(Date.now() + 15 * 60000)});
  await tx
    .insert(creditPackagePurchases)
    .values({
      id,
      user_id: userId,
      package_key: pack.key,
      credits: pack.credits,
      price: pack.price.toFixed(2),
      provider,
      payment_ref: paymentRef,
      status: "pending",
    });

  });
  const [row] = await db.select().from(creditPackagePurchases).where(eq(creditPackagePurchases.id, id)).limit(1);
  return { ok: true, purchase: row, pack, user } satisfies CreditPackagePaymentResult;
}

export async function repoCompleteCreditPackagePayment(paymentRef: string, proof: PaymentProof) {
  return db.transaction(async (tx) => {
    const session = await repoAcceptReceipt(tx, paymentRef, proof);
    if (!session || session.kind !== "credits") return { ok: false, code: "verification_failed" as const };
    const [purchase] = await tx
      .select()
      .from(creditPackagePurchases)
      .where(eq(creditPackagePurchases.payment_ref, paymentRef))
      .for("update");

    if (!purchase) return { ok: false, code: "not_found" as const };
    if (purchase.status === "completed") return { ok: true, already_processed: true, purchase };
    if (purchase.status !== "pending") {
      await repoTransitionPayment(tx, paymentRef, "refund_pending", "late_payment");
      return { ok: false, code: "review_required" as const };
    }
    await tx.select({id: users.id}).from(users).where(eq(users.id, purchase.user_id)).for("update");

    await tx.insert(userCredits).values({id: randomUUID(), user_id: purchase.user_id, balance: 0}).onDuplicateKeyUpdate({set:{balance: sql`balance`}});
    const [credit] = await tx.select().from(userCredits).where(eq(userCredits.user_id, purchase.user_id)).for("update");
    const balance = (credit?.balance ?? 0) + purchase.credits;
    if (credit) {
      await tx.update(userCredits).set({ balance }).where(eq(userCredits.user_id, purchase.user_id));
    } else {
      await tx.insert(userCredits).values({ id: randomUUID(), user_id: purchase.user_id, balance });
    }
    await tx.insert(creditLedger).values({
      id: randomUUID(),
      user_id: purchase.user_id,
      delta: purchase.credits,
      reason: "package_purchase",
      ref_id: purchase.id,
      balance_after: balance,
    });
    await tx
      .update(creditPackagePurchases)
      .set({ status: "completed" })
      .where(eq(creditPackagePurchases.id, purchase.id));

    await repoTransitionPayment(tx, paymentRef, "completed", null);
    return { ok: true, already_processed: false, purchase };
  });
}

export async function repoFailCreditPackagePayment(paymentRef: string) {
  await db
    .update(creditPackagePurchases)
    .set({ status: "failed" })
    .where(and(eq(creditPackagePurchases.payment_ref, paymentRef), eq(creditPackagePurchases.status, "pending")));
}
