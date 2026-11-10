import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { all, type Client } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { nextInvoiceNumber } from "@/lib/queries";
import { InvoiceComposer } from "@/components/invoice-composer";
import { PageHeading } from "@/components/ui";

export const metadata = { title: "New invoice" };

function isoDate(offsetDays = 0) {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const clients = all<Pick<Client, "id" | "name" | "company">>(
    "SELECT id, name, company FROM clients WHERE user_id = ? ORDER BY company COLLATE NOCASE",
    user.id,
  ).map((client) => ({ id: client.id, name: client.name, company: client.company }));
  const number = nextInvoiceNumber(user.id);
  const defaultClientId = clients.some((client) => client.id === query.client)
    ? query.client
    : undefined;

  return (
    <div className="page space-y-7">
      <div>
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6b6960] hover:text-[#14140f]"
        >
          <ArrowLeft size={13} />
          Back to invoices
        </Link>
      </div>

      <PageHeading
        eyebrow="New draft"
        title="Build an invoice."
        subtitle="Pick a client, add the work, and let the totals take care of themselves. You can send it when it feels right."
      />

      {clients.length ? (
        <InvoiceComposer
          clients={clients}
          number={number}
          today={isoDate(0)}
          dueDate={isoDate(14)}
          defaultClientId={defaultClientId}
        />
      ) : (
        <div className="card empty">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#efebe2] text-[#6b6960]">
            <UserRound size={19} />
          </span>
          <p className="text-[15px] font-semibold text-[#3a3931]">Add a client first</p>
          <p className="max-w-sm text-[12px] leading-5">
            Invoices need someone to send them to. Create your first client, then come
            back here.
          </p>
          <Link href="/clients" className="btn btn-primary mt-2">
            Go to clients
          </Link>
        </div>
      )}
    </div>
  );
}
