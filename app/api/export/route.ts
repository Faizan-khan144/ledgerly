import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { formatMoney } from "@/lib/money";

type ExportRow = {
  number: string;
  status: string;
  issue_date: string;
  due_date: string;
  company: string;
  name: string;
  total_cents: number;
  tax_rate: number;
};

function escape(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = all<ExportRow>(
    `SELECT invoices.number, invoices.status, invoices.issue_date, invoices.due_date,
            clients.company, clients.name, invoices.total_cents, invoices.tax_rate
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.user_id = ?
     ORDER BY invoices.issue_date DESC`,
    user.id,
  );

  const header = [
    "Invoice",
    "Status",
    "Issued",
    "Due",
    "Client",
    "Contact",
    "Tax rate",
    "Total",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        escape(row.number),
        escape(row.status),
        escape(row.issue_date),
        escape(row.due_date),
        escape(row.company),
        escape(row.name),
        escape(`${row.tax_rate}%`),
        escape(formatMoney(row.total_cents)),
      ].join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="ledgerly-invoices-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
