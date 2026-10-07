import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    // New blog post Mon/Wed/Fri at 08:00 UTC (commits to GitHub → auto deploy)
    { path: "/api/cron/generate-post", schedule: "0 8 * * 1,3,5" },
    // Ping IndexNow daily, after the new post's deploy has gone live
    { path: "/api/cron/index-now",     schedule: "0 10 * * *" },
  ],
};
