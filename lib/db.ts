import "server-only";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

// DATABASE_URL is set by the Neon integration on Vercel (pooled connection).
const CONNECTION_STRING = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const isDbConfigured = Boolean(CONNECTION_STRING);

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

/** Lazily creates one small pool per function instance (safe at build time). */
export function getPool(): Pool {
  if (!CONNECTION_STRING) throw new Error("DATABASE_URL is not set.");
  if (!pool) {
    pool = new Pool({ connectionString: CONNECTION_STRING, max: 3, idleTimeoutMillis: 10_000 });
  }
  return pool;
}

/** Applies db/schema.sql once per instance. The SQL is idempotent. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    schemaReady = getPool().query(sql).then(() => undefined).catch(err => {
      schemaReady = null; // retry on the next request
      throw err;
    });
  }
  return schemaReady;
}
