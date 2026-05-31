-- =============================================================
-- FILE: src/db/seed/sql/052_seo_og_images.sql
-- DESCRIPTION: Sayfa bazli OG gorsellerini seo_pages aggregate ayarlarina baglar.
--   Gorseller /uploads/media/seo/ altinda mevcut; 035 seed'i bunlari bos birakiyordu.
--   Idempotent: JSON_SET mevcut seo_pages degerine og_image alanlarini yazar.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE site_settings
SET value = JSON_SET(value,
  '$.home.og_image',        '/uploads/media/seo/og-default.jpg',
  '$.ilanlar.og_image',     '/uploads/media/seo/og-listings.jpg',
  '$."ilan-ver".og_image',  '/uploads/media/seo/og-default.jpg',
  '$.giris.og_image',       '/uploads/media/seo/og-default.jpg',
  '$."uye-ol".og_image',    '/uploads/media/seo/og-default.jpg',
  '$.iletisim.og_image',    '/uploads/media/seo/og-contact.jpg',
  '$.hakkimizda.og_image',  '/uploads/media/seo/og-about.jpg',
  '$.sss.og_image',         '/uploads/media/seo/og-faq.jpg',
  '$.faq.og_image',         '/uploads/media/seo/og-faq.jpg'
)
WHERE `key` IN ('paketjet__seo_pages', 'seo_pages')
  AND JSON_VALID(value);
