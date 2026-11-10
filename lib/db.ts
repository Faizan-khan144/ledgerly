import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";

export type User = {
  id: string;
  name: string;
  email: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  created_at: string;
};

export type Client = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Invoice = {
  id: string;
  user_id: string;
  client_id: string;
  number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  notes: string;
  tax_rate: number;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
};

export type Activity = {
  id: string;
  user_id: string;
  kind: string;
  message: string;
  created_at: string;
};

type Row = Record<string, string | number | bigint | null | Uint8Array>;

function createDb() {
  const dataDir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
  fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = process.env.DATABASE_PATH ?? path.join(dataDir, "ledgerly.db");
  const database = new DatabaseSync(dbPath);
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec("PRAGMA journal_mode = WAL;");
  migrate(database);
  seed(database);
  return database;
}

const globalForDb = globalThis as unknown as { ledgerlyDb?: DatabaseSync };
export const db = globalForDb.ledgerlyDb ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.ledgerlyDb = db;

export function get<T>(sql: string, ...params: (string | number | null)[]) {
  return (db.prepare(sql).get(...params) as unknown as T | undefined) ?? null;
}

export function all<T>(sql: string, ...params: (string | number | null)[]) {
  return db.prepare(sql).all(...params) as unknown as T[];
}

export function run(sql: string, ...params: (string | number | null)[]) {
  return db.prepare(sql).run(...params);
}

