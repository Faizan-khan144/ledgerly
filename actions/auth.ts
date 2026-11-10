"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createStarterWorkspace, get, run, type User } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = { error?: string };

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password to continue." };
  }

  const user = get<User & { password_hash: string }>(
    "SELECT * FROM users WHERE email = ?",
    email,
  );

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Those credentials do not match an account." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function demoLoginAction(_formData: FormData) {
  const user = get<User>("SELECT * FROM users WHERE email = ?", "faizan@ledgerly.app");
  if (!user) redirect("/login?error=demo");

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signupAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "Tell us your name so invoices feel personal." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use at least 8 characters for your password." };

  const existing = get<{ id: string }>("SELECT id FROM users WHERE email = ?", email);
  if (existing) return { error: "An account with that email already exists." };

  const id = randomUUID();

  try {
    run(
      `INSERT INTO users (id, name, email, password_hash, company_name, company_address, company_phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      name,
      email,
      hashPassword(password),
      `${name.split(" ")[0]} Studio`,
      "",
      "",
      new Date().toISOString(),
    );
    createStarterWorkspace(id, name);
  } catch {
    return { error: "We could not create that account. Please try again." };
  }

  await createSession(id);
  redirect("/dashboard?welcome=1");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
