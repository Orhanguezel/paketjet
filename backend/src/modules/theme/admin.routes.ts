// =============================================================
// FILE: src/modules/theme/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { adminGetTheme, adminUpdateTheme, adminResetTheme } from './admin.controller';
import { adminGetScopedTheme, adminUpdateScopedTheme, adminResetScopedTheme } from './scoped.controller';

export async function registerThemeAdmin(app: FastifyInstance) {
  const B = '/theme';
  app.get(`${B}`, adminGetTheme);
  app.put(`${B}`, adminUpdateTheme);
  app.post(`${B}/reset`, adminResetTheme);
  app.get(`${B}/:scope`, adminGetScopedTheme);
  app.put(`${B}/:scope`, adminUpdateScopedTheme);
  app.post(`${B}/:scope/reset`, adminResetScopedTheme);
}
