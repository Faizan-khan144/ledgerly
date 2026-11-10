import { AppMotion } from "@/components/app-motion";
import { AppTopbar } from "@/components/app-topbar";
import { MobileNav } from "@/components/nav-links";
import { RouteTransition } from "@/components/route-transition";
import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="shell">
      <Sidebar user={user} />
      <MobileNav />
      <div className="main">
        <AppTopbar />
        <AppMotion />
        <RouteTransition>{children}</RouteTransition>
      </div>
    </div>
  );
}
