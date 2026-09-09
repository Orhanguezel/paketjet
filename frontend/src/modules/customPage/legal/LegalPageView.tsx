"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, CalendarDays, ChevronRight, FileText, LifeBuoy } from "lucide-react";
import { legalDate, legalHtml, legalPages } from "./legal-content";
import { LegalArticle } from "./LegalArticle";
import { ROUTES } from "@/config/routes";
type Props = { slug: string; title: string; summary?: string | null; html?: string | null; updatedAt?: string; embedded?: boolean };
type Section = { id: string; label: string };
export function LegalPageView({ slug, title, summary, html, updatedAt, embedded = false }: Props) {
  const article = useRef<HTMLElement>(null),
    [sections, setSections] = useState<Section[]>([]),
    [active, setActive] = useState("");
  const content = legalHtml(html),
    date = legalDate(updatedAt);
  useEffect(() => {
    const headings = Array.from(article.current?.querySelectorAll<HTMLHeadingElement>("h2:not([data-document-title]),h3") ?? []);
    const items = headings
      .map((element, index) => {
        if (!element.id) element.id = `legal-section-${index + 1}`;
        element.tabIndex = -1;
        return { id: element.id, label: (element.textContent ?? "").replace(/\s+/g, " ").trim() };
      })
      .filter((item) => item.label);
    setSections(items.length > 1 ? items : []);
    setActive("");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [content]);
  function navigateSection(id: string) {
    setActive(id);
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  }
  const navigation = (
    <nav aria-label="Yasal sayfalar">
      <h2>Yasal sayfalar</h2>
      {legalPages.map((item) => (
        <Link key={item.slug} href={`/${item.slug}`} aria-current={item.slug === slug ? "page" : undefined}>
          <FileText size={17} />
          <span>{item.label}</span>
          <ChevronRight size={15} />
        </Link>
      ))}
    </nav>
  );
  return (
    <div className={`legal-page${embedded ? " legal-page-embedded" : ""}`}>
      <div className={embedded ? "" : "site-container"}>
        <header className="legal-header" id="legal-top">
          <nav aria-label="İçerik yolu" className="legal-breadcrumb">
            <Link href={embedded ? ROUTES.panel.root : ROUTES.home}>{embedded ? "Hesabım" : "Ana sayfa"}</Link>
            <ChevronRight size={14} />
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          {summary && <p className="legal-intro">{summary}</p>}
          {date && (
            <p className="legal-date">
              <CalendarDays size={16} />
              Son güncelleme: <time dateTime={updatedAt}>{date}</time>
            </p>
          )}
        </header>
        <div className="legal-layout">
          <aside className="legal-sidebar">
            <div className="legal-sidebar-sticky">
              {navigation}
              {sections.length > 0 && (
                <details className="legal-contents" open>
                  <summary>Bu sayfada</summary>
                  <nav aria-label="Bu sayfadaki bölümler">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${encodeURIComponent(section.id)}`}
                        aria-current={active === section.id ? "location" : undefined}
                        onClick={() => navigateSection(section.id)}
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </details>
              )}
              <Link href={ROUTES.static.iletisim} className="legal-help">
                <LifeBuoy size={20} />
                <span>
                  Sorun mu var?<strong>Bize ulaş</strong>
                </span>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </aside>
          <div className="legal-document">
            <LegalArticle articleRef={article} title={title} html={content}/>
            <div className="legal-document-footer">
              <Link href={ROUTES.static.iletisim}>
                Bize ulaş
                <ArrowUpRight size={16} />
              </Link>
              <a href="#legal-top">
                Başa dön
                <ArrowUp size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
