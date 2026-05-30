"use client";

import Link from "next/link";
import Icon from "./Icon";
import { cn } from "@/lib/utils";

interface NavBadgeProps {
  icon: string;
  label: string;
  href: string;
  active: boolean;
  badgeCount?: number;
  onClick?: () => void;
}

export default function NavBadge({ icon, label, href, active, badgeCount, onClick }: NavBadgeProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex min-h-14 items-center gap-3 rounded-full px-3 py-2 text-sm font-black transition-all focus-visible:outline-panel-accent",
        active
          ? "bg-panel-accent text-white shadow-lg shadow-brand/20"
          : "bg-blue-soft text-panel-ink hover:bg-blue-xsoft hover:text-brand"
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", active ? "bg-white/15" : "bg-white/65")}>
        <Icon name={icon} size={30} alt="" />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {!!badgeCount && badgeCount > 0 && (
        <span
          className={cn(
            "grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-black",
            active ? "bg-white text-brand" : "bg-brand text-white"
          )}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </Link>
  );
}
