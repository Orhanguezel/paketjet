import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { env } from "@/core/env";
import { db } from "@/db/client";
import { users } from "@/modules/auth/schema";
import { closeTestApp, getTestApp, randomEmail, registerUser } from "./setup";

const mutableEnv = env as unknown as Record<string, string>;
const original = mutableEnv.GOOGLE_CLIENT_ID;
let payload: Record<string, unknown> | null = null;
const verify = spyOn(OAuth2Client.prototype, "verifyIdToken").mockImplementation((async (opts: { audience?: string }) => {
  if (!payload || opts.audience !== "test-client.apps.googleusercontent.com") throw new Error("bad token");
  return { getPayload: () => payload };
}) as never);
afterAll(async () => { verify.mockRestore(); mutableEnv.GOOGLE_CLIENT_ID = original; await closeTestApp(); });
beforeEach(() => { mutableEnv.GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com"; payload = null; });

const post = async (body: Record<string, unknown>) => (await getTestApp()).inject({ method: "POST", url: "/api/auth/google", payload: { id_token: "x".repeat(40), ...body } });

describe("google login", () => {
  it("is closed and hides the button without a client id", async () => {
    mutableEnv.GOOGLE_CLIENT_ID = "";
    const app = await getTestApp();
    expect((await app.inject({ method: "GET", url: "/api/auth/google-config" })).json()).toEqual({ configured: false, clientId: null });
    expect((await post({})).statusCode).toBe(503);
  });

  it("rejects forged tokens and unverified Google emails", async () => {
    expect((await post({})).json()).toMatchObject({ error: { message: "invalid_google_token" } });
    payload = { email: randomEmail(), email_verified: false, name: "X" };
    expect((await post({})).statusCode).toBe(403);
    payload = { email: randomEmail(), name: "X" }; // alan yoksa da kabul edilmez
    expect((await post({})).statusCode).toBe(403);
  });

  it("a new user must accept the terms and KVKK before an account is created", async () => {
    const email = randomEmail();
    payload = { email, email_verified: true, name: "Google Kullanici" };
    const first = await post({});
    expect(first.statusCode).toBe(409);
    expect(first.json()).toMatchObject({ error: { message: "consent_required" }, profile: { email } });
    expect(await db.select().from(users).where(eq(users.email, email))).toHaveLength(0);
    expect((await post({ rules_accepted: true })).statusCode).toBe(409);

    const ok = await post({ rules_accepted: true, kvkk_explicit_consent: true, role: "carrier" });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().user).toMatchObject({ email, role: "carrier" });
    expect(String(ok.headers["set-cookie"])).toContain("access_token=");
    const [row] = await db.select().from(users).where(eq(users.email, email));
    expect(row).toMatchObject({ email_verified: 1, kvkk_explicit_consent: 1 });
    expect(row!.rules_accepted_version).toBeTruthy();
    expect(row!.kvkk_consent_version).toBeTruthy();
    // ikinci giris onay istemez
    expect((await post({})).statusCode).toBe(200);
  });

  it("an existing account signs in with its verified Google email; disabled accounts stay closed", async () => {
    const email = randomEmail();
    const existing = await registerUser(await getTestApp(), { email, password: "Test1234!" });
    payload = { email: email.toUpperCase(), email_verified: true, name: "Var Olan" };
    const res = await post({});
    expect(res.statusCode).toBe(200);
    expect(res.json().user.id).toBe(existing.body.user.id);
    await db.update(users).set({ is_active: 0 }).where(eq(users.email, email));
    expect((await post({})).statusCode).toBe(403);
  });
});
