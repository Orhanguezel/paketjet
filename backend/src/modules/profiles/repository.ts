// =============================================================
// FILE: src/modules/profiles/repository.ts
// =============================================================
import { users } from "../auth/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { buildProfileUpdatePatch, buildProfileUpsertInsert } from "./helpers";
import { profiles, type ProfileInsert } from "./schema";

export async function repoGetProfileById(userId: string) {
  const [row] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  return row ?? null;
}

export async function repoUpsertProfile(userId: string, data: Partial<ProfileInsert>) {
  await db.transaction(async (tx) => {
    const existing = await tx.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, userId)).limit(1);
    if (existing.length) await tx.update(profiles).set(buildProfileUpdatePatch(data)).where(eq(profiles.id, userId));
    else await tx.insert(profiles).values(buildProfileUpsertInsert(userId, data));
    const userPatch: { full_name?: string | null; phone?: string | null } = {};
    if (data.full_name !== undefined) userPatch.full_name = data.full_name;
    if (data.phone !== undefined) userPatch.phone = data.phone;
    if (Object.keys(userPatch).length) await tx.update(users).set(userPatch).where(eq(users.id, userId));
  });

  return repoGetProfileById(userId);
}
