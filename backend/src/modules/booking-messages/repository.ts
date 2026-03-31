// src/modules/booking-messages/repository.ts
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { bookingMessages } from "./schema";
import { users } from "../auth/schema";

export async function repoGetMessagesByBooking(bookingId: string) {
  return db.select({
    id: bookingMessages.id,
    booking_id: bookingMessages.booking_id,
    sender_id: bookingMessages.sender_id,
    sender_name: users.full_name,
    message: bookingMessages.message,
    is_system: bookingMessages.is_system,
    read_at: bookingMessages.read_at,
    created_at: bookingMessages.created_at,
  })
    .from(bookingMessages)
    .leftJoin(users, eq(bookingMessages.sender_id, users.id))
    .where(eq(bookingMessages.booking_id, bookingId))
    .orderBy(bookingMessages.created_at);
}

export async function repoCreateMessage(bookingId: string, senderId: string, message: string, isSystem = false) {
  const id = randomUUID();
  await db.insert(bookingMessages).values({ id, booking_id: bookingId, sender_id: senderId, message, is_system: isSystem ? 1 : 0 });
  return { id, booking_id: bookingId, sender_id: senderId, message, is_system: isSystem ? 1 : 0, read_at: null, created_at: new Date().toISOString() };
}

export async function repoMarkMessagesRead(bookingId: string, userId: string) {
  await db.update(bookingMessages).set({ read_at: new Date() })
    .where(and(
      eq(bookingMessages.booking_id, bookingId),
      isNull(bookingMessages.read_at),
      sql`${bookingMessages.sender_id} != ${userId}`,
    ));
}

export async function repoCountUnreadMessages(bookingId: string, userId: string): Promise<number> {
  const [row] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(bookingMessages)
    .where(and(
      eq(bookingMessages.booking_id, bookingId),
      isNull(bookingMessages.read_at),
      sql`${bookingMessages.sender_id} != ${userId}`,
    ));
  return Number(row?.count ?? 0);
}
