// src/modules/ratings/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { createRating, getBookingRating, getCarrierRatings } from "./controller";

export async function registerRatings(app: FastifyInstance) {
  const B = "/ratings";

  // Auth gerekli
  app.post(
    B,
    { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    createRating,
  );

  app.get(
    `${B}/booking/:bookingId`,
    { preHandler: [requireAuth] },
    getBookingRating,
  );

  // Herkese açık
  app.get(`${B}/carrier/:carrierId`, getCarrierRatings);
}
