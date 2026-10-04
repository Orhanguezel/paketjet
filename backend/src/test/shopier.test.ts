import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createHmac } from "crypto";
import { env } from "@/core/env";
import { repoGetCreditBalance, repoGetCreditPackages, repoPurchaseIlan } from "@/modules/purchases/repository";
import { checkShopierOrder, createShopierCheckout, verifyShopierSignature } from "@/modules/purchases/shopier";
import { invalidateShopierConfig } from "@/modules/purchases/shopier-config";
import { buyer, declaration, listing } from "./purchase-fixtures";
import { authHeaders, closeTestApp, getTestApp, registerAdminUser } from "./setup";

const TOKEN = "test-webhook-token";
const mutableEnv = env as unknown as Record<string, string>;
const realFetch = globalThis.fetch;
const products = new Map<string, number>();
const orders = new Map<string, Record<string, unknown>>();
const deleted: string[] = [];
const refunds = new Map<string, Record<string, unknown>>();
const hooks: { id: string; event: string; url: string; token: string }[] = [];
let seq = 0;
const RUN = Date.now().toString(36);

beforeAll(() => {
  process.env.PAYMENT_PROVIDER = "shopier";
  Object.assign(mutableEnv, { SHOPIER_PAT: "pat", SHOPIER_WEBHOOK_TOKEN: TOKEN, SHOPIER_PRODUCT_IMAGE_URL: "https://example.test/logo.png" });
  invalidateShopierConfig();
  // Yalniz Shopier API sahte; app.inject fetch kullanmaz.
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input instanceof Request ? input.url : input));
    if (url.host === "cdn.shopier.app" && init?.method === "HEAD") return new Response(null, { status: 200 });
    if (url.host !== "api.shopier.com") return realFetch(input, init);
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
    const auth = new Headers(init?.headers).get("authorization");
    if (auth === "Bearer bad.pat.token") return json(401, { error: "unauthorized" });
    if (url.pathname === "/v1/shop/settings") return json(200, { name: "testshop", title: "Test Dukkan", url: "https://www.shopier.com/testshop" });
    if (url.pathname === "/v1/webhooks" && init?.method === "POST") { const b = JSON.parse(String(init.body)); const h = { id: `W${++seq}`, event: b.event, url: b.url, token: `tok-${seq}-${RUN}` }; hooks.push(h); return json(200, h); }
    if (url.pathname === "/v1/webhooks") return json(200, hooks.map(({ token: _t, ...h }) => h));
    if (url.pathname.startsWith("/v1/webhooks/") && init?.method === "DELETE") { const id = url.pathname.split("/").pop(); hooks.splice(hooks.findIndex((h) => h.id === id), 1); return json(200, {}); }
    if (init?.method === "POST" && url.pathname === "/v1/products") {
      const id = `P${Date.now()}${++seq}`;
      products.set(id, Number(JSON.parse(String(init.body)).priceData.price));
      return json(200, { id, url: `https://www.shopier.com/${id}`, media: [{ url: `https://cdn.shopier.app/pictures_large/test_${id}.png` }] });
    }
    if (init?.method === "POST" && url.pathname === "/v1/refunds") {
      const b = JSON.parse(String(init.body));
      const r = { id: `R${Date.now()}${++seq}`, status: "pending", orderId: b.orderId, total: b.amount, currency: "TRY", type: "full" };
      refunds.set(r.id, r);
      return json(200, r);
    }
    if (url.pathname.startsWith("/v1/refunds/")) { const r = refunds.get(url.pathname.split("/").pop()!); return r ? json(200, r) : json(404, { error: "notFound" }); }
    if (init?.method === "DELETE") { deleted.push(url.pathname.split("/").pop()!); return json(200, {}); }
    if (url.pathname === "/v1/orders") return json(200, [...orders.values()].filter((o) => (o.lineItems as { productId: string }[])[0].productId === url.searchParams.get("productId")));
    const order = orders.get(url.pathname.split("/").pop()!);
    return order ? json(200, order) : json(404, { error: "notFound" });
  }) as typeof fetch;
});
afterAll(async () => { globalThis.fetch = realFetch; process.env.PAYMENT_PROVIDER = "disabled"; await closeTestApp(); });

