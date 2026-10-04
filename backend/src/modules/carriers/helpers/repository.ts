// src/modules/carriers/helpers/repository.ts
import { and, eq, like, sql, type SQL } from "drizzle-orm";
import { users } from "@/modules/auth";
import { userRoles } from "@/modules/userRoles";

export type CarriersListParams = {
  search?: string;
  is_active?: boolean;
  has_active_ilan?: boolean;
  identity?: "none" | "incomplete" | "pending" | "approved" | "rejected";
  limit: number;
  offset: number;
};

export function buildCarriersWhere(params: CarriersListParams): SQL {
  const conditions: SQL[] = [eq(userRoles.role, "carrier")];

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`;
    conditions.push(
      sql`(
        ${users.full_name} LIKE ${q}
        OR ${users.email} LIKE ${q}
        OR ${users.phone} LIKE ${q}
      )`,
    );
  }

  if (typeof params.is_active === "boolean") {
    conditions.push(eq(users.is_active, params.is_active ? 1 : 0));
  }

  if (typeof params.has_active_ilan === "boolean") {
    conditions.push(
      params.has_active_ilan
        ? sql`EXISTS (
            SELECT 1 FROM ilanlar i
            WHERE i.user_id = ${users.id} AND i.status = 'active'
          )`
        : sql`NOT EXISTS (
            SELECT 1 FROM ilanlar i
            WHERE i.user_id = ${users.id} AND i.status = 'active'
          )`,
    );
  }

  if (params.identity) conditions.push(identityCondition(params.identity));

  return and(...conditions) as SQL;
}

/** Kimlik durumu filtresi; karar mantığı identity modülündeki özetle aynıdır
 * (biri reddedildiyse reddedildi; iki yüz yoksa eksik; ikisi onaylıysa onaylandı). */
function identityCondition(filter: NonNullable<CarriersListParams["identity"]>): SQL {
  const docs = sql`(SELECT COUNT(*) FROM identity_documents d WHERE d.user_id = ${users.id})`;
  const approved = sql`(SELECT COUNT(*) FROM identity_documents d WHERE d.user_id = ${users.id} AND d.status = 'approved')`;
  const rejected = sql`EXISTS (SELECT 1 FROM identity_documents d WHERE d.user_id = ${users.id} AND d.status = 'rejected')`;
  switch (filter) {
    case "none": return sql`${docs} = 0`;
    case "rejected": return rejected;
    case "incomplete": return sql`(${docs} = 1 AND NOT ${rejected})`;
    case "approved": return sql`${approved} = 2`;
    case "pending": return sql`(${docs} = 2 AND ${approved} < 2 AND NOT ${rejected})`;
  }
}
