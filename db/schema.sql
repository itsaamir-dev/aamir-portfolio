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

-- ─── Job referrals ──────────────────────────────────────────────────────────
-- Jobs posted from the admin panel. Applicants pay a referral fee (Cashfree
-- or Razorpay) to submit an application.

CREATE TABLE IF NOT EXISTS jobs (
  id                  BIGSERIAL PRIMARY KEY,
  slug                TEXT        NOT NULL,
  title               TEXT        NOT NULL,
  company             TEXT,                                   -- shown as "Confidential client" when empty
  location            TEXT        NOT NULL DEFAULT 'Remote',
  employment_type     TEXT        NOT NULL DEFAULT 'contract'
                        CHECK (employment_type IN ('contract', 'freelance', 'full_time', 'part_time', 'internship')),
  experience_level    TEXT,                                   -- e.g. "Mid-level (3+ years)"
  compensation        TEXT,                                   -- free text, e.g. "$30–40/hr"
  skills              TEXT[]      NOT NULL DEFAULT '{}',
  summary             TEXT        NOT NULL,                   -- one or two lines for the job card
  description         TEXT        NOT NULL,
  responsibilities    TEXT,
  requirements        TEXT,
  timeline            TEXT,                                   -- project duration / milestones
  start_date          DATE,
  apply_by            DATE,                                   -- last day to apply (inclusive)
  referral_fee_paise  INTEGER     NOT NULL CHECK (referral_fee_paise >= 100),
  status              TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS jobs_slug_key ON jobs (slug);
CREATE INDEX IF NOT EXISTS jobs_status_published ON jobs (status, published_at DESC);

CREATE TABLE IF NOT EXISTS job_applications (
  id                   BIGSERIAL PRIMARY KEY,
  public_id            TEXT        NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''), -- reference shown to the applicant
  job_id               BIGINT      NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  full_name            TEXT        NOT NULL,
  email                TEXT        NOT NULL,                  -- normalised: trimmed + lower-case
  phone                TEXT        NOT NULL,                  -- E.164-style, e.g. +919876543210
  location             TEXT,
  portfolio_url        TEXT,
  linkedin_url         TEXT,
  experience_years     TEXT,
  proposal             TEXT        NOT NULL,
  resume_name          TEXT        NOT NULL,
  resume_type          TEXT        NOT NULL,
  resume_size          INTEGER     NOT NULL,
  resume_data          BYTEA       NOT NULL,
  fee_paise            INTEGER     NOT NULL,
  currency             TEXT        NOT NULL DEFAULT 'INR',
  payment_status       TEXT        NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_provider     TEXT        NOT NULL DEFAULT 'razorpay' CHECK (payment_provider IN ('razorpay', 'cashfree')),
  payment_order_id     TEXT,                                  -- gateway order ID
  payment_id           TEXT,                                  -- gateway payment ID once paid
  paid_at              TIMESTAMPTZ,
  review_status        TEXT        NOT NULL DEFAULT 'new' CHECK (review_status IN ('new', 'shortlisted', 'referred', 'rejected')),
  admin_notes          TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Databases created before Cashfree support had Razorpay-only column names.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'razorpay_order_id') THEN
    ALTER TABLE job_applications RENAME COLUMN razorpay_order_id TO payment_order_id;
    ALTER TABLE job_applications RENAME COLUMN razorpay_payment_id TO payment_id;
  END IF;
END $$;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'razorpay';

CREATE UNIQUE INDEX IF NOT EXISTS job_applications_public_id_key ON job_applications (public_id);
CREATE UNIQUE INDEX IF NOT EXISTS job_applications_order_key ON job_applications (payment_order_id) WHERE payment_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS job_applications_job_status ON job_applications (job_id, payment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_email ON job_applications (email);

-- Apply attempts for rate limiting. Salted hash only, never the raw IP.
CREATE TABLE IF NOT EXISTS job_application_attempts (
  ip_hash    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_application_attempts_ip_time ON job_application_attempts (ip_hash, created_at);
