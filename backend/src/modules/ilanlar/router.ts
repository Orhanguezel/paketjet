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

  app.get(B, {
    schema: { tags: ['ilanlar'], summary: 'Ilanlari listele', querystring: fromZodSchema(searchIlansSchema, 'SearchIlansQuery'), response: { 200: okResponseSchema } },
  }, listIlans);
  app.get(`${B}/:id`, {
    schema: { tags: ['ilanlar'], summary: 'Ilan detayi', params: idParamsSchema, response: { 200: okResponseSchema } },
  }, getIlan);
  app.get(`${B}/my`, {
    preHandler: [requireAuth],
    schema: { tags: ['ilanlar'], summary: 'Kullanicinin ilanlari', security: authSecurity, response: { 200: okResponseSchema } },
  }, listMyIlans);
  app.post(B, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Yeni ilan olustur', security: authSecurity, body: fromZodSchema(createIlanSchema, 'CreateIlanBody'), response: { 201: okResponseSchema } },
  }, createIlan);
  app.put(`${B}/:id`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan guncelle', security: authSecurity, params: idParamsSchema, body: fromZodSchema(updateIlanSchema, 'UpdateIlanBody'), response: { 200: okResponseSchema } },
  }, updateIlan);
  app.patch(`${B}/:id/status`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan durumunu guncelle', security: authSecurity, params: idParamsSchema, body: fromZodSchema(updateIlanStatusSchema, 'UpdateIlanStatusBody'), response: { 200: okResponseSchema } },
  }, updateStatus);
  app.delete(`${B}/:id`, {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan sil', security: authSecurity, params: idParamsSchema, response: { 200: okResponseSchema } },
  }, deleteIlan);
}
