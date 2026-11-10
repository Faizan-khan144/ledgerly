import { cache } from "react";
import { redirect } from "next/navigation";
import { get, type User } from "./db";
import { readSession } from "./session";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await readSession();
  if (!session) return null;

  return get<User>(
    "SELECT id, name, email, company_name, company_address, company_phone, created_at FROM users WHERE id = ?",
    session.userId,
  );
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
