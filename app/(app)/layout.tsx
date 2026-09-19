import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/navigation/Sidebar";

// Everything under the (app) route group requires an authenticated user
// and gets the Sidebar chrome. /login and /signup live outside this group
// so they render without it.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Sidebar
        environmentName={user.environment.name}
        userName={user.name}
        userRole={user.role}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
