import type {RouteShorthandOptions} from 'fastify';
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
  const signupSchema = fromZodSchema(signupBody, 'AuthSignupBody');
  const tokenSchema = fromZodSchema(tokenBody, 'AuthTokenBody');
  const updateSchema = fromZodSchema(updateBody, 'AuthUpdateBody');
  const resetRequestSchema = fromZodSchema(passwordResetRequestBody, 'AuthPasswordResetRequestBody');
  const resetConfirmSchema = fromZodSchema(passwordResetConfirmBody, 'AuthPasswordResetConfirmBody');
  const googleSchema = fromZodSchema(googleBody, 'AuthGoogleBody');
export const routeOptions1: RouteShorthandOptions = {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Yeni kullanici kaydi', body: signupSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions2: RouteShorthandOptions = {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Yeni kullanici kaydi (alias)', body: signupSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions3: RouteShorthandOptions = {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Email ve parola ile giris', body: tokenSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions4: RouteShorthandOptions = {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Email ve parola ile giris (alias)', body: tokenSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions5: RouteShorthandOptions = {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Google ile giris (id_token)', body: googleSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions6: RouteShorthandOptions = {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Refresh token yenile', response: { 200: okResponseSchema } },
  };
export const routeOptions7: RouteShorthandOptions = {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Sifre sifirlama baglantisi iste', body: resetRequestSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions8: RouteShorthandOptions = {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Sifre sifirlama tamamla', body: resetConfirmSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions9: RouteShorthandOptions = {
    preHandler: [requireAuth],
    schema: { tags: ['auth'], summary: 'Mevcut kullanici bilgisi', security: authSecurity, response: { 200: okResponseSchema } },
  };
export const routeOptions10: RouteShorthandOptions = {
    schema: { tags: ['auth'], summary: 'Auth durumu', response: { 200: okResponseSchema } },
  };
export const routeOptions11: RouteShorthandOptions = {
    preHandler: [requireAuth],
    schema: { tags: ['auth'], summary: 'Kullanici bilgisi guncelle', security: authSecurity, body: updateSchema, response: { 200: okResponseSchema } },
  };
export const routeOptions12: RouteShorthandOptions = {
    preHandler: [requireAuth],
    schema: { tags: ['auth'], summary: 'Oturumu kapat', security: authSecurity, response: { 200: okResponseSchema } },
  };