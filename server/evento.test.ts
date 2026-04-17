import { describe, expect, it } from "vitest";
import { config } from "dotenv";
config();

describe("Evento secrets validation", () => {
  it("NEON_DATABASE_URL is set and looks like a valid Postgres URL", () => {
    const url = process.env.NEON_DATABASE_URL;
    expect(url).toBeTruthy();
    expect(url).toMatch(/^postgresql:\/\//);
  });

  it("EVENTO_ADMIN_PIN is set and is a 4-digit string", () => {
    const pin = process.env.EVENTO_ADMIN_PIN;
    expect(pin).toBeTruthy();
    expect(pin).toMatch(/^\d{4}$/);
  });

  it("RESEND_API_KEY is set", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeTruthy();
  });
});
