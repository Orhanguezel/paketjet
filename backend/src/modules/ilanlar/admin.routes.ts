// =============================================================
// FILE: src/modules/ilanlar/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminListIlans, adminGetIlan, adminUpdateIlanStatus, adminDeleteIlan } from './admin.controller';

export async function registerIlanlarAdmin(app: FastifyInstance) {
  const B = '/ilanlar';
  app.get(`${B}`, adminListIlans);
  app.get(`${B}/:id`, adminGetIlan);
  app.patch(`${B}/:id/status`, adminUpdateIlanStatus);
  app.delete(`${B}/:id`, adminDeleteIlan);
}
