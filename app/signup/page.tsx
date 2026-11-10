import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { LogoMark } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Create workspace" };

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="auth-main grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden border-r border-[#dad6ca] bg-[#f6f4ed] p-12 lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(46rem_26rem_at_80%_0%,rgba(37,99,235,0.12),transparent_65%),radial-gradient(40rem_24rem_at_10%_80%,rgba(15,118,110,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,24,40,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,40,0.035)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="relative flex items-center gap-3">
          <LogoMark />
          <span className="text-[20px] font-extrabold tracking-[-0.045em]">Ledgerly</span>
        </div>

        <div className="relative my-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8451b]">
            A quieter back office
          </p>
          <h2 className="mt-5 text-[clamp(40px,4.5vw,56px)] font-extrabold leading-[1.01] tracking-[-0.06em]">
            Less admin.
            <br />
            More making.
          </h2>
          <p className="mt-5 max-w-sm text-[13px] leading-7 text-[#6b6960]">
            Ledgerly keeps the business side of your studio tidy, so the work can stay
            the main event.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 text-center">
          {[
            ["14", "Seeded invoices"],
            ["6", "Clients"],
            ["5%", "Tax handled"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-[#dad6ca] bg-white/70 p-4">
              <p className="text-[24px] font-extrabold tracking-[-0.05em] text-[#14140f]">{value}</p>
              <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <LogoMark />
            <span className="text-[20px] font-extrabold tracking-[-0.04em]">Ledgerly</span>
          </div>
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
