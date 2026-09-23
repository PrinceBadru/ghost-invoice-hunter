import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/navigation/Sidebar";

// Everything under the (app) route group requires an authenticated user
// and gets the Sidebar chrome. /login and /signup live outside this group
// so they render without it.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] overflow-hidden">
      <Sidebar
        environmentName={user.environment.name}
        userName={user.name}
        userRole={user.role}
      />
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 flex flex-col">{children}</main>
    </div>
  );
}
