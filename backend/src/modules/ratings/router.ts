import {retiredOperation} from '../purchases/legacy.controller';
// src/modules/ratings/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { createRating, getBookingRating, getCarrierRatings } from "./controller";
import { registerPurchaseRatings } from './purchase.routes';

export async function registerRatings(app: FastifyInstance) {
  registerPurchaseRatings(app);
  const B = "/ratings";

  // Auth gerekli
  app.post(
    B,
    { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    retiredOperation,
  );

  app.get(
    `${B}/booking/:bookingId`,
    { preHandler: [requireAuth] },
    getBookingRating,
  );

  // Herkese açık
  app.get(`${B}/carrier/:carrierId`, getCarrierRatings);
}
