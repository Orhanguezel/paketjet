import type {RouteShorthandOptions} from 'fastify';
import type { FastifyInstance } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { authSecurity, fromZodSchema, idParamsSchema, okResponseSchema } from "@/modules/_shared";
import {
  listIlans, getIlan, listMyIlans, createIlan, updateIlan, updateStatus, deleteIlan,
} from "./controller";
import { createIlanSchema, searchIlansSchema, updateIlanSchema, updateIlanStatusSchema } from "./validation";
export const routeOptions1: RouteShorthandOptions = {
    schema: { tags: ['ilanlar'], summary: 'Ilanlari listele', querystring: fromZodSchema(searchIlansSchema, 'SearchIlansQuery'), response: { 200: okResponseSchema } },
  };
export const routeOptions2: RouteShorthandOptions = {
    schema: { tags: ['ilanlar'], summary: 'Ilan detayi (slug veya UUID)', params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, response: { 200: okResponseSchema } },
  };
export const routeOptions3: RouteShorthandOptions = {
    preHandler: [requireAuth],
    schema: { tags: ['ilanlar'], summary: 'Kullanicinin ilanlari', security: authSecurity, response: { 200: okResponseSchema } },
  };
export const routeOptions4: RouteShorthandOptions = {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Yeni ilan olustur', security: authSecurity, body: fromZodSchema(createIlanSchema, 'CreateIlanBody'), response: { 201: okResponseSchema } },
  };
export const routeOptions5: RouteShorthandOptions = {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan guncelle', security: authSecurity, params: idParamsSchema, body: fromZodSchema(updateIlanSchema, 'UpdateIlanBody'), response: { 200: okResponseSchema } },
  };
export const routeOptions6: RouteShorthandOptions = {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan durumunu guncelle', security: authSecurity, params: idParamsSchema, body: fromZodSchema(updateIlanStatusSchema, 'UpdateIlanStatusBody'), response: { 200: okResponseSchema } },
  };
export const routeOptions7: RouteShorthandOptions = {
    preHandler: [requireAuth],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['ilanlar'], summary: 'Ilan sil', security: authSecurity, params: idParamsSchema, response: { 200: okResponseSchema } },
  };