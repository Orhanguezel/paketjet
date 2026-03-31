import SiteShell from "@/components/SiteShell";
import PanelShell from "./panel-shell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <PanelShell>{children}</PanelShell>
    </SiteShell>
  );
}
