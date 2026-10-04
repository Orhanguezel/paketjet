import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CustomPageViewProps {
  title: string;
  summary?: string | null;
  html?: string | null;
  createdAt?: string;
  updatedAt?: string;
  heroVideoUrl?: string | null;
  /** Hazırlayan satırı (ör. "Marka Ekibi"); boşsa gösterilmez. */
  byline?: string | null;
  /** İçerikten sonra gösterilen ek bölümler (fiyat tablosu, SSS). */
  children?: React.ReactNode;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function CustomPageView({ title, summary, html, createdAt, updatedAt, heroVideoUrl, byline, children }: CustomPageViewProps) {
  // Handle JSON content if provided as {"html": "..."}
  let displayHtml = html ?? "<p>İçerik bulunamadı.</p>";
  if (html && html.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(html);
      if (parsed && typeof parsed.html === 'string') {
        displayHtml = parsed.html;
      }
    } catch (e) {
      console.error("Failed to parse CustomPage content JSON:", e);
    }
  }

  const publishedLabel = formatDate(createdAt);
  const updatedLabel = formatDate(updatedAt);
  const stepMatches = [...displayHtml.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  const steps = stepMatches.length === 3 && !displayHtml.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>\s*<p\b[^>]*>[\s\S]*?<\/p>/gi, "").trim()
    ? stepMatches.map((match) => ({ title: match[1].replace(/<[^>]+>/g, ""), body: match[2] }))
    : null;
  return (
    <div className="editorial-page about-page">
      <div className="site-container about-layout">
      <header className="about-hero">
        <div className="about-hero-copy">
          <p className="editorial-eyebrow">Hakkımızda</p>
          <h1>{title}</h1>
          <p className="about-hero-subtitle">Taşıyıcıyla doğrudan iletişim.</p>
          {summary ? <p className="editorial-lead">{summary}</p> : null}
          {(publishedLabel || updatedLabel || byline) && <div className="about-dates">
            {byline && <span>Hazırlayan: {byline}</span>}
            {publishedLabel && <span>Yayın tarihi: <time dateTime={createdAt}>{publishedLabel}</time></span>}
            {updatedLabel && <span>Son güncelleme: <time dateTime={updatedAt}>{updatedLabel}</time></span>}
          </div>}
        </div>
        <div className="about-hero-image"><Image src="/assets/editorial/about-handoff-2026-10-04.png" alt="Bir taşıyıcı ile göndericinin paket teslimi" width={1586} height={992} className="absolute inset-0 h-full w-full" priority sizes="(max-width: 760px) 100vw, 52vw" /></div>
      </header>

      <section className="about-content">
        <p className="editorial-eyebrow">Nasıl çalışır?</p>
        <h2>Sadece üç adımda, doğru taşıyıcıyla buluşun.</h2>
        <p className="about-content-intro">Kullanım süreci üç adımdan oluşur: ilanı bul, iletişim bilgisine eriş, koşulları taşıyıcıyla doğrudan görüş.</p>
        {steps ? <div className="about-step-grid">{steps.map((step, index) => {
          return <article className="about-step" key={index}><span className="about-step-number">{index + 1}</span><div><h3>{step.title}</h3><p dangerouslySetInnerHTML={{ __html: step.body }} /></div></article>;
        })}</div> : <article className="about-prose prose prose-neutral max-w-none prose-headings:font-semibold prose-a:text-brand" dangerouslySetInnerHTML={{ __html: displayHtml }} />}
      </section>
      {children}
      <section className="about-cta"><div><p className="editorial-eyebrow">Doğrudan iletişim</p><h2>İlanları keşfet, taşıyıcıyla görüş.</h2><p>Güzergâh ve kapasite ilanlarını inceleyip uygun taşıyıcıyla doğrudan iletişime geçebilirsin.</p></div><Link href="/ilanlar">İlanları keşfet <ArrowUpRight size={18} /></Link></section>
      {heroVideoUrl && <section className="about-video-band"><details className="about-video-disclosure"><summary>Tanıtım videosunu izle</summary><div className="about-video-frame"><video src={heroVideoUrl} controls playsInline preload="metadata" className="w-full object-cover" /></div></details></section>}
      </div>
    </div>
  );
}
