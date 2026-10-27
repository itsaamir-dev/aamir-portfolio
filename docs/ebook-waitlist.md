# E-book waiting list

Offer copy, discount, price and launch date: `lib/ebook.ts` (single source of truth).

## How it works

- Form: `components/ebook/WaitlistForm.tsx` (used on `/ebook`), validation shared with the API in `lib/waitlist.ts`.
- API: `POST /api/waitlist` validates, rate-limits (5 per IP per 10 min, salted IP hash only), and upserts into
  `ebook_waitlist` (unique on normalised email). The response is the same for new and existing emails.
- Schema: `db/schema.sql`. Idempotent; applied automatically on the first request of each server instance.
- Unsubscribe: `/ebook/unsubscribe?token=<unsubscribe_token>` (confirm button, POST). Put this link in every email.

## Setup

1. Provision Postgres on the Vercel project (Neon via Vercel Marketplace):
   `vercel integration add neon` — this sets `DATABASE_URL` for all environments.
2. Optional: `WAITLIST_HASH_SALT` — any random string, used to hash IPs for rate limiting
   (falls back to `CRON_SECRET`).
3. Redeploy.

Local development: run Postgres and set `DATABASE_URL` in `.env.local`
(e.g. `postgres://postgres@localhost:5432/waitlist`).

## Exporting leads

```sql
SELECT first_name, email, whatsapp_number, whatsapp_consent, marketing_consent,
       source, utm_source, utm_medium, utm_campaign, created_at
FROM ebook_waitlist
WHERE unsubscribed_at IS NULL
ORDER BY created_at;
```

Only message people on WhatsApp where `whatsapp_consent` is true, and only send non-e-book
marketing emails where `marketing_consent` is true.

## Not built yet

Confirmation and launch emails. No email provider is configured. When one is added (e.g. Resend via the
Vercel Marketplace), send the confirmation after the row is saved and never fail the sign-up if sending fails.
Each email needs the unsubscribe link above.
