import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { getSession } from "@/lib/auth/session";

// Authoritative session check — runs server-side on every dashboard render,
// independent of middleware. This is the fallback that protects dashboard
// routes even if middleware is bypassed (e.g. CVE-2025-29927 pattern).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="relative z-10 flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
