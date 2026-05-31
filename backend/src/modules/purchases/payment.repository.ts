import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
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
  await db
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

  const [row] = await db.select().from(creditPackagePurchases).where(eq(creditPackagePurchases.id, id)).limit(1);
  return { ok: true, purchase: row, pack, user } satisfies CreditPackagePaymentResult;
}

export async function repoCompleteCreditPackagePayment(paymentRef: string) {
  return db.transaction(async (tx) => {
    const [purchase] = await tx
      .select()
      .from(creditPackagePurchases)
      .where(eq(creditPackagePurchases.payment_ref, paymentRef))
      .for("update");

    if (!purchase) return { ok: false, code: "not_found" as const };
    if (purchase.status !== "pending") {
      return { ok: true, already_processed: true, purchase };
    }

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

    return { ok: true, already_processed: false, purchase };
  });
}

export async function repoFailCreditPackagePayment(paymentRef: string) {
  await db
    .update(creditPackagePurchases)
    .set({ status: "failed" })
    .where(and(eq(creditPackagePurchases.payment_ref, paymentRef), eq(creditPackagePurchases.status, "pending")));
}

export type IlanPaymentResult =
  | { ok: true; payment: IlanPurchasePayment; price: number; user: typeof users.$inferSelect }
  | { ok: false; code: "user_not_found" | "listing_not_found" | "own_listing" | "unavailable" };

async function repoGetListingCreditPrice() {
  const row = await repoGetFirstRowByFallback("pricing.listing_credit_price", ["tr", "*"]);
  const value = row ? rowToDto(row).value : 0;
  return Number(value);
}

export async function repoCreateIlanPayment(
  ilanId: string,
  buyerId: string,
  provider: "iyzico" | "paytr",
  declaration: PurchaseDeclaration,
  buyerIp: string,
) {
  const [[user], [ilan], price] = await Promise.all([
    db.select().from(users).where(eq(users.id, buyerId)).limit(1),
    db.select().from(ilanlar).where(eq(ilanlar.id, ilanId)).limit(1),
    repoGetListingCreditPrice(),
  ]);
  if (!user) return { ok: false, code: "user_not_found" } satisfies IlanPaymentResult;
  if (!ilan) return { ok: false, code: "listing_not_found" } satisfies IlanPaymentResult;
  if (ilan.user_id === buyerId) return { ok: false, code: "own_listing" } satisfies IlanPaymentResult;
  if (ilan.status !== "active") return { ok: false, code: "unavailable" } satisfies IlanPaymentResult;

  const id = randomUUID();
  const paymentRef = randomUUID();
  await db.insert(ilanPurchasePayments).values({
    id,
    ilan_id: ilanId,
    buyer_id: buyerId,
    price: price.toFixed(2),
    provider,
    payment_ref: paymentRef,
    estimated_value_snapshot: declaration.estimated_value.toFixed(2),
    estimated_value_currency: declaration.estimated_value_currency ?? "TRY",
    content_declared: 1,
    content_declared_at: new Date(),
    content_declared_ip: buyerIp,
    status: "pending",
  });

  const [payment] = await db.select().from(ilanPurchasePayments).where(eq(ilanPurchasePayments.id, id)).limit(1);
  return { ok: true, payment, price, user } satisfies IlanPaymentResult;
}

export async function repoCompleteIlanPayment(paymentRef: string) {
  return db.transaction(async (tx) => {
    const [payment] = await tx.select().from(ilanPurchasePayments).where(eq(ilanPurchasePayments.payment_ref, paymentRef)).for("update");
    if (!payment) return { ok: false, code: "not_found" as const };
    if (payment.status !== "pending") return { ok: true, already_processed: true, payment };

    const [ilan] = await tx.select().from(ilanlar).where(eq(ilanlar.id, payment.ilan_id)).for("update");
    if (!ilan || ilan.status !== "active" || ilan.user_id === payment.buyer_id) {
      await tx.update(ilanPurchasePayments).set({ status: "failed" }).where(eq(ilanPurchasePayments.id, payment.id));
      return { ok: false, code: "unavailable" as const, payment };
    }

    const contact = { name: ilan.contact_name, phone: ilan.contact_phone, email: ilan.contact_email, address: ilan.contact_address };
    const purchaseId = randomUUID();
    await tx.insert(ilanPurchases).values({
      id: purchaseId,
      ilan_id: ilan.id,
      buyer_id: payment.buyer_id,
      seller_id: ilan.user_id,
      price_paid: payment.price,
      pay_method: "card",
      credit_used: 0,
      payment_ref: payment.payment_ref,
      estimated_value_snapshot: payment.estimated_value_snapshot,
      estimated_value_currency: payment.estimated_value_currency,
      content_declared: payment.content_declared,
      content_declared_at: payment.content_declared_at,
      content_declared_ip: payment.content_declared_ip,
      contact_snapshot: contact,
      status: "completed",
    });
    await tx.update(ilanlar).set({ status: "sold", sold_at: new Date(), sold_to_user_id: payment.buyer_id }).where(eq(ilanlar.id, ilan.id));
    await tx.update(ilanPurchasePayments).set({ status: "completed" }).where(eq(ilanPurchasePayments.id, payment.id));
    return { ok: true, already_processed: false, payment, purchase_id: purchaseId, contact };
  });
}

export async function repoFailIlanPayment(paymentRef: string) {
  await db.update(ilanPurchasePayments)
    .set({ status: "failed" })
    .where(and(eq(ilanPurchasePayments.payment_ref, paymentRef), eq(ilanPurchasePayments.status, "pending")));
}
