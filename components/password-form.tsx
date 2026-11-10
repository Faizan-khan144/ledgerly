"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordAction, type PasswordState } from "@/actions/settings";
import { SubmitButton } from "./submit-button";

const initialState: PasswordState = {};

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, initialState);

  return (
    <section className="card card-pad">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
        <KeyRound size={13} />
        Security
      </p>
      <h3 className="serif mt-2 text-[22px]">Change password</h3>
      <p className="mt-1.5 text-[11.5px] leading-5 text-[#6b6960]">
        Keep your account fresh. You will need the current password to set a new one.
      </p>

      <form action={action} className="mt-4 space-y-3">
        <div>
          <label className="label" htmlFor="current-password">
            Current password
          </label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="input"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              className="input"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="confirm-password">
              Confirm
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="input"
              minLength={8}
              required
            />
          </div>
        </div>

        {state.error ? (
          <p className="rounded-xl border border-[#e4c2bd] bg-[#f9e4e1] px-3 py-2 text-[12px] leading-5 text-[#b3261e]">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="rounded-xl border border-[#cfe3d8] bg-[#e4f0e9] px-3 py-2 text-[12px] leading-5 text-[#1f6f4f]">
            {state.success}
          </p>
        ) : null}

        <SubmitButton className="btn btn-sm w-full" pendingLabel="Updating…">
          Update password
        </SubmitButton>
      </form>
    </section>
  );
}
