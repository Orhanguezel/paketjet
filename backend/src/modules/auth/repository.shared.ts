import { db } from '@/db/client';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { hash as argonHash } from 'argon2';
import { users, refresh_tokens } from './schema';
import { userRoles } from '@/modules/userRoles';
import { profiles } from '@/modules/profiles';
import { notifications, type NotificationInsert } from '@/modules/notifications';
import { getPrimaryRole, type RoleName } from '@/modules/userRoles';
import {
  buildAdminUserRoleRows,
  buildAdminUsersWhere,
  buildRefreshExpiryDate,
  createRefreshTokenRaw,
  parseRefreshTokenJti,
  REFRESH_MAX_AGE,
  resolveAdminUsersSort,
  sha256,
} from './helpers';
export type UserRow = typeof users.$inferSelect;
