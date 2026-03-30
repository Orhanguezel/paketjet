"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useNotificationStore } from "@/modules/notification/notification.store";
import { logout } from "@/modules/auth/auth.service";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/config/routes";

type NavLink = { title: string; path: string };

interface HeaderProps {
  overlay?: boolean;
  logoUrl?: string;
  logoAlt?: string;
  navLinks?: NavLink[] | null;
}

const DEFAULT_NAV: NavLink[] = [
  { title: "Kargo Gönder", path: "/ilanlar" },
  { title: "İlanlar", path: "/ilanlar" },
  { title: "Destek", path: "/destek" },
];

export default function Header({ overlay = false, logoUrl, logoAlt, navLinks }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout: authLogout } = useAuthStore();
  const { unreadCount, fetchUnreadCount, reset } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  async function handleLogout() {
    try { await logout(); } catch {}
    authLogout();
    reset();
    router.push(ROUTES.home);
  }

  const navText = overlay
    ? "text-white/90 hover:text-white"
    : "text-muted hover:text-foreground";

  const outlineBtn = overlay
    ? "px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-lg hover:bg-white/10 transition-colors"
    : "px-4 py-2.5 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-bg-alt transition-colors";

  const iconBtn = overlay
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-muted hover:text-foreground hover:bg-bg-alt";

  return (
    <header className={overlay
      ? "absolute top-0 left-0 right-0 z-50"
      : "sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border-soft"}>
      <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.home}
          aria-label="PaketJet ana sayfa"
          className="inline-flex items-center p-0"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt ?? "PaketJet"}
              className="h-20 w-auto max-w-52 object-contain dark:brightness-0 dark:invert"
            />
          ) : (
            <Image
              src="/assets/logo/logo.jpeg"
              alt="PaketJet logosu"
              width={120}
              height={120}
              priority={overlay}
              className="h-20 w-20 object-contain dark:brightness-0 dark:invert"
            />
          )}
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {(navLinks ?? DEFAULT_NAV).map((link) => (
            <Link key={link.path + link.title} href={link.path} className={`text-sm font-medium transition-colors ${navText}`}>
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle className={overlay ? "text-white/70 hover:text-white hover:bg-white/10" : ""} />

          {isAuthenticated ? (
            <>
              {/* Bell */}
              <Link
                href={ROUTES.panel.bildirimler}
                className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
                aria-label="Bildirimler"
              >
                <Image
                  src="/assets/icons/notification.png"
                  alt="Bildirim zili simgesi"
                  width={18}
                  height={18}
                  className="h-4.5 w-4.5"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href={ROUTES.panel.profil}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-xlight border border-brand/10 overflow-hidden"
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-brand">
                    {(user?.full_name || user?.email || "?")[0].toUpperCase()}
                  </span>
                )}
              </Link>

              <Link href={ROUTES.panel.root} title="Kullanici paneli" className={outlineBtn}>Panel</Link>

              <button onClick={handleLogout} className={outlineBtn}>Çıkış</button>
            </>
          ) : (
            <>
              <Link href={ROUTES.auth.login} title="PaketJet giris yap" className={outlineBtn}>Giriş Yap</Link>
              <Link
                href={ROUTES.auth.register}
                title="PaketJet uye ol"
                className="px-4 py-2.5 text-sm text-white bg-brand-dark rounded-lg hover:brightness-110 transition-colors font-semibold"
              >
                Üye Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
