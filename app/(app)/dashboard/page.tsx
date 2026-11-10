import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Plus,
  Boxes,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDashboard } from "@/lib/queries";
import { formatCompactMoney, formatDate, formatMoney } from "@/lib/money";
import { CountUp } from "@/components/count-up";
import { Money, PageHeading, SectionHeader, StatCard, StatusBadge, ViewAll } from "@/components/ui";

export const metadata = { title: "Overview" };

const activityIcon: Record<string, typeof FileText> = {
  paid: CheckCircle2,
  sent: ArrowUpRight,
  draft: FileText,
  overdue: Clock3,
  client: Users,
  workspace: Boxes,
  delete: FileText,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const data = getDashboard(user.id);
  const maxMonth = Math.max(...data.monthly.map((month) => month.total), 1);
  const collectionRate =
    data.paidCents + data.outstandingCents > 0
      ? Math.round((data.paidCents / (data.paidCents + data.outstandingCents)) * 100)
      : 0;

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="page space-y-8">
      {params.welcome ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#d9d4c7] bg-[#f9e5db] px-4 py-3 text-[12.5px] text-[#d8451b]">
          <CheckCircle2 size={15} />
          Your workspace is ready. We added a starter client and a draft invoice.
        </div>
      ) : null}

      <PageHeading
        eyebrow={today}
        title={`Good to see you, ${user.name.split(" ")[0]}.`}
        subtitle="Here is the shape of your studio this month — what came in, what is waiting, and what needs a gentle nudge."
      >
        <Link href="/invoices/new" className="btn btn-primary">
          <Plus size={15} />
          New invoice
        </Link>
      </PageHeading>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected"
          value={<CountUp value={data.paidCents} kind="compact-money" />}
          note={`${data.paidCount} paid invoice${data.paidCount === 1 ? "" : "s"}`}
          tone="accent"
        />
        <StatCard
          label="Outstanding"
          value={<CountUp value={data.outstandingCents} kind="compact-money" />}
          note={`${data.outstandingCount} awaiting payment`}
        />
        <StatCard
          label="Overdue"
          value={<CountUp value={data.overdueCents} kind="compact-money" />}
          note={data.overdue.length ? "Needs a follow-up" : "Nothing overdue"}
          tone={data.overdueCents > 0 ? "warn" : "default"}
        />
        <StatCard
          label="Collection rate"
          value={<CountUp value={collectionRate} kind="percent" />}
          note={`${data.clientCount} clients · ${data.draftCount} drafts`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="card card-pad">
          <SectionHeader
            title="Revenue rhythm"
            subtitle="Paid invoices across the last six months"
            action={
              <span className="rounded-full bg-[#efebe2] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#6b6960]">
                {formatMoney(data.paidCents)} total
              </span>
            }
          />
          <div className="mt-8 flex h-[220px] items-end gap-2 sm:gap-4">
            {data.monthly.map((month) => {
              const height = Math.max(6, Math.round((month.total / maxMonth) * 100));
              return (
                <div key={month.key} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="chart-bar w-full rounded-t-[8px] bg-[#e4f0e9] transition-colors group-hover:bg-[#d8451b]"
                      style={{ height: `${height}%` }}
                    />
                    {month.total > 0 ? (
                      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-[#14140f] px-2 py-1 text-[9px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {formatCompactMoney(month.total)}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#928f84]">
                    {month.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-[#e5e1d6] rounded-2xl bg-[#f6f4ed] py-3 text-center">
            <div>
              <p className="serif text-[21px]">{data.paidCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#928f84]">Paid</p>
            </div>
            <div>
              <p className="serif text-[21px]">{data.outstandingCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#928f84]">Sent</p>
            </div>
            <div>
              <p className="serif text-[21px]">{data.draftCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#928f84]">Draft</p>
            </div>
          </div>
        </div>

        <div className="card card-pad flex flex-col">
          <SectionHeader title="Needs attention" subtitle="Overdue, oldest first" />
          <div className="mt-4 flex-1 space-y-2.5">
            {data.overdue.length ? (
              data.overdue.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-[#f2e9e2] bg-[#fdf8f3] p-3.5 transition hover:border-[#dfc0ba]"
                >
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#f9e4e1] text-[#b3261e]">
                    <Clock3 size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-semibold">
                      {invoice.client_company}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] text-[#928f84]">
                      Due {formatDate(invoice.due_date)}
                    </span>
                  </span>
                  <Money cents={invoice.total_cents} className="text-[12.5px] font-semibold" />
                </Link>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f9e5db] text-[#d8451b]">
                  <CheckCircle2 size={19} />
                </span>
                <p className="mt-3 text-[13px] font-semibold">All clear</p>
                <p className="mt-1 max-w-[190px] text-[11.5px] leading-5 text-[#6b6960]">
                  No overdue invoices. Your future self says thank you.
                </p>
              </div>
            )}
          </div>
          <Link href="/invoices?status=overdue" className="btn btn-sm mt-4 w-full">
            Review overdue invoices
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5">
            <SectionHeader title="Recent invoices" subtitle="The latest activity in your ledger" />
            <ViewAll href="/invoices" />
          </div>
          <div className="table-wrap mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link href={`/invoices/${invoice.id}`} className="font-semibold text-[#d8451b]">
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
                    <td className="font-semibold">
                      <Money cents={invoice.total_cents} />
                    </td>
                    <td className="text-[#6b6960]">{formatDate(invoice.issue_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-pad">
            <SectionHeader title="Top clients" subtitle="By lifetime paid revenue" />
            <div className="mt-5 space-y-4">
              {data.topClients.map((client, index) => {
                const max = Math.max(...data.topClients.map((row) => row.total), 1);
                return (
                  <div key={client.id}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="text-[10px] font-bold text-[#a5a196]">0{index + 1}</span>
                        {client.company}
                      </span>
                      <Money cents={client.total} className="font-semibold" />
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efebe2]">
                      <div
                        className="chart-fill h-full rounded-full bg-[#d8451b]"
                        style={{ width: `${Math.max(8, (client.total / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <SectionHeader title="Activity" subtitle="A small audit trail" />
            <div className="mt-5 space-y-4">
              {data.activities.map((activity) => {
                const Icon = activityIcon[activity.kind] ?? CircleDollarSign;
                return (
                  <div key={activity.id} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-[#efebe2] text-[#6b6960]">
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] leading-5 text-[#3a3931]">{activity.message}</p>
                      <p className="mt-0.5 text-[10px] text-[#928f84]">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(activity.created_at))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="card card-pad flex flex-wrap items-center justify-between gap-5 bg-[#14140f] text-[#f6f4ed]">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/10 text-[#ffd7c9]">
            <CalendarDays size={19} />
          </span>
          <div>
            <p className="serif text-[24px] leading-tight">A little nudge goes a long way.</p>
            <p className="mt-1.5 max-w-xl text-[12.5px] leading-6 text-[#cfcabe]">
              You have {data.outstandingCount + data.overdue.length} invoices waiting on a
              reply. Open one and send a friendly reminder while the work is still fresh.
            </p>
          </div>
        </div>
        <Link href="/invoices?status=overdue" className="btn btn-sm border-white/20 bg-white text-[#14140f] hover:bg-[#efebe2]">
          Review the list
          <ArrowRight size={13} />
        </Link>
      </section>
    </div>
  );
}
