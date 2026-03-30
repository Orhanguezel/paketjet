import Header from "@/components/Header";

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

  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Kurumsal</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight">{title}</h1>
          {summary ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{summary}</p> : null}
          {(publishedLabel || updatedLabel) ? (
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted">
              {publishedLabel ? <span>Yayin tarihi: {publishedLabel}</span> : null}
              {updatedLabel ? <span>Son guncelleme: {updatedLabel}</span> : null}
            </div>
          ) : null}
        </div>
      </section>
      {/* Hero Video — içerik altında */}
      {heroVideoUrl ? (
        <section className="bg-navy">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <video
                src={heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article
          className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-brand"
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
      </section>
    </div>
  );
}
