import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { getResume, isDbConfigured } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

/** Résumé download for the admin. Always an attachment, never rendered inline. */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Middleware already checks the session; check again in case the matcher changes.
  if (!(await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) return Response.json({ error: "Database not connected" }, { status: 503 });

  const id = Number(params.id);
  const file = Number.isInteger(id) && id > 0 ? await getResume(id) : null;
  if (!file) return Response.json({ error: "Not found" }, { status: 404 });

  const ascii = file.name.replace(/[^\x20-\x7E]+/g, "_").replace(/"/g, "");
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
