import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="serif mt-3 text-[52px] leading-none">This page slipped away.</h1>
        <p className="mt-3 text-[13px] leading-6 text-[#6b6960]">
          The invoice, client, or page you were looking for is not here. Your ledger is
          still safe.
        </p>
        <Link href="/dashboard" className="btn btn-primary mt-6">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
