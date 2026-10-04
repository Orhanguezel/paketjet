import { describe, expect, it } from "bun:test";
import { buildMailTransportSignature } from "./service";

const base = { host: "smtp.test", port: 465, username: "info@test", password: "eski", secure: true, fromEmail: null, fromName: null };

describe("mail transport signature", () => {
  it("changes when only the password changes, so a new password is used without restart", () => {
    expect(buildMailTransportSignature({ ...base, password: "yeni" })).not.toBe(buildMailTransportSignature(base));
  });
  it("never contains the password itself", () => {
    expect(buildMailTransportSignature(base)).not.toContain("eski");
  });
});
