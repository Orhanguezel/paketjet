'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronRight, House, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { adminNavConfig, getAdminNavFallbackTitle } from '@/navigation/sidebar/sidebar-items';
import { useCommerceSummaryQuery } from '@/integrations/hooks';
import { AccountSwitcher } from './sidebar/account-switcher';
import { ThemeSwitcher } from './sidebar/theme-switcher';

const routes = adminNavConfig.flatMap((group) => group.items.map((item) => ({
  url: item.url, title: getAdminNavFallbackTitle(item.key),
})));

export function AdminTopbar() {
  const pathname = usePathname() ?? '/admin/dashboard';
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const queue = useCommerceSummaryQuery();
  const active = [...routes].sort((a, b) => b.url.length - a.url.length).find((route) => pathname === route.url || pathname.startsWith(`${route.url}/`));
  const matches = search.trim() ? routes.filter((route) => route.title.toLocaleLowerCase('tr').includes(search.trim().toLocaleLowerCase('tr'))).slice(0, 6) : [];

  return <header className="admin-topbar">
    <div className="admin-topbar-breadcrumb"><SidebarTrigger aria-label="Menüyü aç veya kapat" /><span className="admin-topbar-divider" /><Link href="/admin/dashboard" aria-label="Genel bakış"><House size={18} /></Link><ChevronRight size={15} className="admin-breadcrumb-chevron" /><span>{active?.title || 'Genel bakış'}</span></div>
    <div className="admin-topbar-controls">
      <div className="admin-topbar-search"><Search size={18} aria-hidden /><input aria-label="Panel sayfalarında ara" placeholder="Panelde sayfa ara…" value={search} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 120)} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) { router.push(matches[0].url); setSearch(''); setFocused(false); } }} />
        {focused && search.trim() && <div className="admin-search-results">{matches.length ? matches.map((route) => <Link key={route.url} href={route.url} onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearch(''); setFocused(false); }}>{route.title}<ChevronRight size={15} /></Link>) : <p>Sayfa bulunamadı.</p>}</div>}
      </div>
      <Link className="admin-notification-link" href="/admin/payments" aria-label="Ödeme kuyruğu"><Bell size={19} />{(queue.data?.payment_queue ?? 0) > 0 && <span>{queue.data?.payment_queue}</span>}</Link>
      <ThemeSwitcher />
      <AccountSwitcher me={{ id: 'me', email: 'admin', role: 'admin' }} />
    </div>
  </header>;
}
