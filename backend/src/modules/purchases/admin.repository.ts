import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { ilanlar } from "../ilanlar/schema";
import { ilanPurchases } from "./schema";

export async function repoAdminListIlanPurchases(params: { limit: number; offset: number }) {
  const [data, [countRow]] = await Promise.all([
    db
      .select({
        id: ilanPurchases.id,
        ilan_id: ilanPurchases.ilan_id,
        buyer_id: ilanPurchases.buyer_id,
        seller_id: ilanPurchases.seller_id,
        price_paid: ilanPurchases.price_paid,
        pay_method: ilanPurchases.pay_method,
        credit_used: ilanPurchases.credit_used,
        payment_ref: ilanPurchases.payment_ref,
        estimated_value: ilanPurchases.estimated_value_snapshot,
        contact: ilanPurchases.contact_snapshot,
        status: ilanPurchases.status,
        created_at: ilanPurchases.created_at,
        from_city: ilanlar.from_city,
        to_city: ilanlar.to_city,
        title: ilanlar.title,
        buyer_name: sql<string | null>`(SELECT full_name FROM users WHERE users.id = ${ilanPurchases.buyer_id} LIMIT 1)`,
        buyer_email: sql<string | null>`(SELECT email FROM users WHERE users.id = ${ilanPurchases.buyer_id} LIMIT 1)`,
        seller_name: sql<string | null>`(SELECT full_name FROM users WHERE users.id = ${ilanPurchases.seller_id} LIMIT 1)`,
        seller_email: sql<string | null>`(SELECT email FROM users WHERE users.id = ${ilanPurchases.seller_id} LIMIT 1)`,
      })
      .from(ilanPurchases)
      .leftJoin(ilanlar, eq(ilanPurchases.ilan_id, ilanlar.id))
      .orderBy(desc(ilanPurchases.created_at))
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: sql<number>`COUNT(*)` }).from(ilanPurchases),
  ]);

  return { data, total: Number(countRow?.total ?? 0) };
}
