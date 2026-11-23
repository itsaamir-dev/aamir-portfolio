# Job referrals (paid applications)

Post jobs from the admin panel; applicants apply on the site and pay a referral fee through **Cashfree** or **Razorpay** to submit.

## How it works

1. **Admin → Jobs → New job.** Fill in the details, set the referral fee (₹) and status:
   `Draft` (hidden), `Open` (listed and accepting applications) or `Closed` (visible, no form).
   Without an *Apply by* date a job stays open until you close it. The link (`/jobs/<slug>`) never changes after creation.
2. **Applicant** opens `/jobs/<slug>`, fills in their details, uploads a résumé (PDF/DOC/DOCX, max 4 MB), writes a proposal,
   ticks the fee acknowledgement and clicks **Pay ₹X & submit application**.
3. **Server** (`POST /api/jobs/apply`) validates everything, checks the file's real type, rate-limits (6 per IP per 30 min),
   blocks a second *paid* application for the same job + email, saves the application as `pending` and creates an order with
   the active gateway (see *Choosing a gateway*).
4. **Checkout** opens as a popup (UPI, cards, net banking, wallets). When it finishes the browser calls `POST /api/jobs/verify`:
   - **Cashfree:** the server asks Cashfree's API whether the order is `PAID` (the browser's word is never trusted).
     In-app browsers that can't show the popup go to a full-page checkout and come back to `/jobs/<slug>?application=…`,
     which confirms the same way.
   - **Razorpay:** the server checks the checkout signature.

   If the applicant closes the window, their details stay saved and they can retry the payment without re-uploading.
5. **Webhooks** also mark payments `paid` — this covers applicants who pay and close the tab before the browser confirms:
   `POST /api/cashfree/webhook` (signed with your Cashfree secret key, set automatically on every order) and
   `POST /api/razorpay/webhook`. All paths are idempotent.
6. **Admin → Applications** lists paid applications by default: download résumés, read proposals, set a review status
   (New / Shortlisted / Referred / Not a fit), keep private notes, record refunds, delete on request.

Unpaid applications (abandoned checkouts) are deleted automatically after 3 days, along with their résumés.

## Choosing a gateway

- Only one gateway takes **new** payments. With Cashfree keys set it's Cashfree; otherwise Razorpay.
  Set `PAYMENT_PROVIDER=razorpay` (or `cashfree`) to choose explicitly when both are configured.
- Orders already created are always confirmed with the gateway that created them, so switching is safe.
- Admin → Applications shows which gateway each payment went through.

## International cards

Both gateways charge in **INR** and settle in INR to your bank account. Cards issued outside India work on both, but **only after
the gateway enables international payments on your account** — it's off by default:

- **Cashfree:** Dashboard → Settings → Payment Methods → International cards. If it isn't listed, request it from Cashfree support
  (they review your business and website first).
- **Razorpay:** Dashboard → Account & Settings → International payments → request activation.

The foreign cardholder's bank converts INR to their currency. Test an international card in sandbox / test mode before going live.

## Setup — Cashfree

1. **Account** — sign up at merchant.cashfree.com and complete KYC. As with Razorpay, the website review expects public
   *Terms*, *Privacy*, *Refund & Cancellation* and *Contact* pages.
2. **API keys** — Developers → API Keys. In Vercel (Production and Preview):
   - `CASHFREE_APP_ID`
   - `CASHFREE_SECRET_KEY` — test keys (`cfsk_ma_test_…`) use the sandbox; production keys (`cfsk_ma_prod_…`) take real money
   - `CASHFREE_ENV` — optional, `sandbox` or `production`; without it the key prefix decides
3. **Whitelist your domain** — Developers → Whitelisting → add `buildwithaamir.com`. Cashfree's checkout won't open on a domain
   that isn't whitelisted (production only).
4. **Webhook** — nothing to do: each order tells Cashfree to notify `https://<your-domain>/api/cashfree/webhook`. You can also
   add that URL under Developers → Webhooks (Payment events).
5. Redeploy. **Admin → Setup** shows which gateway is active and whether it's sandbox or production.

## Setup — Razorpay

1. **Razorpay account** — complete KYC at dashboard.razorpay.com. Razorpay's website review expects public pages for
   *Terms & Conditions*, *Privacy Policy*, *Refund & Cancellation Policy* and *Contact Us*; add those to the site before applying
   for live mode.
2. **API keys** — Razorpay Dashboard → Account & Settings → API Keys. In Vercel (Production and Preview):
   - `RAZORPAY_KEY_ID` — `rzp_test_…` for testing, `rzp_live_…` for real payments
   - `RAZORPAY_KEY_SECRET`
3. **Webhook (recommended)** — Razorpay Dashboard → Webhooks → Add:
   - URL: `https://buildwithaamir.com/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
   - Secret: any long random string → set the same value as `RAZORPAY_WEBHOOK_SECRET` in Vercel.
4. **Auto-capture** — Razorpay Dashboard → Account & Settings → Payment capture → *Automatic*, so payments are captured
   immediately instead of staying "authorized".
5. Redeploy. **Admin → Setup** shows whether Razorpay and the webhook are connected, and whether you're in test or live mode.

Test mode first: use `rzp_test_` keys, make a test payment with Razorpay's test UPI ID or test card, and check it appears under
Admin → Applications as **Paid**. Then swap in the live keys (and a live-mode webhook) and redeploy.

## Notes

- **Refunds** are issued in the Cashfree or Razorpay dashboard. "Mark refunded" in the admin only records it.
- **No Google Jobs markup**: Google doesn't allow job listings that charge applicants, so job pages use plain `WebPage` markup.
- Résumés are stored in Postgres (`job_applications.resume_data`). They're only downloadable by a signed-in admin, always as an
  attachment.
- Analytics events: `job_view`, `job_apply_start`, `job_apply_submit`, `job_apply_error`, `job_payment_success`,
  `job_payment_failed`, `job_payment_dismissed`.
- Schema: `db/schema.sql` (tables `jobs`, `job_applications`, `job_application_attempts`), applied automatically.
  `job_applications.payment_provider`, `payment_order_id` and `payment_id` record the gateway, its order and payment IDs.
- Cashfree applicants must give a phone number (required by Cashfree). Indian numbers are sent as 10 digits and others in
  international format; check an international number in sandbox once before going live.
