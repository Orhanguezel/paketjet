// src/modules/disputes/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { getDispute, getIlanDispute, openDispute, openIlanDispute } from "./controller";

export async function registerDisputes(app: FastifyInstance) {
  const auth = { preHandler: [requireAuth] };
  app.post("/bookings/:id/dispute", auth, openDispute);
  app.get("/bookings/:id/dispute", auth, getDispute);
  app.post("/ilanlar/:id/dispute", auth, openIlanDispute);
  app.get("/ilanlar/:id/dispute", auth, getIlanDispute);
}
