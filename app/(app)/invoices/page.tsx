import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Search } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listInvoices, statusCounts } from "@/lib/queries";
import { formatDate, formatMoney } from "@/lib/money";
import { Money, PageHeading, StatusBadge } from "@/components/ui";

export const metadata = { title: "Invoices" };

const filters = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function buildHref(params: { status?: string; q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const value = search.toString();
  return value ? `/invoices?${value}` : "/invoices";
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; deleted?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const status = params.status ?? "";
  const q = params.q ?? "";
  const page = Number(params.page ?? 1);
  const result = listInvoices(user.id, { status, q, page });
  const counts = statusCounts(user.id);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="page space-y-7">
      <PageHeading
        eyebrow="The ledger"
        title="Invoices"
        subtitle="Every number, from the first draft to the final payment. Filter the noise and keep the money moving."
      >
        <Link href="/invoices/new" className="btn btn-primary">
          <Plus size={15} />
          New invoice
        </Link>
      </PageHeading>

      {params.deleted ? (
        <div className="rounded-2xl border border-[#dad6ca] bg-[#fbfaf5] px-4 py-3 text-[12.5px] text-[#55534a]">
          Invoice deleted. The ledger has been updated.
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card card-pad">
          <p className="stat-label">All invoices</p>
          <p className="stat-value">{total}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">Across every status</p>
        </div>
        <div className="card card-pad">
          <p className="stat-label">Awaiting payment</p>
          <p className="stat-value">{(counts.sent ?? 0) + (counts.overdue ?? 0)}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">
            {counts.overdue ?? 0} overdue · {counts.sent ?? 0} sent
          </p>
        </div>
        <div className="card card-pad">
          <p className="stat-label">Drafts in progress</p>
          <p className="stat-value">{counts.draft ?? 0}</p>
          <p className="mt-1 text-[11.5px] text-[#6b6960]">Not sent yet</p>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#e5e1d6] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {filters.map((filter) => {
              const active = status === filter.value;
              return (
                <Link
                  key={filter.label}
                  href={buildHref({ status: filter.value, q })}
                  className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition ${
                    active
                      ? "bg-[#14140f] text-white"
                      : "text-[#6b6960] hover:bg-[#efebe2] hover:text-[#14140f]"
                  }`}
                >
                  {filter.label}
                  {filter.value && counts[filter.value] ? (
                    <span className={`ml-1.5 ${active ? "text-white/60" : "text-[#a5a196]"}`}>
                      {counts[filter.value]}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <form className="relative w-full sm:w-64" action="/invoices">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#928f84]" />
            <input
              name="q"
              defaultValue={q}
              className="input h-9 pl-9"
              placeholder="Search invoices or clients…"
            />
          </form>
        </div>

        {result.rows.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-semibold text-[#d8451b] hover:underline"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="avatar">
                          {invoice.client_company.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="block text-[12.5px] font-medium">{invoice.client_company}</span>
                          <span className="block text-[10.5px] text-[#928f84]">{invoice.client_name}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="text-[#6b6960]">{formatDate(invoice.issue_date)}</td>
                    <td className="text-[#6b6960]">{formatDate(invoice.due_date)}</td>
                    <td className="text-right font-semibold">
                      <Money cents={invoice.total_cents} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#efebe2] text-[#6b6960]">
              <Search size={18} />
            </span>
            <p className="text-[14px] font-semibold text-[#3a3931]">No invoices found</p>
            <p className="max-w-xs text-[12px] leading-5">
              Try a different filter or search term, or create a fresh invoice.
            </p>
            <Link href="/invoices/new" className="btn btn-sm mt-1">
              <Plus size={13} />
              New invoice
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e1d6] px-4 py-3">
          <p className="text-[11px] text-[#928f84]">
            Showing {result.rows.length} of {result.total} invoices
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={buildHref({ status, q, page: Math.max(1, result.page - 1) })}
              className={`btn btn-sm ${result.page === 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              <ArrowLeft size={13} />
              Previous
            </Link>
            <span className="px-2 text-[11px] font-semibold text-[#6b6960]">
              {result.page} / {result.pages}
            </span>
            <Link
              href={buildHref({ status, q, page: Math.min(result.pages, result.page + 1) })}
              className={`btn btn-sm ${result.page === result.pages ? "pointer-events-none opacity-40" : ""}`}
            >
              Next
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <section className="card card-pad bg-[#14140f] text-[#f6f4ed]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ffd7c9]">
              A small habit
            </p>
            <p className="serif mt-2 text-[25px]">Send on Fridays. Follow up on Wednesdays.</p>
            <p className="mt-1.5 text-[12px] text-[#cfcabe]">
              A predictable rhythm keeps cash flow calm and clients comfortable.
            </p>
          </div>
          <span className="rounded-full border border-white/15 px-4 py-2 text-[11px] text-[#ddd8cc]">
            {formatMoney(result.rows.reduce((sum, row) => sum + row.total_cents, 0))} on this page
          </span>
        </div>
      </section>
    </div>
  );
}
