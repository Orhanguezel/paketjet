import Icon from "./Icon";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  className?: string;
}

export default function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl bg-panel-surface p-5 shadow-sm ring-1 ring-white/70", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black text-panel-ink/65">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-normal text-panel-ink">{value}</p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-soft">
          <Icon name={icon} size={36} alt="" />
        </span>
      </div>
    </div>
  );
}
