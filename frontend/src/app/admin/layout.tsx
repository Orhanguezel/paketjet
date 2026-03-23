"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import { logout as apiLogout } from "@/modules/auth/auth.service";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV = [
  { href: "/admin",                label: "Ozet",            icon: "📊", exact: true },
  { href: "/admin/ilanlar",        label: "Ilanlar",         icon: "📋" },
  { href: "/admin/bookings",       label: "Rezervasyonlar",  icon: "📦" },
  { href: "/admin/carriers",       label: "Tasiyicilar",     icon: "🚚" },
  { href: "/admin/users",          label: "Kullanicilar",    icon: "👥" },
  { href: "/admin/komisyon",       label: "Komisyon",        icon: "💸" },
  { href: "/admin/cekim",          label: "Para Çekme",      icon: "🏧" },
  { href: "/admin/gelir",          label: "Gelir",           icon: "💰" },
  { href: "/admin/sayfalar",       label: "Sayfalar",        icon: "📄" },
  { href: "/admin/destek",         label: "Destek",          icon: "🎧" },
  { href: "/admin/iletisim",       label: "Iletisim",        icon: "✉️" },
  { href: "/admin/cuzdan",         label: "Cuzdan",          icon: "💳" },
  { href: "/admin/email-sablonlari", label: "E-posta",       icon: "📧" },
  { href: "/admin/telegram",       label: "Telegram",        icon: "🤖" },
  { href: "/admin/audit",          label: "Denetim",         icon: "📜" },
  { href: "/admin/raporlar",       label: "Raporlar",        icon: "📈" },
  { href: "/admin/depolama",       label: "Depolama",        icon: "🗄️" },
  { href: "/admin/seo",            label: "SEO",             icon: "🔍" },
];

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try { await apiLogout(); } catch {}
    logout();
    router.push("/giris");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col py-8 px-4 border-r border-border-soft">
          <div className="mb-8 px-5 py-5 bg-navy rounded-2xl shadow-sm border border-navy/20">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Erişim Alanı</p>
            <p className="text-sm font-black text-white tracking-tight">Merkezi Yönetim</p>
          </div>
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    active 
                      ? "bg-brand text-white shadow-md shadow-brand/20" 
                      : "text-muted hover:bg-bg-alt hover:text-foreground"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 pt-6 border-t border-border-soft px-3">
            <p className="text-[10px] text-muted truncate mb-3 font-medium">{user?.email}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-danger hover:underline"
              >
                Güvenli Çıkış
              </button>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 p-10 overflow-auto bg-bg-alt/30">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
