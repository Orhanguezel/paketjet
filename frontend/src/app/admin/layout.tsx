import SiteShell from "@/components/SiteShell";
import AdminShell from "./admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <AdminShell>{children}</AdminShell>
    </SiteShell>
  );
}
