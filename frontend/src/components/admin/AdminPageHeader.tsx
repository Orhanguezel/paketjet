interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
