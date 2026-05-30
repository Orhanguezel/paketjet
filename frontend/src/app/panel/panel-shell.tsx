"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, NavBadge } from "@/components/ui";
import { useAuthStore } from "@/modules/auth/auth.store";
import { logout as apiLogout } from "@/modules/auth/auth.service";
import { useNotificationStore } from "@/modules/notification/notification.store";
import { cn } from "@/lib/utils";

type PanelNavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: boolean;
};

const NAV: PanelNavItem[] = [
  { href: "/panel", label: "Özet", icon: "dashboard", exact: true },
  { href: "/panel/ilanlarim", label: "İlanlarım", icon: "ilanlarim" },
  { href: "/panel/satin-aldiklarim", label: "Satın Aldıklarım", icon: "satin-aldiklarim" },
  { href: "/panel/ilan-alma-hakki", label: "İlan Alma Hakkı", icon: "ilan-alma-hakki" },
  { href: "/panel/bildirimler", label: "Bildirimler", icon: "bildirimler", badge: true },
  { href: "/panel/profil", label: "Profil", icon: "profil" },
  { href: "/panel/tasima-kurallari", label: "Taşıma Kuralları", icon: "tasima-kurallari" },
];

export default function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount, reset } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/giris?next=" + pathname);
  }, [isAuthenticated, router, pathname]);

  useEffect(() => {
    if (isAuthenticated) void fetchUnreadCount();
  }, [fetchUnreadCount, isAuthenticated]);

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {}
    logout();
    reset();
    router.push("/giris");
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="animate-pulse text-sm font-bold text-muted">Yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  const displayName = user?.full_name ?? "PaketJet Üyesi";

  return (
    <div className="flex-1 bg-panel-gradient">
      <div className="mx-auto flex min-h-[calc(100vh-1px)] w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:py-8">
        <aside className="hidden w-72 shrink-0 md:block">
          <nav className="sticky top-6 rounded-[2rem] bg-panel-surface/86 p-4 shadow-xl shadow-navy/10 ring-1 ring-white/70 backdrop-blur">
            <Link href="/panel" className="mb-6 flex items-center gap-3 px-2 pt-1">
              <span className="grid size-14 place-items-center rounded-2xl bg-blue-soft">
                <Icon folder="logo" name="logo-512x512-transparent" size={46} alt="PaketJet" />
              </span>
              <span className="text-2xl font-black tracking-normal text-panel-ink">paketjet</span>
            </Link>

            <div className="mb-4 rounded-2xl bg-blue-xsoft px-4 py-3">
              <p className="truncate text-sm font-black text-panel-ink">{displayName}</p>
              <p className="text-xs font-bold text-panel-ink/55">Panel</p>
            </div>

            <div className="flex flex-col gap-2">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <NavBadge
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={active}
                    badgeCount={item.badge ? unreadCount : undefined}
                  />
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex min-h-14 items-center gap-3 rounded-full bg-blue-soft px-3 py-2 text-sm font-black text-panel-ink transition-all hover:bg-blue-xsoft hover:text-danger"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/65">
                  <Icon name="cikis-yap" size={30} alt="" />
                </span>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </nav>
        </aside>

        <nav className="md:hidden">
          <div className="mb-3 flex items-center justify-between rounded-3xl bg-panel-surface/90 px-4 py-3 shadow-sm ring-1 ring-white/70">
            <Link href="/panel" className="flex items-center gap-2">
              <Icon folder="logo" name="logo-512x512-transparent" size={38} alt="PaketJet" />
              <span className="text-xl font-black text-panel-ink">paketjet</span>
            </Link>
            <button type="button" onClick={handleLogout} className="grid size-10 place-items-center rounded-full bg-blue-soft">
              <Icon name="cikis-yap" size={28} alt="Çıkış Yap" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-18 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black",
                    active ? "bg-panel-accent text-white" : "bg-blue-soft text-panel-ink"
                  )}
                >
                  <Icon name={item.icon} size={30} alt="" />
                  <span className="line-clamp-2 text-center leading-tight">{item.label}</span>
                  {item.badge && unreadCount > 0 && <span className="rounded-full bg-white px-1 text-[9px] text-brand">{unreadCount}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
