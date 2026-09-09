import { routeOptions1, routeOptions2, routeOptions3, routeOptions4, routeOptions5, routeOptions6, routeOptions7 } from './public-route-options';
// src/modules/ilanlar/router.ts
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { authSecurity, fromZodSchema, idParamsSchema, okResponseSchema } from "@/modules/_shared";
import {
  listIlans, getIlan, listMyIlans, createIlan, updateIlan, updateStatus, deleteIlan,
} from "./controller";
import { createIlanSchema, searchIlansSchema, updateIlanSchema, updateIlanStatusSchema } from "./validation";
export async function registerIlanlar(app: FastifyInstance) {
  const B = '/ilanlar';
  app.get(B, routeOptions1, listIlans);
  app.get(`${B}/:id`, routeOptions2, getIlan);
  app.get(`${B}/my`, routeOptions3, listMyIlans);
  app.post(B, routeOptions4, createIlan);
  app.put(`${B}/:id`, routeOptions5, updateIlan);
  app.patch(`${B}/:id/status`, routeOptions6, updateStatus);
  app.delete(`${B}/:id`, routeOptions7, deleteIlan);
}
