-- E-book waiting list. Idempotent: safe to run on every deploy / cold start.

CREATE TABLE IF NOT EXISTS ebook_waitlist (
  id                 BIGSERIAL PRIMARY KEY,
  first_name         TEXT        NOT NULL,
  email              TEXT        NOT NULL,          -- normalised: trimmed + lower-case
  whatsapp_number    TEXT,                          -- E.164-style, e.g. +919876543210
  source             TEXT        NOT NULL DEFAULT 'website', -- where the form was (ebook_page, home, ...)
  campaign           TEXT        NOT NULL DEFAULT 'ebook_launch',
  utm_source         TEXT,
  utm_medium         TEXT,
  utm_campaign       TEXT,
  landing_page       TEXT,
  referrer           TEXT,
  marketing_consent  BOOLEAN     NOT NULL DEFAULT FALSE, -- other Build With Aamir emails (opt-in)
  whatsapp_consent   BOOLEAN     NOT NULL DEFAULT FALSE, -- launch updates on WhatsApp (opt-in)
  unsubscribed_at    TIMESTAMPTZ,
  unsubscribe_token  TEXT        NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ebook_waitlist_email_key ON ebook_waitlist (email);
CREATE UNIQUE INDEX IF NOT EXISTS ebook_waitlist_unsubscribe_token_key ON ebook_waitlist (unsubscribe_token);

-- Submission attempts for rate limiting. Stores a salted hash, never the raw IP.
CREATE TABLE IF NOT EXISTS ebook_waitlist_attempts (
  ip_hash    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ebook_waitlist_attempts_ip_time ON ebook_waitlist_attempts (ip_hash, created_at);
