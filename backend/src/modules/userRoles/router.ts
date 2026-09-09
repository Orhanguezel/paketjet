import { routeOptions1, routeOptions2, routeOptions3 } from './public-route-options';
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";
import {
  listUserRoles,
  createUserRole,
  deleteUserRole,
} from "./controller";
export async function registerUserRoles(app: FastifyInstance) {
  const B = "/user_roles";
  // Public list (nav bar check) - limit + rateLimit ekleyelim
  app.get(`${B}`,
    routeOptions1,
    listUserRoles
  );
  // Yönetim uçları: admin zorunlu
  app.post(`${B}`,
    routeOptions2,
    createUserRole
  );
  app.delete(`${B}/:id`,
    routeOptions3,
    deleteUserRole
  );
}
