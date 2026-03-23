"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import { logout as apiLogout } from "@/modules/auth/auth.service";
import { useNotificationStore } from "@/modules/notification/notification.store";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NAV = [
  { href: "/panel/musteri",     label: "Gönderilerim",  icon: "📦", roles: ["customer", "admin"] },
  { href: "/panel/tasiyici",    label: "İlanlarım",     icon: "🚚", roles: ["carrier", "admin"] },
  { href: "/panel/abonelik",    label: "Abonelik",      icon: "💎", roles: ["carrier", "admin"] },
  { href: "/panel/cuzdan",      label: "Cüzdan",        icon: "💳" },
  { href: "/panel/bildirimler", label: "Bildirimler",   icon: "🔔" },
  { href: "/panel/profil",      label: "Profil",        icon: "👤" },
  { href: "/panel/tasima-kurallari", label: "Taşıma Kuralları", icon: "📋" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, reset } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris?next=" + pathname);
    }
  }, [isAuthenticated, router, pathname]);

  async function handleLogout() {
    try { await apiLogout(); } catch {}
    logout();
    reset();
    router.push("/giris");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted font-medium animate-pulse text-sm">Yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  const role = user?.role ?? "customer";
  const filteredNav = NAV.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full px-4 gap-6 py-12">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col gap-1 w-52 shrink-0">
          <div className="mb-6 px-4 py-5 bg-navy rounded-2xl shadow-sm border border-navy/20">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Erişim Alanı</p>
            <p className="text-sm font-black text-white tracking-tight">
              {role === "carrier" ? "Taşıyıcı Paneli" : "Müşteri Paneli"}
            </p>
          </div>
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                pathname.startsWith(item.href)
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "text-muted hover:bg-bg-alt hover:text-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.href === "/panel/bildirimler" && unreadCount > 0 && (
                <span className={cn(
                  "min-w-5 h-5 px-1.5 text-[10px] font-bold rounded-full flex items-center justify-center",
                  pathname.startsWith(item.href) ? "bg-white text-brand" : "bg-brand text-white"
                )}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <span className="text-lg">🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </nav>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border-soft flex pb-safe shadow-lg">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-extrabold transition-colors relative uppercase tracking-tighter",
                pathname.startsWith(item.href) ? "text-brand" : "text-muted"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.href === "/panel/bildirimler" && unreadCount > 0 && (
                <span className="absolute top-2 right-[calc(50%-18px)] min-w-4 h-4 px-1 bg-brand text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-extrabold text-muted uppercase tracking-tighter"
          >
            <span className="text-xl">🚪</span>
            <span>Çıkış</span>
          </button>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
