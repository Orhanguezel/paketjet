import type {RouteShorthandOptions} from 'fastify';
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import {
  listNotifications,
  getUnreadCount,
  createNotificationHandler,
  markNotificationRead,
  markAllRead,
  deleteNotification,
} from "./controller";
export const routeOptions1: RouteShorthandOptions = { preHandler: [requireAuth] };
export const routeOptions2: RouteShorthandOptions = { preHandler: [requireAuth] };
export const routeOptions3: RouteShorthandOptions = { preHandler: [requireAuth] };
export const routeOptions4: RouteShorthandOptions = { preHandler: [requireAuth] };
export const routeOptions5: RouteShorthandOptions = { preHandler: [requireAuth] };
export const routeOptions6: RouteShorthandOptions = { preHandler: [requireAuth] };