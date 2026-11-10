import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getInvoice } from "@/lib/queries";
import { formatDate, formatMoney } from "@/lib/money";
import { CopyButton } from "@/components/copy-button";
import { LogoMark } from "@/components/logo";
import { StatusBadge } from "@/components/ui";
import { InvoiceActions, PrintButton } from "@/components/invoice-actions";

export const metadata = { title: "Invoice" };

const statusSteps: { key: string; label: string; note: string }[] = [
  { key: "draft", label: "Draft created", note: "Ready to review" },
  { key: "sent", label: "Sent to client", note: "Waiting on payment" },
  { key: "paid", label: "Payment received", note: "All settled" },
];

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; duplicated?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;
  const invoice = getInvoice(user.id, id);
  if (!invoice) notFound();

  const activeIndex = invoice.status === "overdue" ? 1 : statusSteps.findIndex((step) => step.key === invoice.status);

  return (
    <div className="page space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6b6960] hover:text-[#14140f]"
        >
          <ArrowLeft size={13} />
          Back to invoices
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
          <InvoiceActions id={invoice.id} status={invoice.status} />
        </div>
      </div>

      {query.created ? (
        <div className="rounded-2xl border border-[#d9d4c7] bg-[#f9e5db] px-4 py-3 text-[12.5px] text-[#d8451b] no-print">
          Draft created. Review the details below, then mark it as sent when you are ready.
        </div>
      ) : null}

      {query.duplicated ? (
        <div className="rounded-2xl border border-[#d9d4c7] bg-[#e4f0e9] px-4 py-3 text-[12.5px] text-[#1f6f4f] no-print">
          Duplicate created as a fresh draft. Adjust the dates or line items before sending.
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Invoice detail</p>
          <h1 className="serif mt-2 text-[clamp(38px,5vw,54px)] leading-none">{invoice.number}</h1>
          <p className="mt-2 text-[12.5px] text-[#6b6960]">
            Issued {formatDate(invoice.issue_date)} · Due {formatDate(invoice.due_date)}
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <CopyButton value={invoice.number} label="Copy number" />
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
        <article className="card overflow-hidden">
          <div className="border-b border-[#e5e1d6] bg-[#fbfaf5] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <LogoMark className="!h-11 !w-11 !rounded-[10px]" />
                <div>
                  <p className="serif text-[23px] leading-none">{user.company_name}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#928f84]">
                    {user.name} · Studio finance
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#928f84]">Invoice</p>
                <p className="serif mt-1 text-[22px]">{invoice.number}</p>
                <p className="mt-1 text-[11px] text-[#6b6960]">Status: {invoice.status}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#928f84]">From</p>
                <p className="mt-2 text-[13px] font-semibold">{user.company_name}</p>
                <p className="mt-1 text-[11.5px] leading-5 text-[#6b6960]">
                  {user.company_address || "Add your studio address in settings"}
                  <br />
                  {user.company_phone}
                </p>
              </div>
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#928f84]">Bill to</p>
                <p className="mt-2 text-[13px] font-semibold">{invoice.client_company}</p>
                <p className="mt-1 text-[11.5px] leading-5 text-[#6b6960]">
                  {invoice.client_name}
                  <br />
                  {invoice.client_email}
                  <br />
                  {invoice.client_address}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Rate</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-normal text-[12.5px]">{item.description}</td>
                      <td className="text-right text-[12px] text-[#6b6960]">{item.quantity}</td>
                      <td className="text-right text-[12px] text-[#6b6960]">
                        {formatMoney(item.unit_price_cents)}
                      </td>
                      <td className="text-right text-[12.5px] font-semibold">
                        {formatMoney(item.quantity * item.unit_price_cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 ml-auto max-w-xs space-y-2.5 text-[12.5px]">
              <div className="flex justify-between text-[#6b6960]">
                <span>Subtotal</span>
                <span className="text-[#14140f]">{formatMoney(invoice.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-[#6b6960]">
                <span>Tax ({invoice.tax_rate}%)</span>
                <span className="text-[#14140f]">{formatMoney(invoice.tax_cents)}</span>
              </div>
              <div className="divider" />
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b6960]">
                  Total due
                </span>
                <span className="serif text-[30px] leading-none">{formatMoney(invoice.total_cents)}</span>
              </div>
            </div>

            {invoice.notes ? (
              <div className="mt-8 rounded-2xl border border-[#e5e1d6] bg-[#fbfaf5] p-4">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#928f84]">
                  Notes
                </p>
                <p className="mt-2 text-[12px] leading-6 text-[#55534a]">{invoice.notes}</p>
              </div>
            ) : null}

            <p className="mt-10 border-t border-[#e5e1d6] pt-5 text-center text-[10.5px] text-[#928f84]">
              Thank you for working with {user.company_name}. Payment is due by{" "}
              {formatDate(invoice.due_date)}.
            </p>
          </div>
        </article>

        <aside className="space-y-4 no-print">
          <div className="card card-pad">
            <p className="eyebrow">Status</p>
            <div className="mt-5 space-y-4">
              {statusSteps.map((step, index) => {
                const reached = activeIndex >= index;
                const overdue = invoice.status === "overdue" && step.key === "sent";
                return (
                  <div key={step.key} className="flex gap-3">
                    <span
                      className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border text-[9px] font-bold ${
                        reached
                          ? overdue
                            ? "border-[#e4c2bd] bg-[#f9e4e1] text-[#b3261e]"
                            : "border-[#f2b39c] bg-[#f9e5db] text-[#d8451b]"
                          : "border-[#dad6ca] bg-[#f6f4ed] text-[#a5a196]"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p className={`text-[12px] font-semibold ${reached ? "text-[#14140f]" : "text-[#928f84]"}`}>
                        {overdue ? "Overdue" : step.label}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-[#928f84]">
                        {overdue ? "Payment is past due" : step.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <p className="eyebrow">Client</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="avatar h-10 w-10">{invoice.client_company.slice(0, 2).toUpperCase()}</span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{invoice.client_company}</p>
                <p className="truncate text-[11px] text-[#6b6960]">{invoice.client_name}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 text-[11.5px] text-[#55534a]">
              {invoice.client_email ? (
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-[#928f84]" />
                  {invoice.client_email}
                </p>
              ) : null}
              {invoice.client_phone ? (
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-[#928f84]" />
                  {invoice.client_phone}
                </p>
              ) : null}
              {invoice.client_address ? (
                <p className="flex items-start gap-2">
                  <MapPin size={13} className="mt-0.5 text-[#928f84]" />
                  {invoice.client_address}
                </p>
              ) : null}
            </div>
            <Link href={`/clients/${invoice.client_id}`} className="btn btn-sm mt-4 w-full">
              <Building2 size={13} />
              View client
            </Link>
          </div>

          <div className="card card-pad">
            <p className="eyebrow">Dates</p>
            <div className="mt-4 space-y-3 text-[11.5px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6b6960]">
                  <CalendarDays size={13} />
                  Issued
                </span>
                <span className="font-medium">{formatDate(invoice.issue_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#6b6960]">
                  <CalendarDays size={13} />
                  Due
                </span>
                <span className="font-medium">{formatDate(invoice.due_date)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
