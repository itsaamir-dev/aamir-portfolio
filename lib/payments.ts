import "server-only";
import { isCashfreeConfigured } from "@/lib/cashfree";
import { isRazorpayConfigured } from "@/lib/razorpay";

export type PaymentProvider = "cashfree" | "razorpay";

export const PROVIDER_LABEL: Record<PaymentProvider, string> = { cashfree: "Cashfree", razorpay: "Razorpay" };

/**
 * Which gateway takes new payments. PAYMENT_PROVIDER=cashfree|razorpay picks one;
 * otherwise Cashfree when its keys are set, then Razorpay. Existing orders are
 * always confirmed with the gateway that created them.
 */
export function activeProvider(): PaymentProvider | null {
  const wanted = process.env.PAYMENT_PROVIDER;
  if (wanted === "cashfree") return isCashfreeConfigured ? "cashfree" : null;
  if (wanted === "razorpay") return isRazorpayConfigured ? "razorpay" : null;
  return isCashfreeConfigured ? "cashfree" : isRazorpayConfigured ? "razorpay" : null;
}

export const activeProviderLabel = () => {
  const p = activeProvider();
  return p ? PROVIDER_LABEL[p] : null;
};
