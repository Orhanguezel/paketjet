import { describe, expect, it } from "bun:test";
import { z } from "zod";
import { queryBoolean } from "./validation";

describe("queryBoolean", () => {
  const schema = z.object({ flag: queryBoolean });
  it("parses query string booleans without turning 'false' into true", () => {
    expect(schema.parse({ flag: "false" }).flag).toBe(false);
    expect(schema.parse({ flag: "0" }).flag).toBe(false);
    expect(schema.parse({ flag: "true" }).flag).toBe(true);
    expect(schema.parse({ flag: "1" }).flag).toBe(true);
    expect(schema.parse({}).flag).toBeUndefined();
  });
  it("rejects other values", () => {
    expect(() => schema.parse({ flag: "evet" })).toThrow();
  });
});
