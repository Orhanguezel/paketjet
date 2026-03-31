// src/modules/booking-messages/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { getMessages, sendMessage } from "./controller";

export async function registerBookingMessages(app: FastifyInstance) {
  const auth = { preHandler: [requireAuth] };
  app.get("/bookings/:id/messages", auth, getMessages);
  app.post("/bookings/:id/messages", auth, sendMessage);
}
