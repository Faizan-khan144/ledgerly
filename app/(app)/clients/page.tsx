import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Search, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { get } from "@/lib/db";
import { listClients } from "@/lib/queries";
import { formatMoney } from "@/lib/money";
import { PageHeading } from "@/components/ui";
import { ClientComposer } from "@/components/client-composer";

export const metadata = { title: "Clients" };

function buildHref(params: { q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const value = search.toString();
  return value ? `/clients?${value}` : "/clients";
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; deleted?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Number(params.page ?? 1);
  const result = listClients(user.id, { q, page });
  const totals = get<{ billed: number; outstanding: number }>(
    `SELECT
       COALESCE(SUM(CASE WHEN status = 'paid' THEN total_cents END), 0) AS billed,
       COALESCE(SUM(CASE WHEN status IN ('sent', 'overdue') THEN total_cents END), 0) AS outstanding
     FROM invoices WHERE user_id = ?`,
    user.id,
  )!;

  return (
    <div className="page space-y-7">
      <PageHeading
        eyebrow="People, not rows"
        title="Clients"
        subtitle="The people behind the projects. Keep the relationship warm and the invoice history in one glance."
      >
        <ClientComposer />
      </PageHeading>

      {params.deleted ? (
        <div className="rounded-2xl border border-[#dad6ca] bg-[#fbfaf5] px-4 py-3 text-[12.5px] text-[#55534a]">
          Client removed. The workspace has been updated.
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card card-pad">
          <p className="stat-label">Relationships</p>
          <p className="stat-value">{result.total}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">Active clients in your studio</p>
        </div>
        <div className="card card-pad">
          <p className="stat-label">Lifetime billed</p>
          <p className="stat-value">{formatMoney(totals.billed)}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">Paid invoices to date</p>
        </div>
        <div className="card card-pad">
          <p className="stat-label">On the table</p>
          <p className="stat-value">{formatMoney(totals.outstanding)}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">Sent or overdue</p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form action="/clients" className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#928f84]" />
          <input
            name="q"
            defaultValue={q}
            className="input h-10 pl-9"
            placeholder="Search by name, company, or email…"
          />
        </form>
        <p className="text-[11px] text-[#928f84]">
          {result.total} client{result.total === 1 ? "" : "s"} · page {result.page} of {result.pages}
        </p>
      </div>

      {result.rows.length ? (
        <section className="grid gap-3 md:grid-cols-2">
          {result.rows.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="card group p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#c6c1b3] hover:shadow-[0_18px_40px_-30px_rgba(30,29,26,0.4)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="avatar h-11 w-11 text-[12px]">
                    {client.company.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold leading-tight">{client.company}</p>
                    <p className="mt-1 text-[11.5px] text-[#6b6960]">{client.name}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#efebe2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6960]">
                  {client.invoice_count} invoice{client.invoice_count === 1 ? "" : "s"}
                </span>
              </div>

              {client.email ? (
                <p className="mt-4 flex items-center gap-2 text-[11.5px] text-[#6b6960]">
                  <Mail size={13} className="text-[#a5a196]" />
                  {client.email}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#f6f4ed] p-3">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Collected
                  </p>
                  <p className="mt-1 text-[13px] font-semibold">{formatMoney(client.billed_cents)}</p>
                </div>
                <div className="border-l border-[#dad6ca] pl-3">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Outstanding
                  </p>
                  <p className="mt-1 text-[13px] font-semibold">{formatMoney(client.outstanding_cents)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10.5px] text-[#928f84]">
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  View profile
                </span>
                <span className="font-semibold text-[#d8451b] opacity-0 transition group-hover:opacity-100">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="card empty">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#efebe2] text-[#6b6960]">
            <Users size={19} />
          </span>
          <p className="text-[14px] font-semibold text-[#3a3931]">
            {q ? "No matching clients" : "Your client list is waiting"}
          </p>
          <p className="max-w-xs text-[12px] leading-5">
            {q
              ? "Try a different name, company, or email."
              : "Add the first person you love working with and their invoice history will live here."}
          </p>
          {!q ? <ClientComposer /> : null}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#928f84]">Showing {result.rows.length} of {result.total}</p>
        <div className="flex items-center gap-2">
          <Link
            href={buildHref({ q, page: Math.max(1, result.page - 1) })}
            className={`btn btn-sm ${result.page === 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            <ArrowLeft size={13} />
            Previous
          </Link>
          <span className="px-2 text-[11px] font-semibold text-[#6b6960]">
            {result.page} / {result.pages}
          </span>
          <Link
            href={buildHref({ q, page: Math.min(result.pages, result.page + 1) })}
            className={`btn btn-sm ${result.page === result.pages ? "pointer-events-none opacity-40" : ""}`}
          >
            Next
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