const paidOrder = (id: string, productId: string, total: number) => ({ id, paymentStatus: "paid", currency: "TRY", totals: { total: total.toFixed(2) }, lineItems: [{ productId, quantity: 1, total: total.toFixed(2) }] });
const sign = (raw: string) => createHmac("sha256", TOKEN).update(raw).digest("hex");
async function webhook(body: Record<string, unknown>, signature?: string, event = "order.created") {
  const raw = JSON.stringify(body);
  return (await getTestApp()).inject({ method: "POST", url: "/api/payments/shopier/webhook", headers: { "content-type": "application/json", "shopier-event": event, "shopier-signature": signature ?? sign(raw) }, payload: raw });
}
async function buyCredits(token: string) {
  const [pack] = await repoGetCreditPackages();
  const res = await (await getTestApp()).inject({ method: "POST", url: "/api/ilan-alma-hakki/satin-al", headers: authHeaders(token), payload: { package_key: pack!.key, terms_accepted: true } });
  expect(res.statusCode).toBe(200);
  return { ...(res.json() as { redirectUrl: string; conversationId: string; amount: number }), credits: pack!.credits };
}

describe("shopier pure checks", () => {
  it("accepts hex and base64 signatures, rejects tampering", () => {
    const sum = createHmac("sha256", TOKEN).update("{}");
    const hex = sum.digest("hex");
    expect(verifyShopierSignature("{}", hex, TOKEN)).toBe(true);
    expect(verifyShopierSignature("{}", Buffer.from(hex, "hex").toString("base64"), TOKEN)).toBe(true);
    expect(verifyShopierSignature("{ }", hex, TOKEN)).toBe(false);
    expect(verifyShopierSignature("{}", hex, "")).toBe(false);
  });
  it("requires paid, TRY, single exact product and exact amount", () => {
    const ok = paidOrder("O", "P", 50);
    expect(checkShopierOrder(ok, { productId: "P", amount: 50 }).ok).toBe(true);
    expect(checkShopierOrder({ ...ok, paymentStatus: "unpaid" }, { productId: "P", amount: 50 })).toEqual({ ok: false, reason: "unpaid" });
    expect(checkShopierOrder(ok, { productId: "X", amount: 50 })).toEqual({ ok: false, reason: "product" });
    expect(checkShopierOrder(ok, { productId: "P", amount: 49.99 })).toEqual({ ok: false, reason: "amount" });
    expect(checkShopierOrder({ ...ok, currency: "USD" }, { productId: "P", amount: 50 })).toEqual({ ok: false, reason: "currency" });
  });
});

describe("shopier product image readiness", () => {
  it("waits until both image sizes are available before returning the checkout URL", async () => {
    const seen: string[] = [];
    let largeChecks = 0;
    const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input instanceof Request ? input.url : input));
      seen.push(`${init?.method} ${url.pathname}`);
      if (url.pathname === "/v1/products") return new Response(JSON.stringify({ id: "P-ready", url: "https://www.shopier.com/P-ready", media: [{ url: "https://cdn.shopier.app/pictures_large/test.png" }] }), { status: 200 });
      if (url.pathname === "/pictures_large/test.png") return new Response(null, { status: ++largeChecks === 1 ? 404 : 200 });
      if (url.pathname === "/pictures_small/test.png") return new Response(null, { status: 200 });
      throw new Error(`unexpected request ${url}`);
    }) as typeof fetch;
    const product = await createShopierCheckout({ title: "Test", description: "Test", amount: 50 }, fetcher);
    expect(product.url).toBe("https://www.shopier.com/P-ready");
    expect(largeChecks).toBe(2);
    expect(seen).toContain("HEAD /pictures_small/test.png");
  });

  it("deletes a product whose image URL is missing", async () => {
    const seen: string[] = [];
    const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input instanceof Request ? input.url : input));
      seen.push(`${init?.method} ${url.pathname}`);
      if (init?.method === "POST") return new Response(JSON.stringify({ id: "P-broken", url: "https://www.shopier.com/P-broken", media: [] }), { status: 200 });
      if (init?.method === "DELETE") return new Response("{}", { status: 200 });
      throw new Error(`unexpected request ${url}`);
    }) as typeof fetch;
    await expect(createShopierCheckout({ title: "Test", description: "Test", amount: 50 }, fetcher)).rejects.toThrow("product_image_unavailable");
    expect(seen).toContain("DELETE /v1/products/P-broken");
  });
});

