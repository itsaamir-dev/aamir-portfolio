import "server-only";

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Returns an error
 * Response when the request isn't authorised, otherwise null.
 */
export function rejectUnauthorized(req: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
