import type { FastifyInstance } from 'fastify';
import { publicGetTheme } from './admin.controller';
import { publicGetScopedTheme } from './scoped.controller';

export async function registerTheme(app: FastifyInstance) {
  const B = '/theme';
  app.get(`${B}`, publicGetTheme);
  app.get(`${B}/:scope`, publicGetScopedTheme);
}