describe("shopier checkout over HTTP", () => {
  it("credits are granted once, only after the order is read back from the API", async () => {
    const user = await buyer();
    const before = await repoGetCreditBalance(user.id);
    const start = await buyCredits(user.token);
    const productId = start.redirectUrl.split("/").pop()!;
    expect(start.redirectUrl).toBe(`https://www.shopier.com/${productId}`);
    expect(products.get(productId)).toBe(start.amount);

    const forged = { id: "O-forged", lineItems: [{ productId }] };
    expect((await webhook(forged, "bad")).statusCode).toBe(401);
    expect((await webhook(forged)).statusCode).toBe(200); // API'de boyle siparis yok → yok sayilir, hak acilmaz
    expect(await repoGetCreditBalance(user.id)).toBe(before);

    orders.set(`O1-${RUN}`, paidOrder(`O1-${RUN}`, productId, start.amount));
    expect((await webhook({ id: `O1-${RUN}`, lineItems: [{ productId }] })).statusCode).toBe(200);
    expect((await webhook({ id: `O1-${RUN}`, lineItems: [{ productId }] })).statusCode).toBe(200);
    expect(await repoGetCreditBalance(user.id)).toBe(before + start.credits);
    expect(deleted).toContain(productId);
  });

  it("an underpaid order goes to review instead of granting access", async () => {
    const user = await buyer(), owner = await buyer();
    const ilanId = await listing(owner.id);
    const res = await (await getTestApp()).inject({ method: "POST", url: `/api/ilanlar/${ilanId}/satin-al/odeme`, headers: authHeaders(user.token), payload: declaration });
    expect(res.statusCode).toBe(200);
    const { redirectUrl, conversationId, amount } = res.json() as { redirectUrl: string; conversationId: string; amount: number };
    const productId = redirectUrl.split("/").pop()!;
    orders.set(`O2-${RUN}`, paidOrder(`O2-${RUN}`, productId, amount - 1));
    expect((await webhook({ id: `O2-${RUN}`, lineItems: [{ productId }] })).statusCode).toBe(200);
    const status = await (await getTestApp()).inject({ method: "GET", url: `/api/payments/${conversationId}`, headers: authHeaders(user.token) });
    expect(status.json()).toMatchObject({ state: "review", error_code: "shopier_amount" });
  });

  it("the buyer can reconcile a missed webhook; other users cannot", async () => {
    const user = await buyer(), other = await buyer();
    const before = await repoGetCreditBalance(user.id);
    const start = await buyCredits(user.token);
    const productId = start.redirectUrl.split("/").pop()!;
    const app = await getTestApp();
    const check = (token: string) => app.inject({ method: "POST", url: `/api/payments/${start.conversationId}/shopier/check`, headers: authHeaders(token) });
    expect((await check(user.token)).json()).toEqual({ state: "pending" });
    orders.set(`O3-${RUN}`, paidOrder(`O3-${RUN}`, productId, start.amount));
    expect((await check(other.token)).statusCode).toBe(404);
    expect((await check(user.token)).json()).toEqual({ state: "completed" });
    expect(await repoGetCreditBalance(user.id)).toBe(before + start.credits);
  });

  it("payments stay closed when Shopier is not fully configured", async () => {
    mutableEnv.SHOPIER_WEBHOOK_TOKEN = "";
    invalidateShopierConfig();
    try {
      const user = await buyer();
      const [pack] = await repoGetCreditPackages();
      const res = await (await getTestApp()).inject({ method: "POST", url: "/api/ilan-alma-hakki/satin-al", headers: authHeaders(user.token), payload: { package_key: pack!.key, terms_accepted: true } });
      expect(res.statusCode).toBe(503);
    } finally { mutableEnv.SHOPIER_WEBHOOK_TOKEN = TOKEN; invalidateShopierConfig(); }
  });
});

