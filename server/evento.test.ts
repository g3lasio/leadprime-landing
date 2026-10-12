import { describe, expect, it } from "vitest";
import { config } from "dotenv";
config();

/**
 * Environment smoke checks, not unit tests: each case validates the FORMAT
 * of a real secret when it is present (local .env or the deployed
 * environment). When a variable is absent — fresh clone, CI, sandbox — the
 * case is reported as SKIPPED instead of failing the whole suite, which is
 * what made `pnpm test` red on every machine without production secrets.
 * The runtime itself still fails closed when a secret is missing.
 */
describe("Evento secrets validation", () => {
  it.skipIf(!process.env.NEON_DATABASE_URL)(
    "NEON_DATABASE_URL is set and looks like a valid Postgres URL",
    () => {
      const url = process.env.NEON_DATABASE_URL;
      expect(url).toBeTruthy();
      expect(url).toMatch(/^postgresql:\/\//);
    }
  );

  it.skipIf(!process.env.EVENTO_ADMIN_PIN)(
    "EVENTO_ADMIN_PIN is set and is a 4-digit string",
    () => {
      const pin = process.env.EVENTO_ADMIN_PIN;
      expect(pin).toBeTruthy();
      expect(pin).toMatch(/^\d{4}$/);
    }
  );

  it.skipIf(!process.env.RESEND_API_KEY)("RESEND_API_KEY is set", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeTruthy();
  });
});
