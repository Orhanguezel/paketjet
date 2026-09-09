// test/rating.test.ts — Değerlendirme testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders } from "./setup";

afterAll(closeTestApp);

describe("Rating — Değerlendirme", () => {
  it("eski değerlendirme yazma akışı kapalıdır (410)", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "POST",
      url: "/api/ratings",
      headers: authHeaders(token!),
      payload: {
        booking_id: "00000000-0000-0000-0000-000000000000",
        rating: 5,
        comment: "Harika!",
      },
    });
    
    expect(res.statusCode).toBeOneOf([410]);
  });
});
