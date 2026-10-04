"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowUpRight, CalendarDays, ChevronRight, FileText, LifeBuoy } from "lucide-react";
import { legalDate, legalHtml, legalPages } from "./legal-content";
import { LegalArticle } from "./LegalArticle";
import { ROUTES } from "@/config/routes";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { APP_NAME } from "@/lib/app-name";
type Props = { slug: string; title: string; summary?: string | null; html?: string | null; updatedAt?: string; embedded?: boolean; publishedSlugs?: string[]; faqs?: { question: string; answer: string }[] };
type Section = { id: string; label: string };
export function LegalPageView({ slug, title, summary, html, updatedAt, embedded = false, publishedSlugs, faqs }: Props) {
  const isPublished = (page: (typeof legalPages)[number]) => page.slug === slug || (publishedSlugs ? publishedSlugs.includes(page.slug) : page.published);
  const article = useRef<HTMLElement>(null),
    [sections, setSections] = useState<Section[]>([]),
    [active, setActive] = useState("");
  const content = legalHtml(html),
    date = legalDate(updatedAt);
  const publishedPages = legalPages.filter(isPublished);
  const pageIndex = publishedPages.findIndex((page) => page.slug === slug);
  const previousPage = publishedPages[pageIndex - 1];
  const nextPage = publishedPages[pageIndex + 1];
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
      <p className="legal-nav-title">Yasal sayfalar</p>
      {legalPages.map((item) => isPublished(item) ? (
        <Link key={item.slug} href={`/${item.slug}`} aria-current={item.slug === slug ? "page" : undefined}>
          <FileText size={17} />
          <span>{item.label}</span>
          <ChevronRight size={15} />
        </Link>
      ) : <span key={item.slug} className="legal-nav-pending" title="Yasal metin henüz yayımlanmadı"><FileText size={17}/><span>{item.label}<small>Hazırlanıyor</small></span></span>)}
    </nav>
  );
  return (
    <div className={`legal-page${embedded ? " legal-page-embedded" : ""}`}>
      <div className={embedded ? "" : "site-container"}>
        {embedded ? <nav aria-label="İçerik yolu" className="site-breadcrumb" id="legal-top"><Link href={ROUTES.panel.root}>Hesabım</Link><ChevronRight size={15} aria-hidden="true"/><span aria-current="page">{title}</span></nav> : <SiteBreadcrumb id="legal-top" items={[{ label: title }]} />}
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
            <header className="legal-header">
              <h1>{title}</h1>
              {summary && <p className="legal-intro">{summary}</p>}
              {date && <p className="legal-date"><CalendarDays size={16} />{APP_NAME ? `Yazan: ${APP_NAME} Ekibi · ` : ""}Son güncelleme: <time dateTime={updatedAt}>{date}</time></p>}
            </header>
            <LegalArticle articleRef={article} title={title} html={content}/>
            {faqs && faqs.length > 0 && <section className="legal-faq" aria-labelledby="legal-faq-title">
              <h2 id="legal-faq-title">Sıkça sorulan sorular</h2>
              {faqs.map((f) => <div key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}
              <p className="legal-faq-note">Yanıtlar yukarıdaki metnin özetidir; bağlayıcı olan metnin kendisidir.</p>
            </section>}
            {!embedded && (previousPage || nextPage) && <nav className="legal-neighbor-nav" aria-label="Diğer yasal sayfalar">
              {previousPage ? <Link href={`/${previousPage.slug}`}><ArrowLeft size={17} /><span><small>Önceki sayfa</small>{previousPage.label}</span></Link> : <span />}
              {nextPage ? <Link href={`/${nextPage.slug}`}><span><small>Sonraki sayfa</small>{nextPage.label}</span><ArrowUpRight size={17} /></Link> : <span />}
            </nav>}
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
