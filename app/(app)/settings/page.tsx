import Link from "next/link";
import { Download, KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { updateProfileAction } from "@/actions/settings";
import { logoutAction } from "@/actions/auth";
import { PageHeading } from "@/components/ui";
import { PasswordForm } from "@/components/password-form";
import { SubmitButton } from "@/components/submit-button";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const stats = get<{ invoices: number; clients: number; total: number }>(
    `SELECT
       (SELECT COUNT(*) FROM invoices WHERE user_id = ?) AS invoices,
       (SELECT COUNT(*) FROM clients WHERE user_id = ?) AS clients,
       (SELECT COALESCE(SUM(total_cents), 0) FROM invoices WHERE user_id = ? AND status = 'paid') AS total`,
    user.id,
    user.id,
    user.id,
  )!;

  const recent = all<{ created_at: string }>(
    "SELECT created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    user.id,
  )[0];

  return (
    <div className="page space-y-7">
      <PageHeading
        eyebrow="Make it yours"
        title="Settings"
        subtitle="The details that appear on every invoice, plus a few quiet controls for your workspace."
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="card card-pad">
          <div>
            <p className="eyebrow">Studio identity</p>
            <h2 className="serif mt-2 text-[28px]">Profile & invoice details</h2>
            <p className="mt-1 text-[12px] text-[#6b6960]">
              Keep this current — it is what clients see at the top of every invoice.
            </p>
          </div>

          <form action={updateProfileAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="settings-name">
                  Your name
                </label>
                <input id="settings-name" name="name" className="input" defaultValue={user.name} required />
              </div>
              <div>
                <label className="label" htmlFor="settings-company">
                  Studio name
                </label>
                <input
                  id="settings-company"
                  name="companyName"
                  className="input"
                  defaultValue={user.company_name}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="settings-address">
                Studio address
              </label>
              <textarea
                id="settings-address"
                name="companyAddress"
                className="textarea"
                defaultValue={user.company_address}
                placeholder="Street, city, country"
              />
            </div>
            <div>
              <label className="label" htmlFor="settings-phone">
                Phone
              </label>
              <input
                id="settings-phone"
                name="companyPhone"
                className="input"
                defaultValue={user.company_phone}
                placeholder="+92 300 0000000"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[#e5e1d6] pt-5">
              <p className="max-w-xs text-[11px] leading-5 text-[#928f84]">
                Changes apply to new and existing invoices immediately.
              </p>
              <SubmitButton className="btn btn-primary" pendingLabel="Saving…">
                Save details
              </SubmitButton>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <div className="card card-pad">
            <p className="eyebrow">Workspace</p>
            <div className="mt-4 space-y-3">
              {[
                ["Clients", String(stats.clients)],
                ["Invoices", String(stats.invoices)],
                ["Collected", formatMoney(stats.total)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b6960]">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="flex items-center justify-between text-[11px] text-[#928f84]">
                <span>Last invoice</span>
                <span>
                  {recent
                    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                        new Date(recent.created_at),
                      )
                    : "None yet"}
                </span>
              </div>
            </div>
          </div>

          <PasswordForm />

          <div className="card card-pad">
            <p className="eyebrow">Your data</p>
            <h3 className="serif mt-2 text-[22px]">Take it with you</h3>
            <p className="mt-1.5 text-[11.5px] leading-5 text-[#6b6960]">
              Export every invoice as a CSV for your accountant, a spreadsheet, or a
              very satisfying backup.
            </p>
            <Link href="/api/export" className="btn btn-sm mt-4 w-full">
              <Download size={13} />
              Export invoices
            </Link>
          </div>

          <div className="rounded-2xl border border-[#d9d4c7] bg-[#f9e5db] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d8451b]">
              <ShieldCheck size={13} />
              Privacy first
            </p>
            <p className="mt-2 text-[11.5px] leading-5 text-[#d8451b]">
              Your workspace is local to this demo. Passwords are salted and hashed;
              sessions are signed, HTTP-only cookies.
            </p>
          </div>

          <div className="card card-pad">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
              <KeyRound size={13} />
              Session
            </p>
            <form action={logoutAction} className="mt-3">
              <button className="btn btn-sm btn-ghost w-full justify-start text-[#6b6960]">
                <LogOut size={14} />
                Sign out of Ledgerly
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="card card-pad flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#928f84]">
            About this build
          </p>
          <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#6b6960]">
            Ledgerly is a full-stack studio finance app built with Next.js App Router,
            server actions, TypeScript, and SQLite. Light theme by design, responsive
            from phone to wide desktop, with print-ready invoices.
          </p>
        </div>
        <span className="rounded-full border border-[#dad6ca] px-3 py-1.5 text-[10.5px] font-semibold text-[#6b6960]">
          v1.0 · Next.js + SQLite
        </span>
      </section>
    </div>
  );
}
