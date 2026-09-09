import { afterAll, describe, expect, it } from "bun:test";
import { closeTestApp, getTestApp, authHeaders, randomEmail, registerAdminUser, registerUser } from "./setup";

afterAll(closeTestApp);

type CarrierListResponse = {
  data: Array<{ id: string; email: string; ilan_count: number }>;
  total: number;
};

type CarrierDetailResponse = {
  id: string;
  email: string;
  stats: {
    ilan_count: number;
    booking_count: number;
    rating_count: number;
  };
  recent_ilanlar: Array<{ id: string }>;
  recent_bookings: Array<{ id: string }>;
  recent_ratings: Array<{ id: string }>;
};

async function createCarrier(app: Awaited<ReturnType<typeof getTestApp>>) {
  const carrierEmail = randomEmail();
  const carrier = await registerUser(app, {
    email: carrierEmail,
    password: "Test1234!",
    full_name: "Carrier Test",
    role: "carrier",
  });

  const carrierId = carrier.body.user.id as string;
  const carrierToken = carrier.token as string;

  const ilanRes = await app.inject({
    method: "POST",
    url: "/api/ilanlar",
    headers: authHeaders(carrierToken),
    payload: {
      from_city: "İstanbul",
      to_city: "İzmir",
      departure_date: new Date(Date.now() + 86400000).toISOString(),
      total_capacity_kg: 100,
      price_per_kg: 12,
      vehicle_type: "van",
      contact_phone: "05551234567",
    },
  });

  expect(ilanRes.statusCode).toBe(201);

  return { carrierId, carrierEmail };
}

describe("Admin Carriers", () => {
  it("admin carrier listesini gorebilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    const carrier = await createCarrier(app);

    const res = await app.inject({
      method: "GET",
      url: `/api/admin/carriers?search=${encodeURIComponent(carrier.carrierEmail)}`,
      headers: authHeaders(admin.token as string),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as CarrierListResponse;
    expect(body.total).toBeGreaterThan(0);
    expect(body.data.some((item) => item.id === carrier.carrierId)).toBe(true);
  });

  it("admin carrier detayini gorebilir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    const carrier = await createCarrier(app);

    const res = await app.inject({
      method: "GET",
      url: `/api/admin/carriers/${carrier.carrierId}`,
      headers: authHeaders(admin.token as string),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as CarrierDetailResponse;
    expect(body.id).toBe(carrier.carrierId);
    expect(body.email).toBe(carrier.carrierEmail);
    expect(body.stats.ilan_count).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(body.recent_ilanlar)).toBe(true);
    expect(Array.isArray(body.recent_bookings)).toBe(true);
    expect(Array.isArray(body.recent_ratings)).toBe(true);
  });
});
