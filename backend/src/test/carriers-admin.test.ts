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

  it("taşıyıcı listesi ve detayı kimlik durumunu içerir", async () => {
    const app = await getTestApp();
    const admin = await registerAdminUser(app);
    const carrierEmail = randomEmail();
    const carrier = await registerUser(app, { email: carrierEmail, password: "Test1234!", full_name: "Kimlikli Taşıyıcı", role: "carrier" });
    const carrierId = carrier.body.user.id as string;
    const ilan = await app.inject({ method: "POST", url: "/api/ilanlar", headers: authHeaders(carrier.token as string), payload: {
      from_city: "Ankara", to_city: "Konya", departure_date: new Date(Date.now() + 86400000).toISOString(), contact_phone: "05551234567" } });
    expect(ilan.statusCode).toBe(201);
    const adminHeaders = authHeaders(admin.token as string);
    const detail = async () => (await app.inject({ method: "GET", url: `/api/admin/carriers/${carrierId}`, headers: adminHeaders })).json();

    expect((await detail()).identity).toMatchObject({ status: "none", has_front: false, has_back: false });

    const boundary = "carrier-identity";
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jJ1sAAAAASUVORK5CYII=", "base64");
    const payload = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="k.png"\r\nContent-Type: image/png\r\n\r\n`), png, Buffer.from(`\r\n--${boundary}--\r\n`)]);
    const up = await app.inject({ method: "POST", url: "/api/identity/me/front", headers: { ...authHeaders(carrier.token as string), "content-type": `multipart/form-data; boundary=${boundary}` }, payload });
    expect(up.statusCode).toBe(200);

    expect((await detail()).identity).toMatchObject({ status: "pending", has_front: true, has_back: false });
    const list = (await app.inject({ method: "GET", url: `/api/admin/carriers?search=${encodeURIComponent(carrierEmail)}`, headers: adminHeaders })).json() as { data: Array<{ id: string; identity: { status: string } }> };
    expect(list.data.find((row) => row.id === carrierId)?.identity.status).toBe("pending");

    const ids = async (query: string) => ((await app.inject({ method: "GET", url: `/api/admin/carriers?search=${encodeURIComponent(carrierEmail)}&${query}`, headers: adminHeaders })).json() as { data: Array<{ id: string }> }).data.map((row) => row.id);
    expect(await ids("identity=incomplete")).toContain(carrierId);
    expect(await ids("identity=none")).not.toContain(carrierId);
    expect(await ids("identity=pending")).not.toContain(carrierId);
    expect((await app.inject({ method: "GET", url: "/api/admin/carriers?identity=bogus", headers: adminHeaders })).statusCode).toBe(400);
    // "false" metni true'ya dönüşmemeli: aktif taşıyıcı pasif filtresinde görünmez.
    expect(await ids("is_active=false")).not.toContain(carrierId);
    expect(await ids("is_active=true")).toContain(carrierId);
  });
});
