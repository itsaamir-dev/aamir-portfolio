import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-md-primary-container text-lg font-bold text-md-on-primary-container">AB</span>
          <div>
            <p className="text-sm text-md-on-surface-variant">Build With Aamir</p>
            <h1 className="text-2xl font-normal text-md-on-surface">Admin sign in</h1>
          </div>
        </div>
        <LoginForm next={searchParams.next ?? ""} configured={isAdminConfigured()} />
      </div>
    </main>
  );
}
