"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { get, logActivity, run } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export type ClientState = { error?: string };

export async function createClientAction(_: ClientState, formData: FormData): Promise<ClientState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (name.length < 2) return { error: "Enter a contact name." };
  if (company.length < 2) return { error: "Enter the client or company name." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address does not look right." };
  }

  const id = randomUUID();

  try {
    run(
      `INSERT INTO clients (id, user_id, name, company, email, phone, address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      user.id,
      name,
      company,
      email,
      phone,
      address,
      new Date().toISOString(),
    );
    logActivity(user.id, "client", `${name} from ${company} was added`);
  } catch {
    return { error: "The client could not be saved. Please try again." };
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  redirect(`/clients/${id}?created=1`);
}

export async function deleteClientAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  const invoiced =
    get<{ count: number }>(
      "SELECT COUNT(*) AS count FROM invoices WHERE client_id = ? AND user_id = ?",
      id,
      user.id,
    )?.count ?? 0;

  if (invoiced > 0) {
    redirect(`/clients/${id}?error=invoices`);
  }

  const removed = run("DELETE FROM clients WHERE id = ? AND user_id = ?", id, user.id);
  if (removed.changes > 0) {
    logActivity(user.id, "delete", "A client was removed from the workspace");
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  redirect("/clients?deleted=1");
}

export async function updateClientAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!id || name.length < 2 || company.length < 2) return;

  run(
    `UPDATE clients SET name = ?, company = ?, email = ?, phone = ?, address = ?
     WHERE id = ? AND user_id = ?`,
    name,
    company,
    email,
    phone,
    address,
    id,
    user.id,
  );

  logActivity(user.id, "client", `${company} details were updated`);
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}
