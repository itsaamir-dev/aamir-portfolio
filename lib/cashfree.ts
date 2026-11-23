import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// Cashfree Payments via its REST API (no SDK). Keys from the Cashfree dashboard:
// Developers → API Keys. Test keys work against the sandbox, production keys take real money.
const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET = process.env.CASHFREE_SECRET_KEY;
const API_VERSION = "2025-01-01";

/** CASHFREE_ENV=production|sandbox. Without it, the secret key's prefix decides (cfsk_ma_prod_… vs cfsk_ma_test_…). */
export const cashfreeMode: "production" | "sandbox" | null = !APP_ID || !SECRET ? null
  : process.env.CASHFREE_ENV === "production" || (!process.env.CASHFREE_ENV && /_prod_/.test(SECRET)) ? "production" : "sandbox";

export const isCashfreeConfigured = cashfreeMode !== null;

const BASE = cashfreeMode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

const headers = () => ({
  "Content-Type": "application/json",
  "x-client-id": APP_ID ?? "",
  "x-client-secret": SECRET ?? "",
  "x-api-version": API_VERSION,
});

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isCashfreeConfigured) throw new Error("Cashfree is not configured");
  const res = await fetch(BASE + path, { ...init, headers: headers(), cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    // Log the API's error code, never the keys.
    const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
    throw new Error(`Cashfree ${path.split("/")[1]} failed (${res.status}): ${body.code ?? ""} ${body.message ?? ""}`.trim());
  }
  return res.json() as Promise<T>;
}

/** Cashfree wants a 10-digit number for India; other countries go in full international format. */
export function cashfreePhone(e164: string) {
  return e164.startsWith("+91") && e164.length === 13 ? e164.slice(3) : e164;
}

export type CashfreeOrder = { order_id: string; cf_order_id: string; payment_session_id: string; order_status: string; order_amount: number; order_currency: string };

/** Creates an order the browser checkout pays against. Amount is in paise (sent to Cashfree in rupees). */
export async function createCashfreeOrder(o: {
  orderId: string; amountPaise: number; customerId: string; name: string; email: string; phone: string;
  note: string; returnUrl: string; notifyUrl?: string; tags: Record<string, string>;
}): Promise<CashfreeOrder> {
  return call<CashfreeOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      order_id: o.orderId,
      order_amount: o.amountPaise / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: o.customerId,
        customer_email: o.email,
        customer_phone: cashfreePhone(o.phone),
        ...(o.name.trim().length >= 3 ? { customer_name: o.name.trim().slice(0, 100) } : {}),
      },
      order_meta: { return_url: o.returnUrl, ...(o.notifyUrl ? { notify_url: o.notifyUrl } : {}) },
      order_note: o.note.slice(0, 200),
      order_tags: o.tags,
    }),
  });
}

type CashfreePayment = { cf_payment_id: string | number; payment_status: string };

/**
 * Asks Cashfree whether the order is paid. Never trust the browser for this.
 * Returns the successful payment's ID when it is.
 */
export async function getCashfreePayment(orderId: string): Promise<{ paid: boolean; status: string; paymentId: string | null }> {
  const order = await call<{ order_status: string }>(`/orders/${encodeURIComponent(orderId)}`);
  if (order.order_status !== "PAID") return { paid: false, status: order.order_status, paymentId: null };
  const payments = await call<CashfreePayment[]>(`/orders/${encodeURIComponent(orderId)}/payments`).catch(() => []);
  const ok = payments.find(p => p.payment_status === "SUCCESS");
  return { paid: true, status: "PAID", paymentId: ok ? String(ok.cf_payment_id) : null };
}

/** Webhooks: x-webhook-signature = base64(HMAC_SHA256(timestamp + raw body, secret key)). */
export function verifyCashfreeWebhook(rawBody: string, timestamp: string, signature: string) {
  if (!SECRET || !timestamp || !signature) return false;
  // Reject replays older than 10 minutes (timestamp is in milliseconds).
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 10 * 60_000) return false;
  const expected = Buffer.from(createHmac("sha256", SECRET).update(timestamp + rawBody).digest("base64"));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
