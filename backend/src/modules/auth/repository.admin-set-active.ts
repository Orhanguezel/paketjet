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

export async function repoAdminSetActive(id: string, active: boolean) {
  await db
    .update(users)
    .set({
      is_active: active ? 1 : 0,
      ...(active ? { email_verified: 1 } : {}),
      updated_at: new Date(),
    })
    .where(eq(users.id, id));
}
export async function repoAdminSetRoles(id: string, roles: RoleName[]) {
  await db.transaction(async (tx) => {
    await tx.delete(userRoles).where(eq(userRoles.user_id, id));
    if (roles.length > 0) {
      await tx.insert(userRoles).values(roles.map((r) => ({ id: randomUUID(), user_id: id, role: r })));
    }
  });
}
export async function repoAdminSetPassword(id: string, password: string) {
  const password_hash = await argonHash(password);
  await db
    .update(users)
    .set({ password_hash, is_active: 1, email_verified: 1, updated_at: new Date() })
    .where(eq(users.id, id));
}
export async function repoAdminDeleteUser(id: string) {
  await db.transaction(async (tx) => {
    await tx.delete(refresh_tokens).where(eq(refresh_tokens.user_id, id));
    await tx.delete(userRoles).where(eq(userRoles.user_id, id));
    await tx.delete(profiles).where(eq(profiles.id, id));
    await tx.delete(users).where(eq(users.id, id));
  });
}