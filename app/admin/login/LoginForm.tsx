"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Symbol from "@/components/admin/Symbol";
import { login, type LoginState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
            className="state-layer mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-md-primary
                       text-sm font-medium tracking-[0.01em] text-md-on-primary disabled:opacity-60">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);

  if (!configured) {
    return (
      <div role="alert" className="rounded-2xl bg-md-surface-container p-6 text-md-on-surface">
        <p className="flex items-center gap-2 font-medium"><Symbol name="lock" /> Admin isn&apos;t set up yet</p>
        <p className="mt-2 text-sm leading-relaxed text-md-on-surface-variant">
          Add an <code className="rounded bg-md-surface-container-highest px-1">ADMIN_PASSWORD</code> environment variable in
          Vercel, then redeploy. Use a long, unique password.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-[28px] bg-md-surface-container-low p-6 sm:p-8">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="text-sm font-medium text-md-on-surface-variant">Password</label>
      <div className={`mt-2 flex h-14 items-center rounded-[4px] border bg-transparent pl-4 pr-1 focus-within:border-2
                       ${state.error ? "border-md-error focus-within:border-md-error" : "border-md-outline focus-within:border-md-primary"}`}>
        <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required autoFocus
               aria-invalid={Boolean(state.error)} aria-describedby={state.error ? "password-error" : undefined}
               className="h-full min-w-0 flex-1 bg-transparent text-base text-md-on-surface outline-none" />
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="state-layer grid h-12 w-12 place-items-center rounded-full text-md-on-surface-variant">
          <Symbol name={show ? "visibility_off" : "visibility"} size={20} />
        </button>
      </div>
      {state.error && (
        <p id="password-error" role="alert" className="mt-2 flex items-center gap-1 text-sm text-md-error">
          <Symbol name="error" size={18} /> {state.error}
        </p>
      )}
      <Submit />
    </form>
  );
}