describe("shopier refunds", () => {
  async function paidCredits() {
    const user = await buyer();
    const start = await buyCredits(user.token);
    const productId = start.redirectUrl.split("/").pop()!;
    const orderId = `OR-${productId}`;
    orders.set(orderId, paidOrder(orderId, productId, start.amount));
    expect((await webhook({ id: orderId, lineItems: [{ productId }] })).statusCode).toBe(200);
    return { user, start, orderId };
  }
  const state = async (token: string, ref: string) => (await (await getTestApp()).inject({ method: "GET", url: `/api/payments/${ref}`, headers: authHeaders(token) })).json() as { state: string; error_code: string | null };

  it("admin refund revokes the purchased credits only after Shopier reports success, once", async () => {
    const app = await getTestApp(), admin = await registerAdminUser(app);
    const { user, start } = await paidCredits();
    const before = await repoGetCreditBalance(user.id);
    expect((await app.inject({ method: "POST", url: `/api/admin/payment-operations/${start.conversationId}/refund`, headers: authHeaders(user.token), payload: { note: "deneme iadesi" } })).statusCode).toBe(403);
    const res = await app.inject({ method: "POST", url: `/api/admin/payment-operations/${start.conversationId}/refund`, headers: authHeaders(admin.token!), payload: { note: "Test ödemesi iadesi" } });
    expect(res.statusCode).toBe(200);
    const { refundId } = res.json() as { refundId: string };
    expect((await state(user.token, start.conversationId)).state).toBe("refund_pending");
    expect(await repoGetCreditBalance(user.id)).toBe(before);
    expect((await app.inject({ method: "POST", url: `/api/admin/payment-operations/${start.conversationId}/refund`, headers: authHeaders(admin.token!), payload: { note: "Test ödemesi iadesi" } })).statusCode).toBe(409);

    refunds.set(refundId, { ...refunds.get(refundId)!, status: "succeeded" });
    expect((await webhook({ id: refundId }, undefined, "refund.updated")).statusCode).toBe(200);
    expect((await webhook({ id: refundId }, undefined, "refund.updated")).statusCode).toBe(200);
    expect((await state(user.token, start.conversationId)).state).toBe("refunded");
    expect(await repoGetCreditBalance(user.id)).toBe(before - start.credits);
  });

  it("a refund made in the Shopier panel also closes listing contact access", async () => {
    const user = await buyer(), owner = await buyer(), app = await getTestApp();
    const ilanId = await listing(owner.id);
    const pay = (await app.inject({ method: "POST", url: `/api/ilanlar/${ilanId}/satin-al/odeme`, headers: authHeaders(user.token), payload: declaration })).json() as { redirectUrl: string; conversationId: string; amount: number };
    const productId = pay.redirectUrl.split("/").pop()!, orderId = `OL-${productId}`;
    orders.set(orderId, paidOrder(orderId, productId, pay.amount));
    await webhook({ id: orderId, lineItems: [{ productId }] });
    const contact = () => app.inject({ method: "GET", url: `/api/ilanlar/${ilanId}/iletisim`, headers: authHeaders(user.token) });
    expect((await contact()).statusCode).toBe(200);
    const refundId = `RP-${productId}`;
    refunds.set(refundId, { id: refundId, status: "succeeded", orderId, total: pay.amount.toFixed(2), currency: "TRY", type: "full" });
    expect((await webhook({ id: refundId }, undefined, "refund.updated")).statusCode).toBe(200);
    expect((await state(user.token, pay.conversationId)).state).toBe("refunded");
    expect((await contact()).statusCode).not.toBe(200);
  });

  it("partial or failed refunds go to admin review without revoking anything", async () => {
    const { user, start, orderId } = await paidCredits();
    const before = await repoGetCreditBalance(user.id);
    const partial = `RX-${orderId}`;
    refunds.set(partial, { id: partial, status: "succeeded", orderId, total: (start.amount / 2).toFixed(2), currency: "TRY", type: "partial" });
    await webhook({ id: partial }, undefined, "refund.updated");
    expect(await state(user.token, start.conversationId)).toMatchObject({ state: "review", error_code: "shopier_partial_refund" });
    expect(await repoGetCreditBalance(user.id)).toBe(before);
  });

  it("credits already spent before the refund are not clawed back below zero and are flagged", async () => {
    const { user, start, orderId } = await paidCredits();
    const owner = await buyer();
    for (let i = 0; i < start.credits; i++) expect((await repoPurchaseIlan(await listing(owner.id), user.id, declaration, "127.0.0.1")).ok).toBe(true);
    const left = await repoGetCreditBalance(user.id);
    const refundId = `RS-${orderId}`;
    refunds.set(refundId, { id: refundId, status: "succeeded", orderId, total: start.amount.toFixed(2), currency: "TRY", type: "full" });
    await webhook({ id: refundId }, undefined, "refund.updated");
    expect(await state(user.token, start.conversationId)).toMatchObject({ state: "refunded", error_code: "refund_credits_already_used" });
    expect(await repoGetCreditBalance(user.id)).toBe(Math.max(0, left - start.credits));
  });
});

