import { isDbConfigured } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getCashfreePayment, isCashfreeConfigured } from "@/lib/cashfree";
import { getApplicationOrder, markPaidByOrder } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

type Body = { provider?: string; application?: string; orderId?: string; paymentId?: string; signature?: string };

const paidResponse = (paid: { publicId: string; jobTitle: string; feePaise: number }) =>
  json({ ok: true, reference: paid.publicId.slice(0, 8).toUpperCase(), job: paid.jobTitle, feePaise: paid.feePaise });

/**
 * Cashfree: the browser only says "I'm done" — the server asks Cashfree
 * whether the order is actually paid before marking anything.
 */
async function verifyCashfree(application: string) {
  if (!isCashfreeConfigured) return json({ ok: false, error: "Payments aren’t available right now." }, 503);
  try {
    const app = await getApplicationOrder(application);
    if (!app || app.provider !== "cashfree" || !app.orderId) {
      return json({ ok: false, error: "We couldn’t find this application." }, 404);
    }
    // Already confirmed (e.g. by the webhook) — no need to ask Cashfree again.
    const result = app.paymentStatus === "paid" || app.paymentStatus === "refunded"
      ? { paid: true, status: "PAID", paymentId: null }
      : await getCashfreePayment(app.orderId);
    if (!result.paid) {
      // ACTIVE = not paid yet (closed, failed, or the bank is still confirming).
      return json({ ok: false, pending: result.status === "ACTIVE", error: "We haven’t received your payment yet." }, 402);
    }
    const paid = await markPaidByOrder(app.orderId, result.paymentId ?? "", application);
    if (!paid) return json({ ok: false, error: "We couldn’t find this application. Contact us with your reference." }, 404);
    return paidResponse(paid);
  } catch (err) {
    console.error("[jobs/verify] cashfree check failed:", (err as Error).message);
    return json({ ok: false, error: "We couldn’t confirm your payment yet. If money was taken, it will update automatically — contact us if it doesn’t within an hour." }, 502);
  }
}

/**
 * Called by the browser after checkout. Razorpay: the signature proves the
 * payment came from Razorpay for this order. Cashfree: see verifyCashfree.
 * Called by the browser after Razorpay Checkout succeeds. The signature proves
 * the payment came from Razorpay for this order; only then is it marked paid.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) return json({ ok: false, error: "Applications aren’t available right now." }, 503);

  let body: Body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "Invalid request." }, 400); }

  const { application, orderId, paymentId, signature } = body;
  if (body.provider === "cashfree") {
    if (typeof application !== "string" || !/^[a-f0-9]{32}$/.test(application)) return json({ ok: false, error: "Invalid request." }, 400);
    return verifyCashfree(application);
  }
  if (typeof application !== "string" || !/^[a-f0-9]{32}$/.test(application) ||
      typeof orderId !== "string" || !/^order_\w{6,40}$/.test(orderId) ||
      typeof paymentId !== "string" || !/^pay_\w{6,40}$/.test(paymentId) ||
      typeof signature !== "string" || !/^[a-f0-9]{64}$/.test(signature)) {
    return json({ ok: false, error: "Invalid payment details." }, 400);
  }

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    console.warn("[jobs/verify] signature mismatch for order", orderId);
    return json({ ok: false, error: "We couldn’t verify this payment. If money was taken, contact us with your payment ID." }, 400);
  }

  try {
    const paid = await markPaidByOrder(orderId, paymentId, application);
    if (!paid) return json({ ok: false, error: "We couldn’t find this application. Contact us with your payment ID." }, 404);
    return paidResponse(paid);
  } catch (err) {
    console.error("[jobs/verify] failed:", (err as Error).message);
    return json({ ok: false, error: "Your payment went through, but we couldn’t confirm it yet. It will update automatically — contact us if it doesn’t within an hour." }, 500);
  }
}
