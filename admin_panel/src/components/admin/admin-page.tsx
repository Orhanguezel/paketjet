import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Shared page structure for admin routes. Visual rules live in admin-design.css. */
export function AdminPage({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn('admin-page', className)}>{children}</main>;
}

export function AdminPageHeader({ title, description, actions }: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return <div className="admin-page-header">
    <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {actions && <div className="admin-page-actions">{actions}</div>}
  </div>;
}
