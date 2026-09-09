import { routeOptions1, routeOptions2, routeOptions3, routeOptions4, routeOptions5, routeOptions6, routeOptions7, routeOptions8, routeOptions9, routeOptions10, routeOptions11, routeOptions12 } from './public-route-options';
import { requireAuth } from "@/common/middleware/auth";
import type { FastifyInstance } from 'fastify';
import { authSecurity, fromZodSchema, okResponseSchema } from '@/modules/_shared';
import {
  googleBody,
  passwordResetConfirmBody,
  passwordResetRequestBody,
  signupBody,
  tokenBody,
  updateBody,
} from './validation';
import { signup, token, refresh, passwordResetRequest, passwordResetConfirm, me, status, update, logout } from './controller';
import { googleAuth } from './google.controller';
export async function registerAuth(app: FastifyInstance) {
  const B = '/auth';
  app.post(`${B}/signup`, routeOptions1, signup);
  app.post(`${B}/register`, routeOptions2, signup);
  app.post(`${B}/token`, routeOptions3, token);
  app.post(`${B}/login`, routeOptions4, token);
  app.post(`${B}/google`, routeOptions5, googleAuth);
  app.post(`${B}/token/refresh`, routeOptions6, refresh);
  app.post(`${B}/password-reset/request`, routeOptions7, passwordResetRequest);
  app.post(`${B}/password-reset/confirm`, routeOptions8, passwordResetConfirm);
  app.get(`${B}/user`, routeOptions9, me);
  app.get(`${B}/status`, routeOptions10, status);
  app.put(`${B}/user`, routeOptions11, update);
  app.post(`${B}/logout`, routeOptions12, logout);
}
