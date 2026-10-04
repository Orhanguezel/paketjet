import { afterAll, describe, expect, it } from "bun:test";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/modules/auth/schema";
import { ilanlar } from "@/modules/ilanlar";
import { apiKeys } from "@/modules/partner-api";
import { authHeaders, closeTestApp, getTestApp, randomEmail, registerUser } from "./setup";
afterAll(closeTestApp);

const B = "/api/v1/partner/listings";
const future = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
const listing = (extra: Record<string, unknown> = {}) => ({ from_city: "İstanbul", to_city: "Ankara", departure_date: future(3), vehicle_type: "van", total_capacity_kg: 500, price_per_kg: 4, currency: "TRY", contact_phone: "+90 555 111 22 33", contact_name: "Sefer Masası", title: "İstanbul-Ankara düzenli sefer", ...extra });

async function account() {
  const app = await getTestApp();
  const u = await registerUser(app, { email: randomEmail(), password: "Test1234!" });
  const res = await app.inject({ method: "POST", url: "/api/me/api-keys", headers: authHeaders(u.token!), payload: { name: "ERP entegrasyonu" } });
  expect(res.statusCode).toBe(201);
  const { key, id } = res.json() as { key: string; id: string };
  return { app, token: u.token!, userId: u.body.user.id as string, key, keyId: id, h: { authorization: `Bearer ${key}` } };
}

describe("api keys", () => {
  it("shows the key once, stores only a hash, enforces the limit and revocation", async () => {
    const a = await account();
    expect(a.key).toMatch(/^pj_live_[A-Za-z0-9_-]{43}$/);
    const list = await a.app.inject({ method: "GET", url: "/api/me/api-keys", headers: authHeaders(a.token) });
    expect(list.body).not.toContain(a.key);
    expect(list.json().data[0]).toMatchObject({ name: "ERP entegrasyonu", revoked_at: null });
    const [row] = await db.select().from(apiKeys).where(eq(apiKeys.id, a.keyId));
    expect(row!.key_hash).not.toContain(a.key);
    for (let i = 0; i < 4; i++) expect((await a.app.inject({ method: "POST", url: "/api/me/api-keys", headers: authHeaders(a.token), payload: { name: `k${i}` } })).statusCode).toBe(201);
    expect((await a.app.inject({ method: "POST", url: "/api/me/api-keys", headers: authHeaders(a.token), payload: { name: "fazla" } })).statusCode).toBe(409);
    expect((await a.app.inject({ method: "GET", url: B, headers: a.h })).statusCode).toBe(200);
    expect((await a.app.inject({ method: "DELETE", url: `/api/me/api-keys/${a.keyId}`, headers: authHeaders(a.token) })).statusCode).toBe(200);
    expect((await a.app.inject({ method: "GET", url: B, headers: a.h })).json()).toMatchObject({ error: { code: "api_key_invalid" } });
  });

  it("keys and sessions do not cross: no key, a JWT, or a key on a session endpoint are all rejected", async () => {
    const a = await account();
    expect((await a.app.inject({ method: "GET", url: B })).statusCode).toBe(401);
    expect((await a.app.inject({ method: "GET", url: B, headers: authHeaders(a.token) })).statusCode).toBe(401);
    expect((await a.app.inject({ method: "GET", url: B, headers: { authorization: "Bearer pj_live_yanlis" } })).statusCode).toBe(401);
    expect((await a.app.inject({ method: "GET", url: "/api/auth/user", headers: a.h })).statusCode).toBe(401);
    expect((await a.app.inject({ method: "GET", url: B, headers: { "x-api-key": a.key } })).statusCode).toBe(200);
    await db.update(users).set({ is_active: 0 }).where(eq(users.id, a.userId));
    expect((await a.app.inject({ method: "GET", url: B, headers: a.h })).statusCode).toBe(403);
  });
});

describe("partner listings", () => {
  it("creates listings that wait for approval; a repeated external_ref never duplicates", async () => {
    const a = await account();
    const first = await a.app.inject({ method: "POST", url: B, headers: a.h, payload: listing({ external_ref: "SEFER-1001" }) });
    expect(first.statusCode).toBe(201);
    expect(first.json()).toMatchObject({ status: "pending_approval", external_ref: "SEFER-1001", url: null, total_capacity_kg: 500 });
    const again = await a.app.inject({ method: "POST", url: B, headers: a.h, payload: listing({ external_ref: "SEFER-1001", title: "farkli" }) });
    expect(again.statusCode).toBe(200);
    expect(again.headers["idempotent-replay"]).toBe("true");
    expect(again.json().id).toBe(first.json().id);
    expect(await db.select().from(ilanlar).where(and(eq(ilanlar.user_id, a.userId), eq(ilanlar.external_ref, "SEFER-1001")))).toHaveLength(1);
    const byRef = await a.app.inject({ method: "GET", url: `${B}?external_ref=SEFER-1001`, headers: a.h });
    expect(byRef.json()).toMatchObject({ total: 1 });
    expect((await a.app.inject({ method: "POST", url: B, headers: a.h, payload: listing({ departure_date: "2020-01-01T00:00:00Z" }) })).statusCode).toBe(400);
    expect((await a.app.inject({ method: "POST", url: B, headers: a.h, payload: listing({ external_ref: "boşluklu ref" }) })).statusCode).toBe(400);
  });

  it("only the owner can read or change a listing; update, status and delete follow the site rules", async () => {
    const a = await account(), b = await account();
    const id = (await a.app.inject({ method: "POST", url: B, headers: a.h, payload: listing() })).json().id as string;
    expect((await b.app.inject({ method: "GET", url: `${B}/${id}`, headers: b.h })).statusCode).toBe(404);
    expect((await b.app.inject({ method: "PATCH", url: `${B}/${id}`, headers: b.h, payload: { title: "ele gecir" } })).statusCode).toBe(404);
    const upd = await a.app.inject({ method: "PATCH", url: `${B}/${id}`, headers: a.h, payload: { total_capacity_kg: 750 } });
    expect(upd.json()).toMatchObject({ total_capacity_kg: 750, status: "pending_approval" });
    expect((await a.app.inject({ method: "POST", url: `${B}/${id}/status`, headers: a.h, payload: { status: "active" } })).statusCode).toBe(400);
    expect((await a.app.inject({ method: "POST", url: `${B}/${id}/status`, headers: a.h, payload: { status: "paused" } })).json()).toMatchObject({ status: "paused" });
    expect((await a.app.inject({ method: "DELETE", url: `${B}/${id}`, headers: a.h })).statusCode).toBe(200);
    expect((await a.app.inject({ method: "GET", url: `${B}/${id}`, headers: a.h })).json()).toMatchObject({ status: "removed" });
  });
});
