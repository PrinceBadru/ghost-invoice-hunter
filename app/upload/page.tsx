import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/navigation/Sidebar";
import { UploadForm } from "@/components/upload/UploadForm";

// Lives outside the (app) route group so it can be reached even before any
// businesses exist, but still requires auth (middleware covers that) and
// renders its own sidebar for a consistent shell.
export default async function UploadPage() {
  const user = await requireUser();
  const businesses = await prisma.business.findMany({
    where: { environmentId: user.environmentId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, vendorCode: true },
  });

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Sidebar
        environmentName={user.environment.name}
        userName={user.name}
        userRole={user.role}
      />
      <main className="flex-1 overflow-y-auto p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Process Invoices
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Upload a purchase order, quote, or invoice spreadsheet. Invoices are
            matched and scored automatically on upload.
          </p>
        </div>
        {businesses.length === 0 ? (
          <p className="text-xs text-[var(--warning)]">
            No businesses are tracked in this environment yet — add one from the
            form below before uploading.
          </p>
        ) : null}
        <UploadForm businesses={businesses} />
      </main>
    </div>
  );
}
