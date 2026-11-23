import "server-only";
import { getPool, ensureSchema } from "@/lib/db";

export const A_RANGES = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 } as const;
export type ARangeKey = keyof typeof A_RANGES;

export type CityRow = { city: string; region: string | null; country: string | null; lat: number; lon: number; views: number; visitors: number };
export type Analytics = {
  views: number; visitors: number; prevViews: number; prevVisitors: number; countriesCount: number; live: number;
  series: { date: string; count: number }[];
  hourly: boolean;
  pages: { path: string; views: number; visitors: number }[];
  countries: { code: string; views: number; visitors: number }[];
  cities: CityRow[];
  referrers: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  browsers: { label: string; count: number }[];
  recent: { path: string; city: string | null; country: string | null; device: string | null; at: string }[];
};

export async function getAnalytics(range: ARangeKey): Promise<Analytics> {
  await ensureSchema();
  const db = getPool();
  const days = A_RANGES[range];
  const since = `now() - ($1::int * interval '1 day')`;
  const hourly = range === "24h";

  const [totals, series, pages, countries, cities, referrers, devices, browsers, recent] = await Promise.all([
    db.query(`
      SELECT count(*) FILTER (WHERE created_at >= ${since})::int AS views,
             count(DISTINCT visitor_hash) FILTER (WHERE created_at >= ${since})::int AS visitors,
             count(*) FILTER (WHERE created_at < ${since})::int AS "prevViews",
             count(DISTINCT visitor_hash) FILTER (WHERE created_at < ${since})::int AS "prevVisitors",
             count(DISTINCT country) FILTER (WHERE created_at >= ${since})::int AS "countriesCount",
             count(DISTINCT visitor_hash) FILTER (WHERE created_at >= now() - interval '5 minutes')::int AS live
      FROM page_views WHERE created_at >= now() - ($1::int * 2 * interval '1 day')`, [days]),
    hourly
      ? db.query(`
          SELECT to_char(h, 'YYYY-MM-DD"T"HH24:00') AS date, count(v.id)::int AS count
          FROM generate_series(date_trunc('hour', now()) - interval '23 hours', date_trunc('hour', now()), interval '1 hour') AS h
          LEFT JOIN page_views v ON date_trunc('hour', v.created_at) = h
          GROUP BY h ORDER BY h`)
      : db.query(`
          SELECT to_char(d, 'YYYY-MM-DD') AS date, count(v.id)::int AS count
          FROM generate_series((now() AT TIME ZONE 'UTC')::date - ($1::int - 1), (now() AT TIME ZONE 'UTC')::date, interval '1 day') AS d
          LEFT JOIN page_views v ON (v.created_at AT TIME ZONE 'UTC')::date = d::date
          GROUP BY d ORDER BY d`, [days]),
    db.query(`
      SELECT path, count(*)::int AS views, count(DISTINCT visitor_hash)::int AS visitors
      FROM page_views WHERE created_at >= ${since} GROUP BY path ORDER BY views DESC, path LIMIT 15`, [days]),
    db.query(`
      SELECT country AS code, count(*)::int AS views, count(DISTINCT visitor_hash)::int AS visitors
      FROM page_views WHERE created_at >= ${since} AND country IS NOT NULL GROUP BY country ORDER BY views DESC LIMIT 60`, [days]),
    // Group by city; the coordinates are averaged (they're the same per city anyway).
    db.query(`
      SELECT city, max(region) AS region, max(country) AS country, avg(latitude)::float AS lat, avg(longitude)::float AS lon,
             count(*)::int AS views, count(DISTINCT visitor_hash)::int AS visitors
      FROM page_views WHERE created_at >= ${since} AND city IS NOT NULL AND latitude IS NOT NULL AND longitude IS NOT NULL
      GROUP BY city, country ORDER BY views DESC LIMIT 200`, [days]),
    db.query(`
      SELECT COALESCE(referrer_host, 'Direct / none') AS label, count(DISTINCT visitor_hash)::int AS count
      FROM page_views WHERE created_at >= ${since} GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 8`, [days]),
    db.query(`
      SELECT COALESCE(device, 'unknown') AS label, count(DISTINCT visitor_hash)::int AS count
      FROM page_views WHERE created_at >= ${since} GROUP BY 1 ORDER BY 2 DESC`, [days]),
    db.query(`
      SELECT COALESCE(browser, 'Other') AS label, count(DISTINCT visitor_hash)::int AS count
      FROM page_views WHERE created_at >= ${since} GROUP BY 1 ORDER BY 2 DESC LIMIT 6`, [days]),
    db.query(`
      SELECT path, city, country, device, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS at
      FROM page_views ORDER BY created_at DESC LIMIT 12`),
  ]);

  return {
    ...totals.rows[0], hourly,
    series: series.rows, pages: pages.rows, countries: countries.rows, cities: cities.rows,
    referrers: referrers.rows, devices: devices.rows, browsers: browsers.rows, recent: recent.rows,
  };
}
