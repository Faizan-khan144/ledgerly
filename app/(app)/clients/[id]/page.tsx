import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, MapPin, Pencil, Phone, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getClient } from "@/lib/queries";
import { formatDate, formatMoney } from "@/lib/money";
import { updateClientAction } from "@/actions/clients";
import { DeleteClientButton } from "@/components/delete-client-button";
import { Money, StatusBadge } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";

export const metadata = { title: "Client" };

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;
  const data = getClient(user.id, id);
  if (!data) notFound();

  const { client, invoices } = data;

  return (
    <div className="page space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6b6960] hover:text-[#14140f]"
        >
          <ArrowLeft size={13} />
          Back to clients
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/invoices/new?client=${client.id}`} className="btn btn-sm">
            <Plus size={13} />
            New invoice
          </Link>
          <DeleteClientButton id={client.id} company={client.company} />
        </div>
      </div>

      {query.created ? (
        <div className="rounded-2xl border border-[#d9d4c7] bg-[#f9e5db] px-4 py-3 text-[12.5px] text-[#d8451b]">
          {client.company} was added to your client list.
        </div>
      ) : null}

      {query.error === "invoices" ? (
        <div className="rounded-2xl border border-[#e4c2bd] bg-[#f9e4e1] px-4 py-3 text-[12.5px] text-[#b3261e]">
          This client has invoices attached. Delete or reassign those invoices first.
        </div>
      ) : null}

      <section className="card overflow-hidden">
        <div className="relative bg-[#14140f] p-6 text-[#f6f4ed] sm:p-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d8451b]/30 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-[20px] bg-white/10 text-[26px] font-extrabold">
                {client.company.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#ffd7c9]">
                  Client profile
                </p>
                <h1 className="serif mt-1 text-[clamp(32px,4vw,44px)] leading-none">{client.company}</h1>
                <p className="mt-2 text-[12.5px] text-[#cfcabe]">{client.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-right">
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#9b978c]">Collected</p>
                <p className="serif mt-1 text-[24px]">{formatMoney(client.billed_cents)}</p>
              </div>
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#9b978c]">Outstanding</p>
                <p className="serif mt-1 text-[24px]">{formatMoney(client.outstanding_cents)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:p-8">
          <div>
            <p className="eyebrow">Contact</p>
            <div className="mt-4 space-y-3 text-[12.5px] text-[#55534a]">
              {client.email ? (
                <p className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#928f84]" />
                  {client.email}
                </p>
              ) : (
                <p className="text-[#928f84]">No email on file</p>
              )}
              {client.phone ? (
                <p className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#928f84]" />
                  {client.phone}
                </p>
              ) : null}
              {client.address ? (
                <p className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 text-[#928f84]" />
                  {client.address}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl bg-[#f6f4ed] p-4">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
              Since
            </p>
            <p className="mt-1 text-[13px] font-semibold">{formatDate(client.created_at.slice(0, 10))}</p>
            <p className="mt-3 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
              Invoices
            </p>
            <p className="mt-1 text-[13px] font-semibold">{invoices.length} total</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="serif text-[24px]">Invoice history</h2>
              <p className="mt-1 text-[11.5px] text-[#6b6960]">Every project, newest first</p>
            </div>
            <span className="rounded-full bg-[#efebe2] px-3 py-1 text-[10.5px] font-bold text-[#6b6960]">
              {invoices.length}
            </span>
          </div>
          {invoices.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Status</th>
                    <th>Issued</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <Link href={`/invoices/${invoice.id}`} className="font-semibold text-[#d8451b]">
                          {invoice.number}
                        </Link>
                      </td>
                      <td>
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="text-[#6b6960]">{formatDate(invoice.issue_date)}</td>
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
              <p className="text-[13px] font-semibold text-[#3a3931]">No invoices yet</p>
              <Link href="/invoices/new" className="btn btn-sm mt-1">
                Create the first one
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </section>

        <details className="card card-pad group h-fit">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <div>
              <p className="eyebrow">Details</p>
              <h2 className="serif mt-2 text-[24px]">Edit client</h2>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#dad6ca] text-[#6b6960] transition group-open:rotate-45">
              <Pencil size={13} />
            </span>
          </summary>

          <form action={updateClientAction} className="mt-5 space-y-3">
            <input type="hidden" name="id" value={client.id} />
            <div>
              <label className="label" htmlFor="edit-name">
                Contact name
              </label>
              <input id="edit-name" name="name" className="input" defaultValue={client.name} required />
            </div>
            <div>
              <label className="label" htmlFor="edit-company">
                Company
              </label>
              <input id="edit-company" name="company" className="input" defaultValue={client.company} required />
            </div>
            <div>
              <label className="label" htmlFor="edit-email">
                Email
              </label>
              <input id="edit-email" name="email" type="email" className="input" defaultValue={client.email} />
            </div>
            <div>
              <label className="label" htmlFor="edit-phone">
                Phone
              </label>
              <input id="edit-phone" name="phone" className="input" defaultValue={client.phone} />
            </div>
            <div>
              <label className="label" htmlFor="edit-address">
                Address
              </label>
              <textarea id="edit-address" name="address" className="textarea" defaultValue={client.address} />
            </div>
            <SubmitButton className="btn btn-primary w-full" pendingLabel="Saving…">
              Save changes
            </SubmitButton>
          </form>
        </details>
      </div>
    </div>
  );
}
