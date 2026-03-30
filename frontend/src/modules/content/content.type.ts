export type ContentSection = {
  title?: string;
  paragraphs: string[];
};

export type ArticleContent = {
  slug: string;
  seoKey: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  categoryLabel: string;
  canonicalPath: string;
  sections: ContentSection[];
};

