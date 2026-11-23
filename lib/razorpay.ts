import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// Razorpay via its REST API (no SDK). Keys from the Razorpay dashboard:
// Settings → API Keys. Use rzp_test_… keys for testing, rzp_live_… for real money.
const KEY_ID         = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET     = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export const isRazorpayConfigured = Boolean(KEY_ID && KEY_SECRET);
export const isRazorpayWebhookConfigured = Boolean(WEBHOOK_SECRET);
export const razorpayMode = KEY_ID?.startsWith("rzp_live_") ? "live" : KEY_ID ? "test" : null;

/** Public key for Razorpay Checkout in the browser. */
export const razorpayKeyId = () => KEY_ID ?? "";

export type RazorpayOrder = { id: string; amount: number; currency: string; status: string };

/** Creates an order the browser checkout pays against. Amount is in paise. */
export async function createOrder({ amountPaise, receipt, notes }: {
  amountPaise: number; receipt: string; notes: Record<string, string>;
}): Promise<RazorpayOrder> {
  if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay is not configured");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64"),
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: receipt.slice(0, 40), notes }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    // Log the API's error code, never the keys.
    const body = await res.json().catch(() => ({})) as { error?: { code?: string; description?: string } };
    throw new Error(`Razorpay order failed (${res.status}): ${body.error?.code ?? ""} ${body.error?.description ?? ""}`.trim());
  }
  return res.json();
}

function safeEqualHex(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checkout success: signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  if (!KEY_SECRET) return false;
  const expected = createHmac("sha256", KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhooks: X-Razorpay-Signature = HMAC_SHA256(raw body, webhook_secret). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  if (!WEBHOOK_SECRET) return false;
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
