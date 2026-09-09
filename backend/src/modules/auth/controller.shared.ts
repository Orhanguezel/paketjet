import { requireAuth } from '@/common/middleware/auth';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { hash as argonHash } from 'argon2';
import { handleRouteError } from "@/modules/_shared";
import { getPrimaryRole } from '@/modules/userRoles';
import { sendWelcomeMail, sendPasswordChangedMail } from '@/modules/mail';
import { telegramNotify } from '@/modules/telegram';
import {
  signupBody,
  tokenBody,
  updateBody,
  passwordResetRequestBody,
  passwordResetConfirmBody,
} from './validation';
import {
  repoGetUserByEmail,
  repoGetUserById,
  repoCreateUser,
  repoUpdateUserEmail,
  repoUpdateUserPassword,
  repoUpdateLastSignIn,
  repoAssignRole,
  repoEnsureProfileRow,
  repoGetRefreshToken,
  repoRevokeRefreshToken,
  repoRevokeAllUserRefreshTokens,
  repoRotateRefreshToken,
  repoCreatePasswordChangedNotification,
} from './repository';
import {
  type Role,
  type JWTPayload,
  getJWTFromReq,
  bearerFrom,
  setAccessCookie,
  setRefreshCookie,
  clearAuthCookies,
  issueTokens,
  verifyPasswordSmart,
  parseAdminEmailAllowlist,
  ACCESS_MAX_AGE,
} from './helpers';
import { getSignupLegalConsentVersions } from './legal-consent';
export const adminEmails = parseAdminEmailAllowlist();
