"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import {
  demoLoginAction,
  loginAction,
  signupAction,
  type AuthState,
} from "@/actions/auth";
import { SubmitButton } from "./submit-button";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-3 text-[34px] font-extrabold leading-[1.03] tracking-[-0.05em]">
        Pick up where you left off.
      </h1>
      <p className="mt-3 max-w-sm text-[12.5px] leading-6 text-[#6b6960]">
        Your clients, invoices, and revenue story are right where you left them.
      </p>

      <div className="mt-5 rounded-2xl border border-[#d9d4c7] bg-[#f6f4ed] p-3.5">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#d8451b]">
          <KeyRound size={12} />
          Demo access
        </div>
        <div className="mt-2 grid gap-1 text-[10.5px] text-[#55534a] sm:grid-cols-2">
          <p>
            <span className="text-[#928f84]">Email</span>
            <br />
            faizan@ledgerly.app
          </p>
          <p>
            <span className="text-[#928f84]">Password</span>
            <br />
            demo1234
          </p>
        </div>
        <form action={demoLoginAction} className="mt-3">
          <button className="btn btn-sm btn-accent w-full justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound size={12} />
              Enter demo workspace
            </span>
            <ArrowRight size={13} />
          </button>
        </form>
      </div>

      <div className="my-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#928f84]">
        <span className="h-px flex-1 bg-[#dad6ca]" />
        or sign in manually
        <span className="h-px flex-1 bg-[#dad6ca]" />
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@studio.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="input pr-10"
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#928f84]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {state.error ? (
          <p className="rounded-xl border border-[#e4c2bd] bg-[#f9e4e1] px-3 py-2 text-[11.5px] text-[#b3261e]">
            {state.error}
          </p>
        ) : null}

        <SubmitButton className="btn btn-primary w-full" pendingLabel="Signing in…">
          Sign in
          <ArrowRight size={15} />
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-[11.5px] text-[#6b6960]">
        New here?{" "}
        <Link href="/signup" className="link">
          Create a workspace
        </Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signupAction, initialState);

  return (
    <div>
      <p className="eyebrow">Start fresh</p>
      <h1 className="mt-3 text-[34px] font-extrabold leading-[1.03] tracking-[-0.05em]">
        A calmer way to get paid.
      </h1>
      <p className="mt-3 max-w-sm text-[12.5px] leading-6 text-[#6b6960]">
        Create a workspace, add your first client, and send a polished invoice in
        minutes.
      </p>

      <form action={action} className="mt-7 space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" className="input" placeholder="Faizan Khan" required />
        </div>
        <div>
          <label className="label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            className="input"
            placeholder="you@studio.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            className="input"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {state.error ? (
          <p className="rounded-xl border border-[#e4c2bd] bg-[#f9e4e1] px-3 py-2 text-[11.5px] text-[#b3261e]">
            {state.error}
          </p>
        ) : null}

        <SubmitButton className="btn btn-primary w-full" pendingLabel="Creating…">
          Create workspace
          <ArrowRight size={15} />
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-[11.5px] text-[#6b6960]">
        Already have an account?{" "}
        <Link href="/login" className="link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
