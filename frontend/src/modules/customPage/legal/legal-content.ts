import { parseApiDate } from "@/lib/date";
export function legalHtml(content?: string | null) {
  let html = content || "<p>İçerik bulunamadı.</p>";
  if (html.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(html);
      if (typeof parsed.html === "string") html = parsed.html;
    } catch {
      /* Plain content remains readable. */
    }
  }
  // Preserve all document text while keeping the page title the sole h1.
  return html.replace(/<h1\b([^>]*)>/gi, '<h2 data-document-title="true"$1>').replace(/<\/h1\s*>/gi, "</h2>");
}
export function legalDate(value?: string) {
  if (!value) return null;
  const date = parseApiDate(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(date)
    : null;
}
export const legalPages = [
  { slug: "kullanim-kosullari", label: "Kullanım koşulları" },
  { slug: "gizlilik-politikasi", label: "Gizlilik politikası" },
  { slug: "kvkk", label: "KVKK aydınlatma metni" },
  { slug: "tasima-kurallari", label: "Taşıma kuralları" },
] as const;
