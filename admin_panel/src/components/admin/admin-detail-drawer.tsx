"use client";

import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AdminDetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Shared right-side detail surface for admin list pages. */
export function AdminDetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  eyebrow,
  children,
  footer,
  className,
}: AdminDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("w-full gap-0 border-border bg-card p-0 sm:max-w-[640px]", className)}>
        <SheetHeader className="shrink-0 border-border border-b px-6 py-6 pr-12">
          {eyebrow && <span className="font-bold text-primary text-xs uppercase tracking-widest">{eyebrow}</span>}
          <SheetTitle className="font-bold text-xl tracking-tight">{title}</SheetTitle>
          <SheetDescription>{description || "Kayıt ayrıntıları"}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <SheetFooter className="shrink-0 border-border border-t bg-card px-6 py-4">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
