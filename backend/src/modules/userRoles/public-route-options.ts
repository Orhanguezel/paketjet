import type {RouteShorthandOptions} from 'fastify';
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";
import {
  listUserRoles,
  createUserRole,
  deleteUserRole,
} from "./controller";
export const routeOptions1: RouteShorthandOptions = { config: { rateLimit: { max: 60, timeWindow: '1 minute' } } };
export const routeOptions2: RouteShorthandOptions = { preHandler: [requireAuth, requireAdmin],
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } } };
export const routeOptions3: RouteShorthandOptions = { preHandler: [requireAuth, requireAdmin],
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } } };