"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, SESSION_TTL_S, checkPassword, createSessionToken, isAdminConfigured, verifySessionToken } from "@/lib/admin-auth";
import { deleteLead, markUnsubscribed } from "@/lib/admin-data";

// Per-instance login throttle: 5 failures per IP per 15 minutes.
const failures = new Map<string, { n: number; until: number }>();

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "Admin isn’t set up yet. Add ADMIN_PASSWORD in Vercel, then redeploy." };

  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const entry = failures.get(ip);
  if (entry && entry.n >= 5 && entry.until > Date.now()) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  if (!(await checkPassword(String(formData.get("password") ?? "")))) {
    const n = entry && entry.until > Date.now() ? entry.n + 1 : 1;
    failures.set(ip, { n, until: Date.now() + 15 * 60_000 });
    await new Promise(r => setTimeout(r, 400)); // slow down guessing
    return { error: "That password isn’t right." };
  }

  failures.delete(ip);
  cookies().set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_TTL_S,
  });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** Server actions are public endpoints — re-check the session in each one. */
async function requireAdmin() {
  if (!(await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value))) throw new Error("Unauthorized");
}

export type ActionResult = { ok: boolean; message: string };

export async function unsubscribeLead(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await markUnsubscribed(id);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Marked as unsubscribed" };
  } catch {
    return { ok: false, message: "Couldn’t update this lead. Check the database connection and try again." };
  }
}

export async function removeLead(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteLead(id);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Lead deleted" };
  } catch {
    return { ok: false, message: "Couldn’t delete this lead. Check the database connection and try again." };
  }
}
