import { describe, expect, it } from "bun:test";
import { isForeignKeyBlocked } from "./http";

describe("isForeignKeyBlocked", () => {
  it("detects MySQL 1451 directly or wrapped in a Drizzle error cause", () => {
    expect(isForeignKeyBlocked({ errno: 1451 })).toBe(true);
    expect(isForeignKeyBlocked({ message: "Failed query", cause: { code: "ER_ROW_IS_REFERENCED_2", errno: 1451 } })).toBe(true);
  });
  it("ignores other errors", () => {
    expect(isForeignKeyBlocked(new Error("x"))).toBe(false);
    expect(isForeignKeyBlocked({ cause: { errno: 1062 } })).toBe(false);
    expect(isForeignKeyBlocked(null)).toBe(false);
  });
});
