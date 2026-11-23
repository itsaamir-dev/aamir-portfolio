import { isDbConfigured } from "@/lib/db";
import { isCashfreeConfigured, verifyCashfreeWebhook } from "@/lib/cashfree";
import { markFailedByOrder, markPaidByOrder } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

type Event = {
  type?: string;
  data?: { order?: { order_id?: string }; payment?: { cf_payment_id?: string | number; payment_status?: string } };
};

/**
 * Cashfree payment webhooks. Each order sets notify_url to this route, so no
 * dashboard setup is needed (you can also add it under Developers → Webhooks).
 * Signed with the API secret key. Backs up the browser confirmation, e.g. when
 * an applicant closes the tab right after paying.
 */
export async function POST(req: Request) {
  if (!isCashfreeConfigured || !isDbConfigured) {
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const ok = verifyCashfreeWebhook(raw, req.headers.get("x-webhook-timestamp") ?? "", req.headers.get("x-webhook-signature") ?? "");
  if (!ok) return Response.json({ error: "Invalid signature" }, { status: 400 });

  let evt: Event;
  try { evt = JSON.parse(raw); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const orderId = evt.data?.order?.order_id;
  const payment = evt.data?.payment;
  try {
    if (orderId && evt.type === "PAYMENT_SUCCESS_WEBHOOK" && payment?.payment_status === "SUCCESS") {
      await markPaidByOrder(orderId, String(payment.cf_payment_id ?? ""));
    } else if (orderId && evt.type === "PAYMENT_FAILED_WEBHOOK") {
      await markFailedByOrder(orderId);
    }
    // PAYMENT_USER_DROPPED_WEBHOOK and others: nothing to do — the order stays payable.
  } catch (err) {
    // A 5xx makes Cashfree retry the webhook later.
    console.error("[cashfree/webhook] failed:", (err as Error).message);
    return Response.json({ error: "Temporary failure" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