describe("shopier admin settings", () => {
  const base = "/api/admin/payment-settings/shopier";
  afterAll(async () => {
    const { db } = await import("@/db/client");
    const { siteSettings } = await import("@/modules/siteSettings");
    const { eq } = await import("drizzle-orm");
    await db.delete(siteSettings).where(eq(siteSettings.key, "payment.shopier"));
    invalidateShopierConfig();
  });

  it("never returns or stores the PAT in clear text, and rejects unusable keys", async () => {
    const app = await getTestApp(), admin = await registerAdminUser(app), h = authHeaders(admin.token!);
    const user = await buyer();
    expect((await app.inject({ method: "GET", url: base, headers: authHeaders(user.token) })).statusCode).toBe(403);
    expect((await app.inject({ method: "PUT", url: base, headers: h, payload: { pat: "not-a-jwt" } })).statusCode).toBe(400);
    expect((await app.inject({ method: "PUT", url: base, headers: h, payload: { pat: "bad.pat.token" } })).json()).toMatchObject({ error: { message: "shopier_pat_rejected" } });
    const pat = `aaa.${Buffer.from(JSON.stringify({ exp: 1948821851, scopes: ["orders:read"] })).toString("base64url")}.zzzz9876`;
    const res = await app.inject({ method: "PUT", url: base, headers: h, payload: { pat } });
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toContain(pat);
    expect(res.json()).toMatchObject({ pat: { set: true, source: "panel", last4: "9876", scopes: ["orders:read"] } });
    const { db } = await import("@/db/client");
    const { siteSettings } = await import("@/modules/siteSettings");
    const { eq } = await import("drizzle-orm");
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "payment.shopier"));
    expect(row!.value).not.toContain(pat);
    expect(row!.value).toContain("v1:");
    expect((await app.inject({ method: "GET", url: "/api/site_settings/payment.shopier?locale=*" })).statusCode).not.toBe(200);
  });

  it("the panel switch closes and reopens card payments", async () => {
    const app = await getTestApp(), admin = await registerAdminUser(app), h = authHeaders(admin.token!);
    expect((await app.inject({ method: "PUT", url: base, headers: h, payload: { card_enabled: false } })).json()).toMatchObject({ card_enabled: false, available: false });
    expect((await app.inject({ method: "GET", url: "/api/payments/availability" })).json()).toMatchObject({ enabled: false });
    expect((await app.inject({ method: "PUT", url: base, headers: h, payload: { card_enabled: true } })).json()).toMatchObject({ card_enabled: true, available: true });
    expect((await app.inject({ method: "GET", url: "/api/payments/availability" })).json()).toMatchObject({ enabled: true });
  });

  it("rebuilding webhooks stores fresh signing tokens that the webhook endpoint accepts", async () => {
    const app = await getTestApp(), admin = await registerAdminUser(app), h = authHeaders(admin.token!);
    const test = (await app.inject({ method: "POST", url: `${base}/test`, headers: h })).json();
    expect(test).toMatchObject({ ok: true, shop_name: "Test Dukkan" });
    const rebuilt = await app.inject({ method: "POST", url: `${base}/webhooks`, headers: h });
    expect(rebuilt.json()).toMatchObject({ webhook: { count: 3, source: "panel" } });
    expect(rebuilt.body).not.toContain("tok-");
    const fresh = hooks.find((x) => x.event === "refund.updated")!.token;
    const raw = JSON.stringify({ id: "abc123" });
    const sig = createHmac("sha256", fresh).update(raw).digest("hex");
    const res = await app.inject({ method: "POST", url: "/api/payments/shopier/webhook", headers: { "content-type": "application/json", "shopier-event": "refund.updated", "shopier-signature": sig }, payload: raw });
    expect(res.statusCode).toBe(200);
    expect((await app.inject({ method: "POST", url: `${base}/test`, headers: h })).json()).toMatchObject({ signing_ready: true, missing_events: [] });
  });
});
