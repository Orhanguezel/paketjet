import Link from "next/link";
import { ArrowUpRight, MapPinned, MessagesSquare, Truck } from "lucide-react";

interface CustomPageViewProps {
  title: string;
  summary?: string | null;
  html?: string | null;
  createdAt?: string;
  updatedAt?: string;
  heroVideoUrl?: string | null;
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

export function CustomPageView({ title, summary, html, createdAt, updatedAt, heroVideoUrl }: CustomPageViewProps) {
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
  const icons = [MapPinned, MessagesSquare, Truck];

  return (
    <main className="editorial-page about-page">
      <header className="editorial-hero about-hero">
        <div className="editorial-container">
          <p className="editorial-eyebrow">Kurumsal</p>
          <h1>{title}</h1>
          {summary ? <p className="editorial-lead">{summary}</p> : null}
          {(publishedLabel || updatedLabel) ? (
            <div className="about-dates">
              {publishedLabel ? <span>Yayın tarihi: {publishedLabel}</span> : null}
              {updatedLabel ? <span>Son güncelleme: {updatedLabel}</span> : null}
            </div>
          ) : null}
        </div>
      </header>
      {heroVideoUrl ? (
        <section className="about-video-band">
          <div className="editorial-container">
            <div className="about-video-frame">
              <video
                src={heroVideoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="editorial-container about-content">
        <p className="editorial-eyebrow">Nasıl çalışır?</p>
        <h2>Gönderici ve taşıyıcı nasıl buluşur?</h2>
        {steps ? <div className="about-step-grid">{steps.map((step, index) => {
          const Icon = icons[index];
          return <article className="about-step" key={index}><span className="about-step-icon"><Icon size={25} /></span><span className="about-step-number">0{index + 1}</span><h3>{step.title}</h3><p dangerouslySetInnerHTML={{ __html: step.body }} /></article>;
        })}</div> : <article className="about-prose prose prose-neutral max-w-none prose-headings:font-semibold prose-a:text-brand" dangerouslySetInnerHTML={{ __html: displayHtml }} />}
        <div className="about-cta"><div><h2>Uygun güzergâhı keşfet</h2><p>Güncel taşıyıcı ilanlarını incele ve iletişim bilgilerine eriş.</p></div><Link href="/ilanlar">İlanları keşfet <ArrowUpRight size={18} /></Link></div>
      </section>
    </main>
  );
}
