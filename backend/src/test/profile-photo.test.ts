import { afterAll, expect, it } from "bun:test";
import { getTestApp, registerUser, randomEmail, authHeaders, closeTestApp } from "./setup";
import { profileUpsertSchema } from "@/modules/profiles/validation";
afterAll(closeTestApp);
it("uploads an avatar, persists it in profile and auth reads, and clears it without losing identity", async () => {
  const app = await getTestApp(),
    { token } = await registerUser(app, { email: randomEmail(), password: "Test1234!" }),
    headers = authHeaders(token!);
  const blank = await app.inject({
    method: "PATCH",
    url: "/api/profiles/me",
    headers,
    payload: { full_name: "Fotoğraf Testi", phone: "05550001122", avatar_url: "" },
  });
  expect(blank.statusCode).toBe(200);
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jJ1sAAAAASUVORK5CYII=", "base64"),
    boundary = "profile-photo-boundary";
  const payload = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="avatar.png"\r\nContent-Type: image/png\r\n\r\n`),
    png,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const upload = await app.inject({
    method: "POST",
    url: "/api/storage/avatars/upload",
    headers: { ...headers, "content-type": `multipart/form-data; boundary=${boundary}` },
    payload,
  });
  expect(upload.statusCode).toBe(200);
  const url = upload.json().url;
  expect(typeof url).toBe("string");
  const image = await app.inject({ method: "GET", url: new URL(url, "http://localhost").pathname });
  expect(image.statusCode).toBe(200);
  expect(image.rawPayload.equals(png)).toBe(true);
  expect((await app.inject({ method: "PATCH", url: "/api/profiles/me", headers, payload: { avatar_url: url } })).statusCode).toBe(200);
  const me = (await app.inject({ method: "GET", url: "/api/auth/user", headers })).json().user;
  expect(me.avatar_url).toBe(url);
  expect(me.full_name).toBe("Fotoğraf Testi");
  expect(me.phone).toBe("05550001122");
  const profile = (await app.inject({ method: "GET", url: "/api/profiles/me", headers })).json();
  expect(profile.avatar_url).toBe(url);
  const other = await registerUser(app, { email: randomEmail(), password: "Test1234!" });
  expect(
    (await app.inject({ method: "GET", url: "/api/auth/user", headers: authHeaders(other.token!) })).json().user.avatar_url,
  ).toBeNull();
  expect((await app.inject({ method: "PATCH", url: "/api/profiles/me", headers, payload: { avatar_url: "" } })).statusCode).toBe(200);
  expect((await app.inject({ method: "GET", url: "/api/auth/user", headers })).json().user.avatar_url).toBe("");
});
it("accepts empty avatars but rejects executable or protocol-relative URLs", () => {
  expect(profileUpsertSchema.safeParse({ avatar_url: "" }).success).toBe(true);
  for (const url of ["javascript:alert(1)", "//external.example/image", "data:text/html,bad"])
    expect(profileUpsertSchema.safeParse({ avatar_url: url }).success).toBe(false);
});
it('rejects non-images, forged image bytes and oversized avatars before storing', async () => {
  const app = await getTestApp();
  const {token} = await registerUser(app, {email: randomEmail(), password: 'Test1234!'});
  for (const [mime, bytes] of [['video/mp4', Buffer.from('video')], ['image/png', Buffer.from('not an image')], ['image/png', Buffer.alloc(5 * 1024 * 1024 + 1)]] as const) {
    const boundary = 'invalid-avatar';
    const payload = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="avatar.png"\r\nContent-Type: ${mime}\r\n\r\n`), bytes, Buffer.from(`\r\n--${boundary}--\r\n`)]);
    const response = await app.inject({method:'POST',url:'/api/storage/avatars/upload',headers:{...authHeaders(token!), 'content-type':`multipart/form-data; boundary=${boundary}`},payload});
    expect(response.statusCode).toBe(400);
  }
});
