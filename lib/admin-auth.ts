// Admin session: a signed, expiring cookie. Uses Web Crypto so it works in
// middleware (edge) and server components alike. No user table — a single
// admin password set in the environment.

export const ADMIN_COOKIE = "bwa_admin";
export const SESSION_TTL_S = 7 * 24 * 60 * 60; // 7 days

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const key = await crypto.subtle.importKey("raw", enc.encode(`bwa-admin:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, "0")).join("");
}

/** Length-independent comparison of two strings. */
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !isAdminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  return safeEqual(sig, await hmac(exp));
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare digests so timing doesn't depend on the password length.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${expected}`));
}
