import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = { label: string; href?: string };

export function SiteBreadcrumb({ items, id }: { items: BreadcrumbItem[]; id?: string }) {
  return (
    <nav aria-label="İçerik yolu" className="site-breadcrumb" id={id}>
      <Link href="/">Ana sayfa</Link>
      {items.map((item, index) => (
        <span className="site-breadcrumb-item" key={item.href ?? `${item.label}-${index}`}>
          <ChevronRight size={15} aria-hidden="true" />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
