import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PanelShellProps {
  /** İçerik bölümleri — yan yana iki sütun (sidebar + main) */
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Panel sayfaları için kapsayıcı bileşen.
 * Semantic surface contract'ı tek noktada uygular:
 *   - Sayfa zemini: bg-background
 *   - Sidebar: bg-surface, sağ kenar border-border-soft
 *   - Main içerik: bg-background
 */
export function PanelShell({ sidebar, children, className }: PanelShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {sidebar ? (
        <div className="flex min-h-screen">
          <aside className="hidden md:flex w-60 shrink-0 flex-col bg-surface border-r border-border-soft">
            {sidebar}
          </aside>
          <main className="flex-1 min-w-0 bg-background">{children}</main>
        </div>
      ) : (
        <main className="bg-background">{children}</main>
      )}
    </div>
  );
}

interface PanelCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Panel içi kart yüzeyi — surface-card contract.
 */
export function PanelCard({ children, className }: PanelCardProps) {
  return (
    <div className={cn("surface-card p-5", className)}>
      {children}
    </div>
  );
}
