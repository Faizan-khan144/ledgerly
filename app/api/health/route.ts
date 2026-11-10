import { get } from "@/lib/db";

export function GET() {
  const check = get<{ ok: number }>("SELECT 1 AS ok");

  return Response.json({
    ok: check?.ok === 1,
    service: "ledgerly",
    time: new Date().toISOString(),
  });
}
