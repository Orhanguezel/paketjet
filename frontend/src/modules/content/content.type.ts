export type ContentSection = {
  title?: string;
  paragraphs: string[];
  /** Madde listesi (kontrol listesi, adımlar). */
  list?: string[];
  /** Basit tablo: ilk satır başlık. */
  table?: string[][];
};

export type ContentFaq = { question: string; answer: string };
export type ContentSource = { label: string; url: string; note?: string };

export type ArticleContent = {
  slug: string;
  seoKey: string;
  eyebrow: string;
  title: string;
  /** Arama sonucu başlığı (marka eki hariç 19–49 karakter; toplam 30–60). */
  metaTitle?: string;
  summary: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  categoryLabel: string;
  /** Konu kümesi: aynı kümedeki yazılar birbirine bağlanır. */
  cluster?: "gonderici" | "tasiyici" | "guzergah" | "urun";
  canonicalPath: string;
  sections: ContentSection[];
  /** Ölçülebilir, birimli kısa bilgiler. */
  keyFacts?: string[];
  faqs?: ContentFaq[];
  sources?: ContentSource[];
};
