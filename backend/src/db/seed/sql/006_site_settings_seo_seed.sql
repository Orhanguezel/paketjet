/* 79_site_settings_seo_seed.sql — Site media + SEO defaults (PaketJet) */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =============================================================
   SITE MEDIA (used by Site Settings > Logo & Favicon tab)
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo"}'),
  (UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Dark"}'),
  (UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Light"}'),
  (UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/favicon.ico","alt":"PaketJet Favicon"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/apple-touch-icon.png","alt":"PaketJet Apple Touch"}'),
  (UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo-512x512.png","alt":"PaketJet Icon 512"}'),
  (UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/logo/logo-512x512.png","alt":"PaketJet - P2P Kargo Pazaryeri"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   SEO CORE
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'public_base_url', '*', '"https://paketjet.com"'),
  (UUID(), 'site_title',      '*', '"PaketJet"'),
  (UUID(), 'company_brand',   '*', '{"name":"PaketJet","shortName":"PaketJet"}'),
  (UUID(), 'socials',         '*', '{"instagram":"https://www.instagram.com/paketjet","facebook":"https://www.facebook.com/paketjet"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'seo_defaults', '*',
   '{"canonicalBase":"https://paketjet.com","siteName":"PaketJet","description":"P2P kargo pazaryeri. Taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır.","ogLocale":"tr_TR","author":"PaketJet","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
  (UUID(), 'seo_app_icons', '*',
   '{"appleTouchIcon":"/uploads/media/logo/apple-touch-icon.png","favicon":"/uploads/media/logo/favicon.ico","faviconSvg":"/uploads/media/logo/favicon-32x32.png","logoIcon192":"/uploads/media/logo/favicon-192x192.png","logoIcon512":"/uploads/media/logo/logo-512x512.png"}'),
  (UUID(), 'seo_social_same_as', '*',
   '["https://www.instagram.com/paketjet","https://www.facebook.com/paketjet"]'),
  (UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"'),
  (UUID(), 'site_meta_default', 'tr',
   '{"title":"PaketJet","description":"P2P kargo pazaryeri — BlaBlaCar modeli, kargo için","keywords":"paketjet, p2p kargo, kargo gönder, taşıyıcı"}'),
  (UUID(), 'site_seo', '*',
   '{"title_default":"PaketJet","title_template":"%s | PaketJet","description":"P2P kargo pazaryeri — taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   HOMEPAGE HERO
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'homepage_hero', '*',
   '{"title":"Kargo Göndermek Artık Çok Kolay","subtitle":"Taşıyıcı ilanlarına göz at, uygun güzergahı bul, kargo alanını hemen rezerve et.","bgImage":"/uploads/media/hero/arkaplan.gif","bgImageDark":"/uploads/media/hero/arkaplan.gif","bgOverlayOpacity":0.55,"ctaLabel":"KARGO GÖNDER","ctaPath":"/ilan-ver","ctaSecondaryLabel":"İLANLARI GÖR","ctaSecondaryPath":"/ilanlar","videoLoops":2,"videoPauseMs":8000,"videoFadeMs":1000}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
