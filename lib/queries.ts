import { all, get, run, today, type Activity, type Client, type Invoice, type InvoiceItem } from "./db";

export type InvoiceWithClient = Invoice & {
  client_name: string;
  client_company: string;
};

export type ClientWithStats = Client & {
  invoice_count: number;
  billed_cents: number;
  outstanding_cents: number;
};

export type InvoiceDetail = InvoiceWithClient & {
  client_email: string;
  client_phone: string;
  client_address: string;
  items: InvoiceItem[];
};

export type DashboardData = {
  paidCents: number;
  paidCount: number;
  outstandingCents: number;
  outstandingCount: number;
  overdueCents: number;
  draftCount: number;
  clientCount: number;
  recent: InvoiceWithClient[];
  monthly: { key: string; label: string; total: number }[];
  topClients: { id: string; company: string; total: number }[];
  activities: Activity[];
  overdue: InvoiceWithClient[];
};

export function markOverdueInvoices(userId: string) {
  run(
    "UPDATE invoices SET status = 'overdue' WHERE user_id = ? AND status = 'sent' AND due_date < ?",
    userId,
    today(),
  );
}

export function getDashboard(userId: string): DashboardData {
  markOverdueInvoices(userId);

  const paid = get<{ total: number; count: number }>(
    "SELECT COALESCE(SUM(total_cents), 0) AS total, COUNT(*) AS count FROM invoices WHERE user_id = ? AND status = 'paid'",
    userId,
  )!;
  const outstanding = get<{ total: number; count: number }>(
    "SELECT COALESCE(SUM(total_cents), 0) AS total, COUNT(*) AS count FROM invoices WHERE user_id = ? AND status = 'sent'",
    userId,
  )!;
  const overdue = get<{ total: number; count: number }>(
    "SELECT COALESCE(SUM(total_cents), 0) AS total, COUNT(*) AS count FROM invoices WHERE user_id = ? AND status = 'overdue'",
    userId,
  )!;
  const drafts = get<{ count: number }>(
    "SELECT COUNT(*) AS count FROM invoices WHERE user_id = ? AND status = 'draft'",
    userId,
  )!;
  const clients = get<{ count: number }>(
    "SELECT COUNT(*) AS count FROM clients WHERE user_id = ?",
    userId,
  )!;

  const recent = all<InvoiceWithClient>(
    `SELECT invoices.*, clients.name AS client_name, clients.company AS client_company
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.user_id = ?
     ORDER BY invoices.created_at DESC LIMIT 6`,
    userId,
  );

  const start = new Date();
  start.setDate(1);
  start.setMonth(start.getMonth() - 5);
  const startKey = start.toISOString().slice(0, 10);

  const paidByMonth = all<{ key: string; total: number }>(
    `SELECT substr(issue_date, 1, 7) AS key, SUM(total_cents) AS total
     FROM invoices
     WHERE user_id = ? AND status = 'paid' AND issue_date >= ?
     GROUP BY key ORDER BY key`,
    userId,
    startKey,
  );

  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(start);
    date.setMonth(start.getMonth() + index);
    const key = date.toISOString().slice(0, 7);
    return {
      key,
      label: date.toLocaleString("en-US", { month: "short" }),
      total: paidByMonth.find((row) => row.key === key)?.total ?? 0,
    };
  });

  const topClients = all<{ id: string; company: string; total: number }>(
    `SELECT clients.id, clients.company, SUM(invoices.total_cents) AS total
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.user_id = ? AND invoices.status = 'paid'
     GROUP BY clients.id ORDER BY total DESC LIMIT 4`,
    userId,
  );

  const activities = all<Activity>(
    "SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 7",
    userId,
  );

  const overdueInvoices = all<InvoiceWithClient>(
    `SELECT invoices.*, clients.name AS client_name, clients.company AS client_company
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.user_id = ? AND invoices.status = 'overdue'
     ORDER BY invoices.due_date ASC LIMIT 4`,
    userId,
  );

  return {
    paidCents: paid.total,
    paidCount: paid.count,
    outstandingCents: outstanding.total,
    outstandingCount: outstanding.count,
    overdueCents: overdue.total,
    draftCount: drafts.count,
    clientCount: clients.count,
    recent,
    monthly,
    topClients,
    activities,
    overdue: overdueInvoices,
  };
}

