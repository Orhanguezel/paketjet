-- =============================================================
-- FILE: src/db/seed/sql/051_clean_logo_defaults.sql
-- DESCRIPTION: Tema uyumlu temiz logo varsayılanları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
VALUES
  (UUID(), 'site_logo', '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo"}'),
  (UUID(), 'site_logo_light', '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Light"}'),
  (UUID(), 'site_logo_dark', '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Dark"}'),
  (UUID(), 'brand_logo', '*', '"/uploads/media/logo/logo-transparent.png"'),
  (UUID(), 'brand_logo_dark', '*', '"/uploads/media/logo/logo-transparent.png"'),
  (UUID(), 'brand_logo_icon_transparent', '*', '"/uploads/media/logo/logo-transparent.png"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);
