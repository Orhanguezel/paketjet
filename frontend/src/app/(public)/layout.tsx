import SiteShell from "@/components/SiteShell";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
