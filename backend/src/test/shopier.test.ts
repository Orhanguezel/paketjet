import { describe, expect, it } from "bun:test";
import { createHmac } from "crypto";
import { env } from "@/core/env";
import { buildShopierCheckout, verifyShopierCallback, verifyShopierPayment } from "@/modules/purchases/shopier";

const SECRET = "test-shopier-secret";
const hmac = (data: string) => createHmac("sha256", SECRET).update(data).digest("base64");
const buyer = { id: "u1", firstName: "Ayşe", lastName: "Yılmaz", email: "ayse@example.com" };

describe("shopier checkout form", () => {
  it("signs random_nr + order + total + currency like the official module", () => {
    const { action, fields } = buildShopierCheckout({ orderId: "PJ-1", amount: 50, productName: "İlan iletişim erişimi", callbackUrl: "https://x/cb", buyer }, SECRET, "key");
    expect(action).toBe("https://www.shopier.com/ShowProduct/api_pay4.php");
    expect(fields.total_order_value).toBe("50.00");
    expect(fields.product_type).toBe("1");
    expect(fields.signature).toBe(hmac(fields.random_nr + "PJ-1" + "50.00" + "0"));
    expect(Object.values(fields).join()).not.toContain(SECRET);
  });
});

describe("shopier callback", () => {
  const valid = { platform_order_id: "PJ-1", random_nr: "123456", status: "success", payment_id: "998", installment: "0", signature: hmac("123456PJ-1") };
  it("accepts a correctly signed callback", () => {
    expect(verifyShopierCallback(valid, SECRET)).toEqual({ orderId: "PJ-1", status: "success", paymentId: "998", installment: "0" });
  });
  it("rejects a wrong signature, another order and an empty secret", () => {
    expect(verifyShopierCallback({ ...valid, signature: hmac("123456PJ-2") }, SECRET)).toBeNull();
    expect(verifyShopierCallback({ ...valid, platform_order_id: "PJ-2" }, SECRET)).toBeNull();
    expect(verifyShopierCallback(valid, "")).toBeNull();
    expect(verifyShopierCallback(null, SECRET)).toBeNull();
  });
  it("documents the weakness: status is NOT covered by the signature", () => {
    // Bu yuzden donus tek basina odeme kaniti sayilmaz; verifyShopierPayment zorunludur.
    expect(verifyShopierCallback({ ...valid, status: "failed" }, SECRET)?.status).toBe("failed");
  });
});

describe("shopier server-side payment verification", () => {
  const order = (o: Record<string, unknown>) => (async () => new Response(JSON.stringify(o), { status: 200 })) as unknown as typeof fetch;
  const paid = { id: "998", paymentStatus: "paid", currency: "TRY", totals: { total: "50.00" }, customer: { email: "ayse@example.com" } };
  const withPat = async (fn: () => Promise<void>) => {
    const prev = env.SHOPIER_PAT;
    (env as { SHOPIER_PAT: string }).SHOPIER_PAT = "pat";
    try { await fn(); } finally { (env as { SHOPIER_PAT: string }).SHOPIER_PAT = prev; }
  };
  it("fails closed without a PAT", async () => {
    expect(await verifyShopierPayment("998", { amount: 50 })).toEqual({ ok: false, reason: "not_configured" });
  });
  it("confirms only a paid TRY order with the exact amount and buyer", () => withPat(async () => {
    expect((await verifyShopierPayment("998", { amount: 50, email: "AYSE@example.com" }, order(paid))).ok).toBe(true);
    expect(await verifyShopierPayment("998", { amount: 50 }, order({ ...paid, paymentStatus: "unpaid" }))).toEqual({ ok: false, reason: "unpaid" });
    expect(await verifyShopierPayment("998", { amount: 50 }, order({ ...paid, totals: { total: "1.00" } }))).toEqual({ ok: false, reason: "amount_mismatch" });
    expect(await verifyShopierPayment("998", { amount: 50 }, order({ ...paid, currency: "USD" }))).toEqual({ ok: false, reason: "currency_mismatch" });
    expect(await verifyShopierPayment("998", { amount: 50, email: "baska@example.com" }, order(paid))).toEqual({ ok: false, reason: "email_mismatch" });
    expect(await verifyShopierPayment("../x", { amount: 50 }, order(paid))).toEqual({ ok: false, reason: "not_found" });
    const down = (async () => { throw new Error("net"); }) as unknown as typeof fetch;
    expect(await verifyShopierPayment("998", { amount: 50 }, down)).toEqual({ ok: false, reason: "api_error" });
  }));
});
