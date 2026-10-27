import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { getLeadsForExport, isDbConfigured, LEAD_FILTERS, type LeadFilter } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

// Quote every cell, and neutralise spreadsheet formulas (=, +, -, @) so a
// sign-up can't run code when the CSV is opened in Excel or Sheets.
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  // Middleware already checks the session; check again in case the matcher changes.
  if (!(await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) return Response.json({ error: "Database not connected" }, { status: 503 });

  const url = new URL(req.url);
  const f = url.searchParams.get("filter") ?? "all";
  const filter = (LEAD_FILTERS as readonly string[]).includes(f) ? (f as LeadFilter) : "all";
  const leads = await getLeadsForExport({ q: url.searchParams.get("q") ?? undefined, filter });

  const header = ["First name", "Email", "WhatsApp", "WhatsApp opt-in", "Email tips opt-in", "Unsubscribed",
                  "Form", "UTM source", "UTM medium", "UTM campaign", "Landing page", "Referrer", "Joined (UTC)"];
  const lines = leads.map(l => [
    l.firstName, l.email, l.whatsapp, l.whatsappConsent ? "yes" : "no", l.marketingConsent ? "yes" : "no", l.unsubscribed ? "yes" : "no",
    l.source, l.utmSource, l.utmMedium, l.utmCampaign, l.landingPage, l.referrer, l.createdAt,
  ].map(cell).join(","));

  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + [header.map(cell).join(","), ...lines].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ebook-waitlist-${filter}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
