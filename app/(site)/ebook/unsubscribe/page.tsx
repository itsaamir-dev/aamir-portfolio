import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:  "Unsubscribe",
  robots: { index: false, follow: false },
};

const TOKEN_RE = /^[a-f0-9]{32}$/;

async function unsubscribe(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  if (!TOKEN_RE.test(token) || !isDbConfigured) redirect("/ebook/unsubscribe?status=invalid");
  await ensureSchema();
  const { rowCount } = await getPool().query(
    `UPDATE ebook_waitlist
        SET unsubscribed_at = now(), marketing_consent = FALSE, whatsapp_consent = FALSE, updated_at = now()
      WHERE unsubscribe_token = $1`,
    [token],
  );
  redirect(`/ebook/unsubscribe?status=${rowCount ? "done" : "invalid"}`);
}

// A confirm button (POST) rather than a GET side effect, so email link
// scanners can't unsubscribe people by opening the link.
export default function UnsubscribePage({ searchParams }: { searchParams: { token?: string; status?: string } }) {
  const { token = "", status } = searchParams;

  return (
    <>
      <main className="container-x flex min-h-[70vh] max-w-xl flex-col justify-center pb-16 pt-32">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">E-book updates</h1>
        {status === "done" ? (
          <p className="lead mt-4 text-muted" role="status">
            You&apos;ve been unsubscribed. You won&apos;t receive any more e-book or marketing emails from Build With Aamir.
          </p>
        ) : status === "invalid" || !TOKEN_RE.test(token) ? (
          <p className="lead mt-4 text-muted" role="alert">
            This unsubscribe link isn&apos;t valid. Please use the link from your most recent email, or reply to it and
            ask to be removed.
          </p>
        ) : (
          <form action={unsubscribe} className="mt-6">
            <p className="lead text-muted">Stop receiving e-book launch updates and marketing emails?</p>
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="btn-ghost mt-6">Unsubscribe</button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
