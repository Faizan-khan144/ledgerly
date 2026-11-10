"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  all,
  get,
  logActivity,
  run,
  today,
  transaction,
  type Invoice,
  type InvoiceItem,
} from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { nextInvoiceNumber } from "@/lib/queries";

export type InvoiceState = { error?: string };

type LineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

function parseItems(raw: FormDataEntryValue | null): LineItem[] {
  if (typeof raw !== "string" || !raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const row = item as Record<string, unknown>;
        return {
          description: String(row.description ?? "").trim(),
          quantity: Number(row.quantity),
          unitPriceCents: Math.round(Number(row.unitPriceCents)),
        };
      })
      .filter(
        (item) =>
          item.description.length > 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          Number.isInteger(item.unitPriceCents) &&
          item.unitPriceCents >= 0,
      );
  } catch {
    return [];
  }
}

export async function createInvoiceAction(
  _: InvoiceState,
  formData: FormData,
): Promise<InvoiceState> {
  const user = await requireUser();
  const clientId = String(formData.get("clientId") ?? "");
  const issueDate = String(formData.get("issueDate") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const taxRate = Math.max(0, Math.min(100, Number(formData.get("taxRate") ?? 0)));
  const items = parseItems(formData.get("items"));

  if (!clientId) return { error: "Choose a client for this invoice." };
  if (!issueDate || !dueDate) return { error: "Set both an issue date and a due date." };
  if (dueDate < issueDate) return { error: "The due date cannot be before the issue date." };
  if (items.length === 0) return { error: "Add at least one line item with a description and quantity." };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const tax = Math.round(subtotal * (taxRate / 100));
  const id = randomUUID();
  const number = nextInvoiceNumber(user.id);

  try {
    transaction(() => {
      run(
        `INSERT INTO invoices
          (id, user_id, client_id, number, status, issue_date, due_date, notes, tax_rate,
           subtotal_cents, tax_cents, total_cents, created_at)
         VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        user.id,
        clientId,
        number,
        issueDate,
        dueDate,
        notes,
        taxRate,
        subtotal,
        tax,
        subtotal + tax,
        new Date().toISOString(),
      );

      for (const item of items) {
        run(
          `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price_cents)
           VALUES (?, ?, ?, ?, ?)`,
          randomUUID(),
          id,
          item.description,
          item.quantity,
          item.unitPriceCents,
        );
      }

      logActivity(user.id, "draft", `${number} was created`);
    });
  } catch {
    return { error: "The invoice could not be saved. Please try again." };
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${id}?created=1`);
}

export async function setInvoiceStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!["draft", "sent", "paid", "overdue"].includes(status)) return;

  const invoice = run(
    "UPDATE invoices SET status = ? WHERE id = ? AND user_id = ?",
    status,
    id,
    user.id,
  );

  if (invoice.changes > 0) {
    const labels: Record<string, string> = {
      draft: "moved back to draft",
      sent: "sent to the client",
      paid: "marked as paid",
      overdue: "marked as overdue",
    };
    logActivity(user.id, status, `Invoice ${labels[status] ?? "updated"}`);
    revalidatePath("/dashboard");
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
  }
}

export async function duplicateInvoiceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  const original = get<Invoice>(
    "SELECT * FROM invoices WHERE id = ? AND user_id = ?",
    id,
    user.id,
  );
  if (!original) return;

  const items = all<InvoiceItem>(
    "SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid",
    id,
  );

  const newId = randomUUID();
  const number = nextInvoiceNumber(user.id);
  const issueDate = today();
  const dueDate = new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10);

  try {
    transaction(() => {
      run(
        `INSERT INTO invoices
          (id, user_id, client_id, number, status, issue_date, due_date, notes, tax_rate,
           subtotal_cents, tax_cents, total_cents, created_at)
         VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?)`,
        newId,
        user.id,
        original.client_id,
        number,
        issueDate,
        dueDate,
        original.notes,
        original.tax_rate,
        original.subtotal_cents,
        original.tax_cents,
        original.total_cents,
        new Date().toISOString(),
      );

      for (const item of items) {
        run(
          `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price_cents)
           VALUES (?, ?, ?, ?, ?)`,
          randomUUID(),
          newId,
          item.description,
          item.quantity,
          item.unit_price_cents,
        );
      }

      logActivity(user.id, "draft", `${number} was duplicated from ${original.number}`);
    });
  } catch {
    return;
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${newId}?duplicated=1`);
}

export async function deleteInvoiceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  const invoice = run("DELETE FROM invoices WHERE id = ? AND user_id = ?", id, user.id);
  if (invoice.changes > 0) {
    logActivity(user.id, "delete", "An invoice was deleted");
  }

  revalidatePath("/dashboard");
  revalidatePath("/invoices");
  redirect("/invoices?deleted=1");
}
