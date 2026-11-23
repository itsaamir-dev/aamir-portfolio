import { isDbConfigured } from "@/lib/db";
import { isRazorpayWebhookConfigured, verifyWebhookSignature } from "@/lib/razorpay";
import { markFailedByOrder, confirmPaidByOrder } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

type Event = {
  event?: string;
  payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
};

/**
 * Razorpay → Settings → Webhooks, URL /api/razorpay/webhook, events
 * payment.captured, payment.failed and order.paid. Backs up the browser
 * callback (e.g. the applicant closes the tab right after paying).
 */
export async function POST(req: Request) {
  if (!isRazorpayWebhookConfigured || !isDbConfigured) {
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let evt: Event;
  try { evt = JSON.parse(raw); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const payment = evt.payload?.payment?.entity;
  try {
    if ((evt.event === "payment.captured" || evt.event === "order.paid") && payment?.id && payment.order_id) {
      await confirmPaidByOrder(payment.order_id, payment.id);
    } else if (evt.event === "payment.failed" && payment?.order_id) {
      await markFailedByOrder(payment.order_id);
    }
  } catch (err) {
    // A 5xx makes Razorpay retry the webhook later.
    console.error("[razorpay/webhook] failed:", (err as Error).message);
    return Response.json({ error: "Temporary failure" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
