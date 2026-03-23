// src/modules/carriers/helpers/repository.ts
import { and, eq, like, sql, type SQL } from "drizzle-orm";
import { users } from "@/modules/auth";
import { userRoles } from "@/modules/userRoles";

export type CarriersListParams = {
  search?: string;
  is_active?: boolean;
  has_active_ilan?: boolean;
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

  return and(...conditions) as SQL;
}
