import { routeOptions1, routeOptions2, routeOptions3, routeOptions4, routeOptions5, routeOptions6 } from './public-route-options';
// ===================================================================
// FILE: src/modules/notifications/router.ts
// ===================================================================
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
const B = "/notifications";
export async function registerNotifications(app: FastifyInstance) {
  // Liste + unread sayısı
  app.get(B, routeOptions1, listNotifications);
  app.get(`${B}/unread-count`, routeOptions2, getUnreadCount);
  // CRUD / aksiyonlar
  app.post(B, routeOptions3, createNotificationHandler);
  app.patch(`${B}/:id`, routeOptions4, markNotificationRead);
  app.post(`${B}/mark-all-read`, routeOptions5, markAllRead);
  app.delete(`${B}/:id`, routeOptions6, deleteNotification);
}
