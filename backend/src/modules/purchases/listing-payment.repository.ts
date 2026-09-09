import { repoTransitionPayment } from "./event.repository";
import { paymentSessions } from "./session.schema";
import { repoAcceptReceipt, repoFindReservation, type PaymentProof } from "./session.repository";
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
  const [[user], price] = await Promise.all([
    db.select().from(users).where(eq(users.id, buyerId)).limit(1),
    repoGetListingCreditPrice(),
  ]);
  if (!user) return { ok: false, code: "user_not_found" } satisfies IlanPaymentResult;
  return db.transaction(async (tx) => {
  const [ilan] = await tx.select().from(ilanlar).where(eq(ilanlar.id, ilanId)).for("update");
  if (!ilan) return { ok: false, code: "listing_not_found" } satisfies IlanPaymentResult;
  if (ilan.user_id === buyerId) return { ok: false, code: "own_listing" } satisfies IlanPaymentResult;
  if (ilan.status !== "active" || new Date(ilan.departure_date).getTime() <= Date.now() || await repoFindReservation(tx, ilanId)) return { ok: false, code: "unavailable" } satisfies IlanPaymentResult;

  const id = randomUUID();
  const paymentRef = randomUUID();
  if (!Number.isFinite(price) || price <= 0) throw Object.assign(new Error("invalid_price"), {statusCode: 503});
  await tx.insert(paymentSessions).values({payment_ref: paymentRef, user_id: buyerId, ilan_id: ilanId, kind: "listing", provider, amount: price.toFixed(2), expires_at: new Date(Date.now() + 15 * 60000)});
  await tx.insert(ilanPurchasePayments).values({
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

  const [payment] = await tx.select().from(ilanPurchasePayments).where(eq(ilanPurchasePayments.id, id)).limit(1);
  return { ok: true, payment, price, user } satisfies IlanPaymentResult;
  });
}

export async function repoCompleteIlanPayment(paymentRef: string, proof: PaymentProof) {
  return db.transaction(async (tx) => {
    // Listing lock precedes session lock, matching reservation and credit spend.
    const [lookup] = await tx.select().from(ilanPurchasePayments).where(eq(ilanPurchasePayments.payment_ref, paymentRef));
    if (!lookup) return { ok: false, code: "not_found" as const };
    const [ilan] = await tx.select().from(ilanlar).where(eq(ilanlar.id, lookup.ilan_id)).for("update");
    const session = await repoAcceptReceipt(tx, paymentRef, proof);
    if (!session || session.kind !== "listing") return { ok: false, code: "verification_failed" as const };
    const [payment] = await tx.select().from(ilanPurchasePayments).where(eq(ilanPurchasePayments.payment_ref, paymentRef)).for("update");
    if (!payment) return { ok: false, code: "not_found" as const };
    if (payment.status === "completed") return { ok: true, already_processed: true, payment };
    if (payment.status !== "pending" || new Date(session.expires_at).getTime() <= Date.now() || !ilan || ilan.status !== "active" || ilan.user_id === payment.buyer_id || new Date(ilan.departure_date).getTime() <= Date.now()) {
      await repoTransitionPayment(tx, paymentRef, "refund_pending", "delivery_unavailable");
      await tx.update(ilanPurchasePayments).set({ status: "refund_pending" }).where(eq(ilanPurchasePayments.id, payment.id));
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
    await repoTransitionPayment(tx, paymentRef, "completed", null);
    return { ok: true, already_processed: false, payment, purchase_id: purchaseId, contact };
  });
}

export async function repoFailIlanPayment(paymentRef: string) {
  await db.update(ilanPurchasePayments)
    .set({ status: "failed" })
    .where(and(eq(ilanPurchasePayments.payment_ref, paymentRef), eq(ilanPurchasePayments.status, "pending")));
}