export type InvoiceFilters = {
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export function listInvoices(userId: string, filters: InvoiceFilters = {}) {
  markOverdueInvoices(userId);

  const pageSize = filters.pageSize ?? 8;
  const page = Math.max(1, filters.page ?? 1);
  const clauses = ["invoices.user_id = ?"];
  const params: (string | number)[] = [userId];

  if (filters.status && ["draft", "sent", "paid", "overdue"].includes(filters.status)) {
    clauses.push("invoices.status = ?");
    params.push(filters.status);
  }

  if (filters.q) {
    clauses.push("(invoices.number LIKE ? OR clients.company LIKE ? OR clients.name LIKE ?)");
    const term = `%${filters.q}%`;
    params.push(term, term, term);
  }

  const where = clauses.join(" AND ");
  const count = get<{ count: number }>(
    `SELECT COUNT(*) AS count FROM invoices JOIN clients ON clients.id = invoices.client_id WHERE ${where}`,
    ...params,
  )!;

  const rows = all<InvoiceWithClient>(
    `SELECT invoices.*, clients.name AS client_name, clients.company AS client_company
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE ${where}
     ORDER BY invoices.issue_date DESC, invoices.created_at DESC
     LIMIT ? OFFSET ?`,
    ...params,
    pageSize,
    (page - 1) * pageSize,
  );

  return {
    rows,
    total: count.count,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(count.count / pageSize)),
  };
}

export function getInvoice(userId: string, id: string): InvoiceDetail | null {
  markOverdueInvoices(userId);

  const invoice = get<InvoiceDetail>(
    `SELECT invoices.*, clients.name AS client_name, clients.company AS client_company,
            clients.email AS client_email, clients.phone AS client_phone,
            clients.address AS client_address
     FROM invoices JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.id = ? AND invoices.user_id = ?`,
    id,
    userId,
  );
  if (!invoice) return null;

  invoice.items = all<InvoiceItem>(
    "SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid",
    id,
  );
  return invoice;
}

export function listClients(userId: string, filters: { q?: string; page?: number } = {}) {
  const pageSize = 6;
  const page = Math.max(1, filters.page ?? 1);
  const params: (string | number)[] = [userId];
  let where = "clients.user_id = ?";

  if (filters.q) {
    where += " AND (clients.name LIKE ? OR clients.company LIKE ? OR clients.email LIKE ?)";
    const term = `%${filters.q}%`;
    params.push(term, term, term);
  }

  const count = get<{ count: number }>(
    `SELECT COUNT(*) AS count FROM clients WHERE ${where}`,
    ...params,
  )!;

  const rows = all<ClientWithStats>(
    `SELECT clients.*,
            COUNT(invoices.id) AS invoice_count,
            COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.total_cents END), 0) AS billed_cents,
            COALESCE(SUM(CASE WHEN invoices.status IN ('sent', 'overdue') THEN invoices.total_cents END), 0) AS outstanding_cents
     FROM clients LEFT JOIN invoices ON invoices.client_id = clients.id
     WHERE ${where}
     GROUP BY clients.id
     ORDER BY clients.company COLLATE NOCASE
     LIMIT ? OFFSET ?`,
    ...params,
    pageSize,
    (page - 1) * pageSize,
  );

  return {
    rows,
    total: count.count,
    page,
    pages: Math.max(1, Math.ceil(count.count / pageSize)),
  };
}

export function getClient(userId: string, id: string) {
  markOverdueInvoices(userId);

  const client = get<ClientWithStats>(
    `SELECT clients.*,
            COUNT(invoices.id) AS invoice_count,
            COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.total_cents END), 0) AS billed_cents,
            COALESCE(SUM(CASE WHEN invoices.status IN ('sent', 'overdue') THEN invoices.total_cents END), 0) AS outstanding_cents
     FROM clients LEFT JOIN invoices ON invoices.client_id = clients.id
     WHERE clients.id = ? AND clients.user_id = ?
     GROUP BY clients.id`,
    id,
    userId,
  );
  if (!client) return null;

  const invoices = all<Invoice>(
    "SELECT * FROM invoices WHERE client_id = ? AND user_id = ? ORDER BY issue_date DESC",
    id,
    userId,
  );

  return { client, invoices };
}

export function nextInvoiceNumber(userId: string) {
  const row = get<{ count: number }>(
    "SELECT COUNT(*) AS count FROM invoices WHERE user_id = ?",
    userId,
  )!;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(row.count + 1).padStart(3, "0")}`;
}

export function statusCounts(userId: string) {
  markOverdueInvoices(userId);

  const rows = all<{ status: string; count: number }>(
    "SELECT status, COUNT(*) AS count FROM invoices WHERE user_id = ? GROUP BY status",
    userId,
  );
  return Object.fromEntries(rows.map((row) => [row.status, row.count])) as Record<string, number>;
}
