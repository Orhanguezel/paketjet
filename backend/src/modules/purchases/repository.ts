// src/modules/purchases/repository.ts
import { randomUUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { ilanlar } from "../ilanlar/schema";
import { repoGetFirstRowByFallback, rowToDto } from "../siteSettings/repository";
import {
  ilanPurchases,
  userCredits,
  creditLedger,
  type ContactSnapshot,
  type PurchaseDeclaration,
} from "./schema";

export type PurchaseResult =
  | { ok: true; purchase_id: string; contact: ContactSnapshot; credit_balance: number }
  | { ok: false; code: "not_found" | "own_listing" | "unavailable" | "insufficient_credit" };

export interface CreditPackageDto {
  key: string;
  credits: number;
  price: number;
}

/**
 * Lead-reveal satın alma — ATOMİK.
 * İlan satırı FOR UPDATE ile kilitlenir → iki taşıyıcı aynı anda alamaz (tek alıcı).
 * Hak (kontör) varsa düşülür; yoksa insufficient_credit (402 → frontend hak/kart akışı).
 */
export async function repoPurchaseIlan(
  ilanId: string,
  buyerId: string,
  declaration: PurchaseDeclaration,
  buyerIp: string,
): Promise<PurchaseResult> {
  return db.transaction(async (tx) => {
    const [ilan] = await tx.select().from(ilanlar).where(eq(ilanlar.id, ilanId)).for("update");
    if (!ilan) return { ok: false, code: "not_found" };
    if (ilan.user_id === buyerId) return { ok: false, code: "own_listing" };
    if (ilan.status !== "active") return { ok: false, code: "unavailable" };

    const [credit] = await tx.select().from(userCredits).where(eq(userCredits.user_id, buyerId)).for("update");
    if (!credit || credit.balance < 1) return { ok: false, code: "insufficient_credit" };

    const purchaseId = randomUUID();
    const newBalance = credit.balance - 1;

    // Hak düş + ledger
    await tx.update(userCredits).set({ balance: newBalance }).where(eq(userCredits.user_id, buyerId));
    await tx.insert(creditLedger).values({
      id: randomUUID(), user_id: buyerId, delta: -1, reason: "reveal_spend", ref_id: purchaseId, balance_after: newBalance,
    });

    const contact: ContactSnapshot = {
      name: ilan.contact_name, phone: ilan.contact_phone, email: ilan.contact_email, address: ilan.contact_address,
    };

    // Satın alma kaydı — UNIQUE(ilan_id) eşzamanlılık backstop'u
    await tx.insert(ilanPurchases).values({
      id: purchaseId, ilan_id: ilanId, buyer_id: buyerId, seller_id: ilan.user_id,
      price_paid: "0.00", pay_method: "credit", credit_used: 1,
      estimated_value_snapshot: declaration.estimated_value.toFixed(2),
      estimated_value_currency: declaration.estimated_value_currency ?? "TRY",
      content_declared: 1,
      content_declared_at: new Date(),
      content_declared_ip: buyerIp,
      contact_snapshot: contact, status: "completed",
    });

    // İlan satıldı (kapanır)
    await tx.update(ilanlar).set({ status: "sold", sold_at: new Date(), sold_to_user_id: buyerId }).where(eq(ilanlar.id, ilanId));

    return { ok: true, purchase_id: purchaseId, contact, credit_balance: newBalance };
  });
}

/** Reveal — satın alan kullanıcı için iletişim snapshot'ı (yoksa null) */
export async function repoGetRevealForBuyer(ilanId: string, buyerId: string): Promise<ContactSnapshot | null> {
  const [row] = await db
    .select({ contact: ilanPurchases.contact_snapshot })
    .from(ilanPurchases)
    .where(and(eq(ilanPurchases.ilan_id, ilanId), eq(ilanPurchases.buyer_id, buyerId), eq(ilanPurchases.status, "completed")))
    .limit(1);
  return row?.contact ?? null;
}

/** Taşıyıcının satın aldıkları (açılan iletişimlerle) */
export async function repoListMyPurchases(buyerId: string) {
  return db
    .select({
      id: ilanPurchases.id,
      ilan_id: ilanPurchases.ilan_id,
      created_at: ilanPurchases.created_at,
      estimated_value: ilanPurchases.estimated_value_snapshot,
      contact: ilanPurchases.contact_snapshot,
      from_city: ilanlar.from_city,
      to_city: ilanlar.to_city,
      title: ilanlar.title,
    })
    .from(ilanPurchases)
    .leftJoin(ilanlar, eq(ilanPurchases.ilan_id, ilanlar.id))
    .where(eq(ilanPurchases.buyer_id, buyerId))
    .orderBy(desc(ilanPurchases.created_at));
}

/** İlan Alma Hakkı bakiyesi (yoksa 0) */
export async function repoGetCreditBalance(userId: string): Promise<number> {
  const [row] = await db.select({ balance: userCredits.balance }).from(userCredits).where(eq(userCredits.user_id, userId)).limit(1);
  return row?.balance ?? 0;
}

export async function repoGetCreditPackages(): Promise<CreditPackageDto[]> {
  const row = await repoGetFirstRowByFallback("pricing.credit_packages", ["tr", "*"]);
  const value = row ? rowToDto(row).value : [];
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const pack = item as Partial<CreditPackageDto>;
      return {
        key: String(pack.key ?? ""),
        credits: Number(pack.credits),
        price: Number(pack.price),
      };
    })
    .filter((pack) => pack.key && Number.isFinite(pack.credits) && Number.isFinite(pack.price));
}

/** Hak hareketleri */
export async function repoListCreditLedger(userId: string, limit = 50) {
  return db.select().from(creditLedger).where(eq(creditLedger.user_id, userId)).orderBy(desc(creditLedger.created_at)).limit(limit);
}

/** Hak ekle (paket alımı / admin grant / iade) — atomik upsert + ledger */
export async function repoGrantCredits(
  userId: string,
  amount: number,
  reason: "package_purchase" | "admin_grant" | "refund",
  refId?: string | null,
): Promise<number> {
  return db.transaction(async (tx) => {
    const [c] = await tx.select().from(userCredits).where(eq(userCredits.user_id, userId)).for("update");
    let balance: number;
    if (!c) {
      balance = amount;
      await tx.insert(userCredits).values({ id: randomUUID(), user_id: userId, balance });
    } else {
      balance = c.balance + amount;
      await tx.update(userCredits).set({ balance }).where(eq(userCredits.user_id, userId));
    }
    await tx.insert(creditLedger).values({ id: randomUUID(), user_id: userId, delta: amount, reason, ref_id: refId ?? null, balance_after: balance });
    return balance;
  });
}
