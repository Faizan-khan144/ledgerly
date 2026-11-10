import { redirect } from "next/navigation";
import { BarChart3, Check, FileText, ShieldCheck, SquareTerminal } from "lucide-react";
import { LoginForm } from "@/components/auth-forms";
import { LogoMark } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="auth-main grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative hidden overflow-hidden border-r border-[#dad6ca] bg-[#f6f4ed] p-12 lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(50rem_26rem_at_20%_0%,rgba(15,118,110,0.12),transparent_65%),radial-gradient(44rem_26rem_at_90%_80%,rgba(37,99,235,0.1),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,24,40,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,40,0.035)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="relative flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-[20px] font-extrabold tracking-[-0.045em]">Ledgerly</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#928f84]">
              Studio finance
            </p>
          </div>
        </div>

        <div className="relative my-auto max-w-xl py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9d4c7] bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#d8451b]">
            <SquareTerminal size={12} />
            Built for independent studios
          </div>
          <h2 className="mt-6 text-[clamp(42px,5vw,62px)] font-extrabold leading-[0.98] tracking-[-0.06em]">
            Your best work
            <br />
            deserves a
            <br />
            <span className="gradient-text">clean invoice.</span>
          </h2>
          <p className="mt-6 max-w-md text-[13.5px] leading-7 text-[#6b6960]">
            Clients, invoices, payments, and a live view of your studio revenue — all
            in one quiet workspace.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
            {[
              { icon: FileText, label: "Invoices", value: "12 seconds" },
              { icon: BarChart3, label: "Revenue view", value: "Always live" },
              { icon: Check, label: "Status flow", value: "Draft → Paid" },
              { icon: ShieldCheck, label: "Privacy", value: "Hashed + signed" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#dad6ca] bg-white/70 p-4 backdrop-blur-sm"
              >
                <item.icon size={15} className="text-[#d8451b]" />
                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                  {item.label}
                </p>
                <p className="mt-1 text-[12px] font-bold text-[#3a3931]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em] text-[#928f84]">
          <span>Full-stack demo · SQLite</span>
          <span>Built with Next.js</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[380px]">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <LogoMark />
            <span className="text-[20px] font-extrabold tracking-[-0.04em]">Ledgerly</span>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
