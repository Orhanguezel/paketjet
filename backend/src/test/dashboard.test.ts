// test/dashboard.test.ts — Dashboard testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

describe("Dashboard — Özet Bilgiler", () => {
  it("müşteri dashboard bilgilerini alabilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "customer" });

    const res = await app.inject({
      method: "GET",
      url: "/api/dashboard/customer",
      headers: authHeaders(token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.total_bookings).toBe(0);
    expect(Number(body.balance)).toBe(0);
  });

  it("taşıyıcı dashboard bilgilerini alabilir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", role: "carrier" });

    const res = await app.inject({
      method: "GET",
      url: "/api/dashboard/carrier",
      headers: authHeaders(token!),
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.active_ilanlar).toBe(0);
  });
});
