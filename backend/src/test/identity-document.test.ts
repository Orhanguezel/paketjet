import { afterAll, expect, it } from "bun:test";
import { getTestApp, registerUser, registerAdminUser, randomEmail, authHeaders, closeTestApp } from "./setup";
afterAll(closeTestApp);

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jJ1sAAAAASUVORK5CYII=", "base64");
function multipart(bytes: Buffer, mime = "image/png") {
  const boundary = "identity-boundary";
  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    payload: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="kimlik.png"\r\nContent-Type: ${mime}\r\n\r\n`),
      bytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]),
  };
}

it("stores the identity front privately: owner and admin can read it, other users and anonymous cannot", async () => {
  const app = await getTestApp();
  const owner = await registerUser(app, { email: randomEmail(), password: "Test1234!" });
  const other = await registerUser(app, { email: randomEmail(), password: "Test1234!" });
  const admin = await registerAdminUser(app);
  const headers = authHeaders(owner.token!);
  const ownerId = owner.body.user.id as string;

  expect((await app.inject({ method: "GET", url: "/api/identity/me", headers })).json()).toEqual({ front: null });

  const body = multipart(png);
  const upload = await app.inject({ method: "POST", url: "/api/identity/me/front", headers: { ...headers, "content-type": body.contentType }, payload: body.payload });
  expect(upload.statusCode).toBe(200);
  expect(upload.json().front.status).toBe("pending");
  expect(JSON.stringify(upload.json())).not.toContain("identity/");

  const image = await app.inject({ method: "GET", url: "/api/identity/me/front", headers });
  expect(image.statusCode).toBe(200);
  expect(image.headers["cache-control"]).toContain("no-store");
  expect(image.rawPayload.equals(png)).toBe(true);

  expect((await app.inject({ method: "GET", url: "/api/identity/me/front" })).statusCode).toBe(401);
  expect((await app.inject({ method: "GET", url: "/api/identity/me/front", headers: authHeaders(other.token!) })).statusCode).toBe(404);
  expect((await app.inject({ method: "GET", url: `/api/admin/identity/${ownerId}/front`, headers: authHeaders(other.token!) })).statusCode).toBe(403);

  const adminHeaders = authHeaders(admin.token!);
  expect((await app.inject({ method: "GET", url: `/api/admin/identity/${ownerId}/front`, headers: adminHeaders })).rawPayload.equals(png)).toBe(true);
  expect((await app.inject({ method: "PATCH", url: `/api/admin/identity/${ownerId}`, headers: adminHeaders, payload: { status: "rejected" } })).statusCode).toBe(400);
  const review = await app.inject({ method: "PATCH", url: `/api/admin/identity/${ownerId}`, headers: adminHeaders, payload: { status: "approved" } });
  expect(review.json().front.status).toBe("approved");

  const again = multipart(png);
  const reupload = await app.inject({ method: "POST", url: "/api/identity/me/front", headers: { ...headers, "content-type": again.contentType }, payload: again.payload });
  expect(reupload.json().front.status).toBe("pending");

  expect((await app.inject({ method: "DELETE", url: "/api/identity/me/front", headers })).statusCode).toBe(200);
  expect((await app.inject({ method: "GET", url: "/api/identity/me/front", headers })).statusCode).toBe(404);
});

it("rejects non-image, forged and oversized identity uploads", async () => {
  const app = await getTestApp();
  const { token } = await registerUser(app, { email: randomEmail(), password: "Test1234!" });
  for (const [bytes, mime] of [[Buffer.from("%PDF-1.4"), "application/pdf"], [Buffer.from("not an image"), "image/png"], [Buffer.alloc(8 * 1024 * 1024 + 1), "image/jpeg"], [Buffer.from("GIF89a"), "image/gif"]] as const) {
    const body = multipart(bytes, mime);
    const res = await app.inject({ method: "POST", url: "/api/identity/me/front", headers: { ...authHeaders(token!), "content-type": body.contentType }, payload: body.payload });
    expect(res.statusCode).toBe(400);
  }
});
