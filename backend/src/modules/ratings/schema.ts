// src/modules/ratings/schema.ts
import {
  mysqlTable,
  char,
  tinyint,
  text,
  datetime,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { bookings } from "../bookings/schema";

export const ratings = mysqlTable(
  "ratings",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    booking_id: char("booking_id", { length: 36 }).notNull(),
    customer_id: char("customer_id", { length: 36 }).notNull(),
    carrier_id: char("carrier_id", { length: 36 }).notNull(),

    score: tinyint("score").notNull(), // 1–5
    comment: text("comment"),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    uniqueIndex("ratings_booking_id_unique").on(t.booking_id), // 1 rating per booking
    index("ratings_carrier_id_idx").on(t.carrier_id),
    index("ratings_customer_id_idx").on(t.customer_id),
    foreignKey({ columns: [t.booking_id], foreignColumns: [bookings.id], name: "fk_ratings_booking" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.customer_id], foreignColumns: [users.id], name: "fk_ratings_customer" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.carrier_id], foreignColumns: [users.id], name: "fk_ratings_carrier" }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export type Rating = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;
