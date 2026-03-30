-- =============================================================
-- FILE: src/db/seed/sql/114_site_settings_brand_prefix_seed.sql
-- DESCRIPTION: PaketJet — Admin panel brand-prefix'li site_settings kayitlari
-- Admin panel tum key'leri paketjet__ prefix'i ile sorgular.
-- Bu seed, admin panelin sayfa yuklenisinde 404 almamasi icin gerekli
-- kayitlari olusturur.
-- Bagimlilik: 60_site_settings_schema.sql
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- paketjet__site_logo  (Brand Media tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'paketjet__site_logo', '*',
 '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo","urlDark":"/uploads/media/logo/logo-transparent.png","altDark":"PaketJet Logo Dark","favicon":"/uploads/media/logo/favicon.ico","faviconAlt":"PaketJet Favicon","appleTouchIcon":"/uploads/media/logo/apple-touch-icon.png","appleTouchIconAlt":"PaketJet Apple Touch","ogImage":"/uploads/media/logo/logo-512x512.png","ogImageAlt":"PaketJet OG Image"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- paketjet__logo  (legacy fallback)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'paketjet__logo', '*', '"/uploads/media/logo/logo-transparent.png"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- paketjet__seo_pages  (SEO tab — sayfa bazli SEO ayarlari)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'paketjet__seo_pages', 'tr',
 '{
   "home":{"title":"PaketJet | Kargo Göndermek Artık Çok Kolay","description":"PaketJet ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","keywords":"paketjet, kargo gönder, taşıyıcı ilan, p2p kargo","robots":"index, follow","noIndex":false},
   "ilanlar":{"title":"Taşıma İlanları | PaketJet","description":"Tüm taşıyıcı ilanlarını inceleyin. Güzergah, kapasite ve fiyata göre filtreli arama.","keywords":"taşıyıcı ilanı, kargo ilanı, kargo bul","robots":"index, follow","noIndex":false},
   "ilan-ver":{"title":"İlan Ver | PaketJet","description":"Taşıyıcı olarak müsait kapasitenizi yayınlayın.","keywords":"ilan ver, taşıyıcı ol, kapasite paylaş","robots":"index, follow","noIndex":false},
   "hakkimizda":{"title":"Hakkımızda | PaketJet","description":"PaketJet hakkında bilgi edinin.","keywords":"paketjet hakkında, p2p kargo nedir","robots":"index, follow","noIndex":false},
   "iletisim":{"title":"İletişim | PaketJet","description":"PaketJet ile iletişime geçin.","keywords":"paketjet iletişim","robots":"index, follow","noIndex":false},
   "sss":{"title":"S.S.S. | PaketJet","description":"PaketJet hakkında sıkça sorulan sorular.","keywords":"paketjet sss","robots":"index, follow","noIndex":false},
   "giris":{"title":"Giriş Yap | PaketJet","description":"PaketJet hesabınıza giriş yapın.","keywords":"","robots":"noindex, follow","noIndex":true},
   "uye-ol":{"title":"Üye Ol | PaketJet","description":"PaketJet''e üye olun.","keywords":"","robots":"noindex, follow","noIndex":true}
 }')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- paketjet__app_locales  (Dil Ayarlari tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'paketjet__app_locales', '*',
 '[{"code":"tr","label":"Türkçe","is_active":true,"is_default":true},{"code":"en","label":"English","is_active":false,"is_default":false}]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
