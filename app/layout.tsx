import { Sidebar } from "@/components/navigation/Sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/app/globals.css";

export const metadata = {
  title: "Ghost Invoice Hunter",
  description: "Financial operations and discrepancy reconciliation command center.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}