export function transaction<T>(callback: () => T) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = callback();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function logActivity(userId: string, kind: string, message: string) {
  run(
    "INSERT INTO activities (id, user_id, kind, message, created_at) VALUES (?, ?, ?, ?, ?)",
    randomUUID(),
    userId,
    kind,
    message,
    new Date().toISOString(),
  );
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function daysFrom(date: string, days: number) {
  return new Date(new Date(`${date}T12:00:00`).getTime() + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

function migrate(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      company_name TEXT NOT NULL,
      company_address TEXT NOT NULL DEFAULT '',
      company_phone TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
      number TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      tax_rate REAL NOT NULL DEFAULT 0,
      subtotal_cents INTEGER NOT NULL DEFAULT 0,
      tax_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
    CREATE INDEX IF NOT EXISTS idx_items_invoice ON invoice_items(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
  `);
}

type SeedClient = Omit<Client, "user_id" | "created_at">;
type SeedInvoice = {
  client: string;
  number: string;
  status: InvoiceStatus;
  days: number;
  notes: string;
  items: { description: string; quantity: number; unitPrice: number }[];
};

function seed(database: DatabaseSync) {
  const existing = database.prepare("SELECT id FROM users WHERE id = ?").get("usr_demo");
  if (existing) return;

  const createdAt = new Date().toISOString();
  const demoUser: User = {
    id: "usr_demo",
    name: "Faizan Khan",
    email: "faizan@ledgerly.app",
    company_name: "Faizan Studio",
    company_address: "Karachi, Pakistan",
    company_phone: "+92 300 0000000",
    created_at: createdAt,
  };

  const insertUser = database.prepare(
    `INSERT INTO users (id, name, email, password_hash, company_name, company_address, company_phone, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  insertUser.run(
    demoUser.id,
    demoUser.name,
    demoUser.email,
    hashPassword("demo1234"),
    demoUser.company_name,
    demoUser.company_address,
    demoUser.company_phone,
    demoUser.created_at,
  );

  const clients: SeedClient[] = [
    {
      id: "cli_northwind",
      name: "Ayesha Siddiqui",
      company: "Northwind Trading",
      email: "ayesha@northwind.co",
      phone: "+92 300 1122334",
      address: "Clifton Block 5, Karachi",
    },
    {
      id: "cli_aperture",
      name: "Daniel Reed",
      company: "Aperture Labs",
      email: "daniel@aperture.studio",
      phone: "+44 7700 900123",
      address: "22 Camden Road, London",
    },
    {
      id: "cli_cinder",
      name: "Sara Malik",
      company: "Cinder Studio",
      email: "sara@cinder.design",
      phone: "+92 321 5566778",
      address: "Gulberg III, Lahore",
    },
    {
      id: "cli_mono",
      name: "Hassan Raza",
      company: "Mono Goods",
      email: "hassan@monogoods.pk",
      phone: "+92 333 4455667",
      address: "F-7 Markaz, Islamabad",
    },
    {
      id: "cli_fieldwork",
      name: "Elena Park",
      company: "Fieldwork Co.",
      email: "elena@fieldwork.co",
      phone: "+1 415 555 0134",
      address: "San Francisco, CA",
    },
    {
      id: "cli_paperkite",
      name: "Omar Farooq",
      company: "Paper Kite",
      email: "omar@paperkite.io",
      phone: "+92 345 9988776",
      address: "DHA Phase 6, Karachi",
    },
  ];

  const insertClient = database.prepare(
    `INSERT INTO clients (id, user_id, name, company, email, phone, address, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const client of clients) {
    insertClient.run(
      client.id,
      demoUser.id,
      client.name,
      client.company,
      client.email,
      client.phone,
      client.address,
      createdAt,
    );
  }

  const seedInvoices: SeedInvoice[] = [
    {
      client: "cli_northwind",
      number: "INV-2026-001",
      status: "paid",
      days: 158,
      notes: "Brand identity sprint. Thank you for the quick feedback loops.",
      items: [
        { description: "Discovery workshop", quantity: 1, unitPrice: 180000 },
        { description: "Visual identity system", quantity: 1, unitPrice: 320000 },
      ],
    },
    {
      client: "cli_aperture",
      number: "INV-2026-002",
      status: "paid",
      days: 143,
      notes: "Product landing page and design tokens.",
      items: [
        { description: "Landing page design", quantity: 1, unitPrice: 260000 },
        { description: "Design token library", quantity: 1, unitPrice: 95000 },
      ],
    },
    {
      client: "cli_cinder",
      number: "INV-2026-003",
      status: "paid",
      days: 126,
      notes: "Editorial layout for the spring catalogue.",
      items: [
        { description: "Catalogue layout (24 pages)", quantity: 1, unitPrice: 210000 },
        { description: "Image retouching", quantity: 12, unitPrice: 4500 },
      ],
    },
    {
      client: "cli_mono",
      number: "INV-2026-004",
      status: "paid",
      days: 111,
      notes: "Packaging system for the home collection.",
      items: [
        { description: "Packaging concept", quantity: 1, unitPrice: 175000 },
        { description: "Print-ready artwork", quantity: 3, unitPrice: 28000 },
      ],
    },
    {
      client: "cli_fieldwork",
      number: "INV-2026-005",
      status: "paid",
      days: 94,
      notes: "Research synthesis and opportunity map.",
      items: [
        { description: "User interviews", quantity: 8, unitPrice: 18000 },
        { description: "Synthesis workshop", quantity: 1, unitPrice: 120000 },
      ],
    },
    {
      client: "cli_paperkite",
      number: "INV-2026-006",
      status: "paid",
      days: 78,
      notes: "Editorial identity for a new quarterly journal.",
      items: [
        { description: "Identity direction", quantity: 1, unitPrice: 240000 },
        { description: "Type specimen", quantity: 1, unitPrice: 85000 },
      ],
    },
    {
      client: "cli_northwind",
      number: "INV-2026-007",
      status: "paid",
      days: 61,
      notes: "Website refresh, phase one.",
      items: [
        { description: "Homepage art direction", quantity: 1, unitPrice: 210000 },
        { description: "Responsive UI design", quantity: 6, unitPrice: 22000 },
      ],
    },
    {
      client: "cli_aperture",
      number: "INV-2026-008",
      status: "overdue",
      days: 49,
      notes: "Design system documentation and handoff.",
      items: [
        { description: "Component documentation", quantity: 1, unitPrice: 135000 },
        { description: "Engineering handoff", quantity: 2, unitPrice: 40000 },
      ],
    },
    {
      client: "cli_cinder",
      number: "INV-2026-009",
      status: "paid",
      days: 36,
      notes: "Seasonal campaign concepts.",
      items: [
        { description: "Campaign concept", quantity: 1, unitPrice: 160000 },
        { description: "Social templates", quantity: 8, unitPrice: 12000 },
      ],
    },
    {
      client: "cli_mono",
      number: "INV-2026-010",
      status: "sent",
      days: 22,
      notes: "New product line exploration.",
      items: [
        { description: "Product direction", quantity: 1, unitPrice: 190000 },
        { description: "Material studies", quantity: 4, unitPrice: 16000 },
      ],
    },
    {
      client: "cli_fieldwork",
      number: "INV-2026-011",
      status: "overdue",
      days: 17,
      notes: "Service blueprint and journey map.",
      items: [
        { description: "Service blueprint", quantity: 1, unitPrice: 220000 },
        { description: "Journey map", quantity: 1, unitPrice: 90000 },
      ],
    },
    {
      client: "cli_paperkite",
      number: "INV-2026-012",
      status: "sent",
      days: 9,
      notes: "Journal website design, phase two.",
      items: [
        { description: "Article templates", quantity: 3, unitPrice: 48000 },
        { description: "Reading experience polish", quantity: 1, unitPrice: 70000 },
      ],
    },
    {
      client: "cli_northwind",
      number: "INV-2026-013",
      status: "draft",
      days: 4,
      notes: "Q1 brand campaign, scope pending approval.",
      items: [
        { description: "Campaign direction", quantity: 1, unitPrice: 175000 },
        { description: "Launch assets", quantity: 5, unitPrice: 18000 },
      ],
    },
    {
      client: "cli_aperture",
      number: "INV-2026-014",
      status: "paid",
      days: 2,
      notes: "Quarterly design retainer.",
      items: [{ description: "Design retainer — Q4", quantity: 1, unitPrice: 300000 }],
    },
  ];

  const insertInvoice = database.prepare(
    `INSERT INTO invoices
      (id, user_id, client_id, number, status, issue_date, due_date, notes, tax_rate,
       subtotal_cents, tax_cents, total_cents, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertItem = database.prepare(
    `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price_cents)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertActivity = database.prepare(
    "INSERT INTO activities (id, user_id, kind, message, created_at) VALUES (?, ?, ?, ?, ?)",
  );

  for (const invoice of seedInvoices) {
    const issueDate = daysAgo(invoice.days);
    const dueDate = daysFrom(issueDate, 14);
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice * 100,
      0,
    );
    const tax = Math.round(subtotal * 0.05);
    const id = `inv_${invoice.number.toLowerCase().replaceAll("-", "_")}`;

    insertInvoice.run(
      id,
      demoUser.id,
      invoice.client,
      invoice.number,
      invoice.status,
      issueDate,
      dueDate,
      invoice.notes,
      5,
      subtotal,
      tax,
      subtotal + tax,
      new Date(`${issueDate}T10:00:00Z`).toISOString(),
    );

    for (const item of invoice.items) {
      insertItem.run(
        randomUUID(),
        id,
        item.description,
        item.quantity,
        item.unitPrice * 100,
      );
    }

    const message =
      invoice.status === "paid"
        ? `${invoice.number} was marked as paid`
        : invoice.status === "sent"
          ? `${invoice.number} was sent to the client`
          : `${invoice.number} was saved as a draft`;
    insertActivity.run(
      randomUUID(),
      demoUser.id,
      invoice.status,
      message,
      new Date(`${issueDate}T10:30:00Z`).toISOString(),
    );
  }

  insertActivity.run(
    randomUUID(),
    demoUser.id,
    "client",
    "Ayesha Siddiqui from Northwind Trading was added",
    new Date(Date.now() - 5 * 86_400_000).toISOString(),
  );
}

export function createStarterWorkspace(userId: string, name: string) {
  const clientId = randomUUID();
  const invoiceId = randomUUID();
  const now = new Date().toISOString();
  const issueDate = today();

  transaction(() => {
    run(
      `INSERT INTO clients (id, user_id, name, company, email, phone, address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      clientId,
      userId,
      name,
      "New client",
      "hello@example.com",
      "",
      "",
      now,
    );

    run(
      `INSERT INTO invoices
        (id, user_id, client_id, number, status, issue_date, due_date, notes, tax_rate,
         subtotal_cents, tax_cents, total_cents, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      invoiceId,
      userId,
      clientId,
      `INV-${new Date().getFullYear()}-001`,
      "draft",
      issueDate,
      daysFrom(issueDate, 14),
      "Your first invoice. Edit the line items and send it when you are ready.",
      0,
      0,
      0,
      0,
      now,
    );

    logActivity(userId, "workspace", "Your workspace was created");
  });
}
