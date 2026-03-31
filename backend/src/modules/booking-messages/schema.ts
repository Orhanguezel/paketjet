// src/modules/booking-messages/schema.ts
import { mysqlTable, char, text, tinyint, datetime, index, foreignKey } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "../auth/schema";
import { bookings } from "../bookings/schema";

export const bookingMessages = mysqlTable(
  "booking_messages",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    booking_id: char("booking_id", { length: 36 }).notNull(),
    sender_id: char("sender_id", { length: 36 }).notNull(),
    message: text("message").notNull(),
    is_system: tinyint("is_system").notNull().default(0),
    read_at: datetime("read_at", { fsp: 3 }),
    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    index("idx_bm_booking").on(t.booking_id),
    index("idx_bm_sender").on(t.sender_id),
    foreignKey({ columns: [t.booking_id], foreignColumns: [bookings.id], name: "fk_bm_booking" }).onDelete("cascade").onUpdate("cascade"),
    foreignKey({ columns: [t.sender_id], foreignColumns: [users.id], name: "fk_bm_sender" }).onDelete("cascade").onUpdate("cascade"),
  ]
);

export type BookingMessage = typeof bookingMessages.$inferSelect;
export type NewBookingMessage = typeof bookingMessages.$inferInsert;
