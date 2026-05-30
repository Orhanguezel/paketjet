// src/modules/ilanlar/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  text,
  decimal,
  tinyint,
  int,
  datetime,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";

// 1. İlanlar
export const ilanlar = mysqlTable(
  "ilanlar",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),

    slug: varchar("slug", { length: 255 }).notNull().default(""),

    // Güzergah
    from_city: varchar("from_city", { length: 128 }).notNull(),
    to_city: varchar("to_city", { length: 128 }).notNull(),
    from_district: varchar("from_district", { length: 128 }),
    to_district: varchar("to_district", { length: 128 }),
    departure_date: datetime("departure_date", { fsp: 3 }).notNull(),
    arrival_date: datetime("arrival_date", { fsp: 3 }),

    // Kapasite & Fiyat
    total_capacity_kg: decimal("total_capacity_kg", { precision: 10, scale: 2 }).notNull(),
    available_capacity_kg: decimal("available_capacity_kg", { precision: 10, scale: 2 }).notNull(),
    price_per_kg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("TRY"),
    is_negotiable: tinyint("is_negotiable").notNull().default(0),

    // Araç & İçerik
    vehicle_type: varchar("vehicle_type", { length: 50 }).notNull().default("car"),
    // van | truck | motorcycle | car | other
    title: varchar("title", { length: 255 }),
    description: text("description"),

    // İletişim (lead-reveal: yalnızca satın alma sonrası açılır)
    contact_phone: varchar("contact_phone", { length: 50 }).notNull(),
    contact_email: varchar("contact_email", { length: 255 }),
    contact_name: varchar("contact_name", { length: 160 }),
    contact_address: text("contact_address"),

    // Ürün değeri (ihtilaf tavanı — validation'da zorunlu, DB'de geçiş için nullable)
    estimated_value: decimal("estimated_value", { precision: 12, scale: 2 }),
    estimated_value_currency: varchar("estimated_value_currency", { length: 10 }).notNull().default("TRY"),

    // İçerik onayı (yasaklı madde beyanı — HMK delil)
    content_declared: tinyint("content_declared").notNull().default(0),
    content_declared_at: datetime("content_declared_at", { fsp: 3 }),
    content_declared_ip: varchar("content_declared_ip", { length: 64 }),

    // Durum: active | sold | paused | expired | removed
    status: varchar("status", { length: 50 }).notNull().default("active"),
    sold_at: datetime("sold_at", { fsp: 3 }),
    sold_to_user_id: char("sold_to_user_id", { length: 36 }),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    index("ilanlar_slug_idx").on(t.slug),
    index("ilanlar_user_id_idx").on(t.user_id),
    index("ilanlar_status_idx").on(t.status),
    index("ilanlar_from_city_idx").on(t.from_city),
    index("ilanlar_to_city_idx").on(t.to_city),
    index("ilanlar_departure_idx").on(t.departure_date),
    foreignKey({
      columns: [t.user_id],
      foreignColumns: [users.id],
      name: "fk_ilanlar_user",
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

// 2. İlan Fotoğrafları
export const ilanPhotos = mysqlTable(
  "ilan_photos",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    ilan_id: char("ilan_id", { length: 36 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    order: int("order").notNull().default(0),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    index("ilan_photos_ilan_id_idx").on(t.ilan_id),
    foreignKey({
      columns: [t.ilan_id],
      foreignColumns: [ilanlar.id],
      name: "fk_ilan_photos_ilan",
    }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export type Ilan = typeof ilanlar.$inferSelect;
export type NewIlan = typeof ilanlar.$inferInsert;
export type IlanPhoto = typeof ilanPhotos.$inferSelect;
export type NewIlanPhoto = typeof ilanPhotos.$inferInsert;
