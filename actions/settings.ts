"use server";

import { revalidatePath } from "next/cache";
import { get, logActivity, run } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export type PasswordState = { error?: string; success?: string };

export async function changePasswordAction(
  _: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const user = await requireUser();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 8) {
    return { error: "Use at least 8 characters for the new password." };
  }
  if (next !== confirm) {
    return { error: "The new passwords do not match." };
  }

  const row = get<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = ?",
    user.id,
  );
  if (!row || !verifyPassword(current, row.password_hash)) {
    return { error: "Your current password is incorrect." };
  }

  run("UPDATE users SET password_hash = ? WHERE id = ?", hashPassword(next), user.id);
  logActivity(user.id, "security", "Account password was updated");
  revalidatePath("/settings");

  return { success: "Password updated. Use the new one next time you sign in." };
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const companyAddress = String(formData.get("companyAddress") ?? "").trim();
  const companyPhone = String(formData.get("companyPhone") ?? "").trim();

  if (name.length < 2 || companyName.length < 2) return;

  run(
    `UPDATE users SET name = ?, company_name = ?, company_address = ?, company_phone = ?
     WHERE id = ?`,
    name,
    companyName,
    companyAddress,
    companyPhone,
    user.id,
  );

  revalidatePath("/", "layout");
  revalidatePath("/settings");
}
