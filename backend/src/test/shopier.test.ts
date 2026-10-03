import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createHmac } from "crypto";
import { env } from "@/core/env";
import { repoGetCreditBalance, repoGetCreditPackages } from "@/modules/purchases/repository";
import { checkShopierOrder, verifyShopierSignature } from "@/modules/purchases/shopier";
import { buyer, declaration, listing } from "./purchase-fixtures";
import { authHeaders, closeTestApp, getTestApp } from "./setup";

const TOKEN = "test-webhook-token";
const mutableEnv = env as unknown as Record<string, string>;
const realFetch = globalThis.fetch;
const products = new Map<string, number>();
const orders = new Map<string, Record<string, unknown>>();
const deleted: string[] = [];
let seq = 0;
const RUN = Date.now().toString(36);

beforeAll(() => {
  process.env.PAYMENT_PROVIDER = "shopier";
  Object.assign(mutableEnv, { SHOPIER_PAT: "pat", SHOPIER_WEBHOOK_TOKEN: TOKEN, SHOPIER_PRODUCT_IMAGE_URL: "https://example.test/logo.png" });
  // Yalniz Shopier API sahte; app.inject fetch kullanmaz.
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input instanceof Request ? input.url : input));
    if (url.host !== "api.shopier.com") return realFetch(input, init);
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
    if (init?.method === "POST" && url.pathname === "/v1/products") {
      const id = `P${Date.now()}${++seq}`;
      products.set(id, Number(JSON.parse(String(init.body)).priceData.price));
      return json(200, { id, url: `https://www.shopier.com/${id}` });
    }
    if (init?.method === "DELETE") { deleted.push(url.pathname.split("/").pop()!); return json(200, {}); }
    if (url.pathname === "/v1/orders") return json(200, [...orders.values()].filter((o) => (o.lineItems as { productId: string }[])[0].productId === url.searchParams.get("productId")));
    const order = orders.get(url.pathname.split("/").pop()!);
    return order ? json(200, order) : json(404, { error: "notFound" });
  }) as typeof fetch;
});
afterAll(async () => { globalThis.fetch = realFetch; process.env.PAYMENT_PROVIDER = "disabled"; await closeTestApp(); });

const paidOrder = (id: string, productId: string, total: number) => ({ id, paymentStatus: "paid", currency: "TRY", totals: { total: total.toFixed(2) }, lineItems: [{ productId, quantity: 1, total: total.toFixed(2) }] });
const sign = (raw: string) => createHmac("sha256", TOKEN).update(raw).digest("hex");
async function webhook(body: Record<string, unknown>, signature?: string) {
  const raw = JSON.stringify(body);
  return (await getTestApp()).inject({ method: "POST", url: "/api/payments/shopier/webhook", headers: { "content-type": "application/json", "shopier-event": "order.created", "shopier-signature": signature ?? sign(raw) }, payload: raw });
}
async function buyCredits(token: string) {
  const [pack] = await repoGetCreditPackages();
  const res = await (await getTestApp()).inject({ method: "POST", url: "/api/ilan-alma-hakki/satin-al", headers: authHeaders(token), payload: { package_key: pack!.key } });
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
    try {
      const user = await buyer();
      const [pack] = await repoGetCreditPackages();
      const res = await (await getTestApp()).inject({ method: "POST", url: "/api/ilan-alma-hakki/satin-al", headers: authHeaders(user.token), payload: { package_key: pack!.key } });
      expect(res.statusCode).toBe(503);
    } finally { mutableEnv.SHOPIER_WEBHOOK_TOKEN = TOKEN; }
  });
});
