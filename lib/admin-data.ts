import "server-only";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";

export { isDbConfigured };

export type Lead = {
  id: number;
  firstName: string;
  email: string;
  whatsapp: string | null;
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  landingPage: string | null;
  referrer: string | null;
  marketingConsent: boolean;
  whatsappConsent: boolean;
  unsubscribed: boolean;
  createdAt: string; // ISO
};

const LEAD_COLUMNS = `
  id, first_name AS "firstName", email, whatsapp_number AS "whatsapp", source,
  utm_source AS "utmSource", utm_medium AS "utmMedium", utm_campaign AS "utmCampaign",
  landing_page AS "landingPage", referrer,
  marketing_consent AS "marketingConsent", whatsapp_consent AS "whatsappConsent",
  (unsubscribed_at IS NOT NULL) AS unsubscribed,
  to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt"`;

// ─── Overview ───────────────────────────────────────────────────────────────

export const RANGES = { "7d": 7, "30d": 30, "90d": 90 } as const;
export type RangeKey = keyof typeof RANGES;

export type Overview = {
  total: number;
  active: number;          // not unsubscribed
  last7: number;
  prev7: number;
  whatsappOptIn: number;
  marketingOptIn: number;
  withWhatsapp: number;
  unsubscribed: number;
  daily: { date: string; count: number }[];
  sources: { label: string; count: number }[];
  campaigns: { label: string; count: number }[];
  recent: Lead[];
};

export async function getOverview(range: RangeKey): Promise<Overview> {
  await ensureSchema();
  const db = getPool();
  const days = RANGES[range];

  const [totals, daily, sources, campaigns, recent] = await Promise.all([
    db.query(`
      SELECT count(*)::int                                                         AS total,
             count(*) FILTER (WHERE unsubscribed_at IS NULL)::int                  AS active,
             count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int  AS last7,
             count(*) FILTER (WHERE created_at >= now() - interval '14 days'
                                AND created_at <  now() - interval '7 days')::int  AS prev7,
             count(*) FILTER (WHERE whatsapp_consent AND unsubscribed_at IS NULL)::int  AS "whatsappOptIn",
             count(*) FILTER (WHERE marketing_consent AND unsubscribed_at IS NULL)::int AS "marketingOptIn",
             count(*) FILTER (WHERE whatsapp_number IS NOT NULL)::int              AS "withWhatsapp",
             count(*) FILTER (WHERE unsubscribed_at IS NOT NULL)::int              AS unsubscribed
      FROM ebook_waitlist`),
    // One row per UTC day in range, zero-filled.
    db.query(`
      SELECT to_char(d, 'YYYY-MM-DD') AS date, count(w.id)::int AS count
      FROM generate_series((now() AT TIME ZONE 'UTC')::date - ($1::int - 1), (now() AT TIME ZONE 'UTC')::date, interval '1 day') AS d
      LEFT JOIN ebook_waitlist w ON (w.created_at AT TIME ZONE 'UTC')::date = d::date
      GROUP BY d ORDER BY d`, [days]),
    // Where people came from: UTM source if tagged, otherwise the form location.
    db.query(`
      SELECT COALESCE(NULLIF(utm_source, ''), source) AS label, count(*)::int AS count
      FROM ebook_waitlist WHERE created_at >= now() - ($1::int * interval '1 day')
      GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 6`, [days]),
    db.query(`
      SELECT utm_campaign AS label, count(*)::int AS count
      FROM ebook_waitlist WHERE utm_campaign IS NOT NULL AND created_at >= now() - ($1::int * interval '1 day')
      GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 5`, [days]),
    db.query(`SELECT ${LEAD_COLUMNS} FROM ebook_waitlist ORDER BY created_at DESC LIMIT 6`),
  ]);

  return { ...totals.rows[0], daily: daily.rows, sources: sources.rows, campaigns: campaigns.rows, recent: recent.rows };
}

// ─── Leads list ─────────────────────────────────────────────────────────────

export const LEAD_FILTERS = ["all", "whatsapp", "marketing", "unsubscribed"] as const;
export type LeadFilter = (typeof LEAD_FILTERS)[number];
export const PAGE_SIZE = 25;

export type LeadQuery = { q?: string; filter?: LeadFilter; page?: number; order?: "new" | "old" };

function where({ q, filter }: LeadQuery) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (q?.trim()) {
    params.push(`%${q.trim().toLowerCase()}%`);
    clauses.push(`(lower(first_name) LIKE $${params.length} OR email LIKE $${params.length} OR whatsapp_number LIKE $${params.length})`);
  }
  if (filter === "whatsapp")     clauses.push("whatsapp_consent AND unsubscribed_at IS NULL");
  if (filter === "marketing")    clauses.push("marketing_consent AND unsubscribed_at IS NULL");
  if (filter === "unsubscribed") clauses.push("unsubscribed_at IS NOT NULL");
  return { sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export async function getLeads(query: LeadQuery) {
  await ensureSchema();
  const db = getPool();
  const { sql, params } = where(query);
  const page  = Math.max(1, query.page ?? 1);
  const order = query.order === "old" ? "ASC" : "DESC";

  const [rows, count] = await Promise.all([
    db.query<Lead>(`SELECT ${LEAD_COLUMNS} FROM ebook_waitlist ${sql} ORDER BY created_at ${order}, id ${order}
                    LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`, params),
    db.query<{ n: number }>(`SELECT count(*)::int AS n FROM ebook_waitlist ${sql}`, params),
  ]);
  return { leads: rows.rows, total: count.rows[0].n, page, pages: Math.max(1, Math.ceil(count.rows[0].n / PAGE_SIZE)) };
}

/** Every lead matching the query, for CSV export. */
export async function getLeadsForExport(query: LeadQuery) {
  await ensureSchema();
  const { sql, params } = where(query);
  const { rows } = await getPool().query<Lead>(`SELECT ${LEAD_COLUMNS} FROM ebook_waitlist ${sql} ORDER BY created_at DESC`, params);
  return rows;
}

// ─── Mutations ──────────────────────────────────────────────────────────────

/** For unsubscribe requests that arrive by email or WhatsApp. Not reversible here on purpose. */
export async function markUnsubscribed(id: number) {
  await ensureSchema();
  await getPool().query(
    `UPDATE ebook_waitlist SET unsubscribed_at = now(), marketing_consent = FALSE, whatsapp_consent = FALSE, updated_at = now()
      WHERE id = $1 AND unsubscribed_at IS NULL`,
    [id],
  );
}

export async function deleteLead(id: number) {
  await ensureSchema();
  await getPool().query(`DELETE FROM ebook_waitlist WHERE id = $1`, [id]);
}
