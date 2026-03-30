# Frontend Structured Data Audit

Tarih: 2026-03-30

## Kapsam

- `/`
  - `Organization`
  - `WebSite`
  - `Service`
  - `HowTo`
  - `BreadcrumbList`
- `/destek`
  - `FAQPage`
- `/iletisim`
  - `ContactPoint`
- `/ilanlar/[id]`
  - `Offer`
- `/blog/[slug]`
  - `Article`
  - `BreadcrumbList`
- `/rota/[slug]`
  - `Article`
  - `BreadcrumbList`

## Sonuc

- Blog ve rota icerikleri dinamik slug yapisina tasindi.
- Public icerik sayfalarinda article-level metadata ve canonical path standardize edildi.
- `JsonLd.tsx` icinde tek merkezden kullanilan schema bilesenleri mevcut.
- Structured data katmani frontend tarafinda checklist kapsamindaki tum indexable icerik sayfalarini kapsiyor.

