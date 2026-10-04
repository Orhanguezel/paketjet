import { describe, expect, it } from "bun:test";
import { capitalizePlace, createIlanSchema } from "./validation";

describe("place names", () => {
  it("capitalizes the first letter of each word with Turkish rules and keeps the rest", () => {
    expect(capitalizePlace("istanbul")).toBe("İstanbul");
    expect(capitalizePlace("  kadı   köy ")).toBe("Kadı Köy");
    expect(capitalizePlace("ılgaz")).toBe("Ilgaz");
    expect(capitalizePlace("şanlıurfa-çarşı")).toBe("Şanlıurfa-Çarşı");
    expect(capitalizePlace("NRW")).toBe("NRW");
    expect(capitalizePlace("Kranjska Gora")).toBe("Kranjska Gora");
  });
  it("applies to listing cities and districts on create", () => {
    const body = createIlanSchema.parse({
      from_city: "mersin", from_district: "akdeniz", to_city: "istanbul", to_district: null,
      departure_date: new Date(Date.now() + 86_400_000).toISOString(), contact_phone: "+90 507 000 00 00",
    });
    expect([body.from_city, body.from_district, body.to_city, body.to_district]).toEqual(["Mersin", "Akdeniz", "İstanbul", null]);
  });
});
