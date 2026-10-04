"use client";

import { AdminDetailDrawer } from "@/components/admin/admin-detail-drawer";
import { Button } from "@/components/ui/button";

type AdminConfirmDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  busy?: boolean;
  confirmLabel?: string;
};

export function AdminConfirmDrawer({ open, onOpenChange, title, description, onConfirm, busy, confirmLabel = "Evet, devam et" }: AdminConfirmDrawerProps) {
  return <AdminDetailDrawer open={open} onOpenChange={onOpenChange} title={title} description={description} eyebrow="İşlem onayı">
    <div className="flex flex-wrap justify-end gap-2">
      <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Vazgeç</Button>
      <Button variant="destructive" onClick={() => void onConfirm()} disabled={busy}>{confirmLabel}</Button>
    </div>
  </AdminDetailDrawer>;
}
