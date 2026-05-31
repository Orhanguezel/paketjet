-- =============================================================
-- 035: General tab içerikleri — Hero, İletişim, Firma, Sosyal, Header, Footer
-- Admin panel > Site Ayarları > Genel tabından düzenlenebilir
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- HERO İÇERİĞİ (video + görsel destekli)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'hero', 'tr',
 '{
   "video_desktop": "/uploads/media/video/hero.mp4",
   "video_mobile": "/uploads/media/video/acilis.mp4",
   "video_poster": "/uploads/media/hero/arkaplan.gif",
   "headline_tr": "Kargon Güvende, Yolculuğun Başlasın",
   "headline_en": "Your Cargo is Safe, Let the Journey Begin",
   "subheadline_tr": "Taşıyıcı ilanlarını keşfet, uygun güzergahı bul ve kargo alanını hemen rezerve et. Türkiye geneli güvenli P2P kargo.",
   "subheadline_en": "Browse carrier listings, find the right route and reserve your cargo space instantly.",
   "cta_text_tr": "Kargo Gönder",
   "cta_text_en": "Send Cargo",
   "cta_url": "/ilanlar"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'hero_video', '*',
 '{
   "desktop": "/uploads/media/video/hero.mp4",
   "mobile": "/uploads/media/video/acilis.mp4"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'hero_config', 'tr',
 '{
   "headline": "Kargon Güvende, Yolculuğun Başlasın",
   "sub_headline": "Taşıyıcı ilanlarını keşfet, uygun güzergahı bul ve kargo alanını hemen rezerve et.",
   "button_text": "Kargo Gönder",
   "button_link": "/ilanlar"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- ANA SAYFA ARKA PLAN GÖRSELLERİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'home_backgrounds', '*',
 '[
   {"url": "/uploads/media/hero/arkaplan.gif", "alt": "PaketJet - Kargo Animasyonu"},
   {"url": "/uploads/media/logo/logo.jpeg", "alt": "PaketJet Logo"},
   {"url": "/uploads/media/logo/logo2.jpeg", "alt": "PaketJet Logo Dark"}
 ]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- İLETİŞİM BİLGİLERİ (yapılandırılmış form)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'contact_info', 'tr',
 '{
   "company_name": "PaketJet Teknoloji A.Ş.",
   "phone": "+90 312 000 00 00",
   "phone_2": "+90 532 000 00 00",
   "email": "info@paketjet.net",
   "email_2": "destek@paketjet.net",
   "address": "Çankaya, Ankara, Türkiye",
   "city": "Ankara",
   "country": "Türkiye",
   "working_hours": "Pazartesi - Cuma: 09:00 - 18:00",
   "maps_embed_url": "https://www.google.com/maps?q=Çankaya,Ankara,Turkey&output=embed",
   "maps_lat": "39.9208",
   "maps_lng": "32.8541"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- ŞİRKET PROFİLİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'company_profile', 'tr',
 '{
   "company_name": "PaketJet Teknoloji A.Ş.",
   "slogan": "Kargo Göndermek Artık Çok Kolay",
   "about": "PaketJet, şehirler arası taşıma kapasitesini dijital olarak erişilebilir hale getiren bir P2P kargo pazaryeridir. Taşıyıcılar güzergah ve kapasite ilanı açar, müşteriler uygun ilanı bulup kargo alanı satın alır. BlaBlaCar modeli, kargo için."
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- SOSYAL MEDYA LİNKLERİ (yapılandırılmış form)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'socials', 'tr',
 '{
   "instagram": "https://www.instagram.com/paketjet",
   "facebook": "https://www.facebook.com/paketjet",
   "linkedin": "https://www.linkedin.com/company/paketjet",
   "youtube": "https://www.youtube.com/@paketjet",
   "x": "https://x.com/paketjet"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- ÇALIŞMA SAATLERİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'businessHours', 'tr',
 '[
   {"day": "mon", "open": "09:00", "close": "18:00", "closed": false},
   {"day": "tue", "open": "09:00", "close": "18:00", "closed": false},
   {"day": "wed", "open": "09:00", "close": "18:00", "closed": false},
   {"day": "thu", "open": "09:00", "close": "18:00", "closed": false},
   {"day": "fri", "open": "09:00", "close": "18:00", "closed": false},
   {"day": "sat", "open": "10:00", "close": "15:00", "closed": false},
   {"day": "sun", "open": "00:00", "close": "00:00", "closed": true}
 ]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- ÜST MENÜ ETİKETLERİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'ui_header', 'tr',
 '{
   "nav_home": "Anasayfa",
   "nav_products": "İlanlar",
   "nav_services": "Nasıl Çalışır",
   "nav_news": "Blog",
   "nav_about": "Hakkımızda",
   "nav_contact": "İletişim",
   "cta_label": "Kargo Gönder"
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- SEO SAYFA AYARLARI (General tab formu)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages', 'tr',
 '{
   "home": {
     "title": "PaketJet | Kargo Göndermek Artık Çok Kolay",
     "description": "PaketJet ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.",
     "keywords": "paketjet, kargo gönder, taşıyıcı ilan, p2p kargo, kargo rezervasyon",
     "ogImage": "/uploads/media/hero/og-default.jpg",
     "robots": "index, follow",
     "noIndex": false
   },
   "listings": {
     "title": "Taşıma İlanları | PaketJet",
     "description": "Tüm taşıyıcı ilanlarını inceleyin. Güzergah, kapasite ve fiyata göre filtreli arama.",
     "keywords": "taşıyıcı ilanı, kargo ilanı, kargo bul",
     "ogImage": "/uploads/media/hero/og-default.jpg",
     "robots": "index, follow",
     "noIndex": false
   },
   "listing_detail": {
     "titleTemplate": "{{title}} | PaketJet",
     "descriptionTemplate": "{{from_city}} → {{to_city}} güzergahında taşıma ilanı.",
     "robots": "index, follow",
     "noIndex": false
   },
   "ilan_ver": {
     "title": "İlan Ver | PaketJet",
     "description": "Taşıyıcı olarak müsait kapasitenizi yayınlayın.",
     "keywords": "ilan ver, taşıyıcı ol",
     "robots": "index, follow",
     "noIndex": false
   },
   "about": {
     "title": "Hakkımızda | PaketJet",
     "description": "PaketJet hakkında bilgi edinin.",
     "robots": "index, follow",
     "noIndex": false
   },
   "contact": {
     "title": "İletişim | PaketJet",
     "description": "PaketJet ile iletişime geçin.",
     "robots": "index, follow",
     "noIndex": false
   },
   "faq": {
     "title": "S.S.S. | PaketJet",
     "description": "Sıkça sorulan sorular ve cevapları.",
     "robots": "index, follow",
     "noIndex": false
   },
   "login": {
     "title": "Giriş Yap | PaketJet",
     "description": "PaketJet hesabınıza giriş yapın.",
     "robots": "noindex, follow",
     "noIndex": true
   },
   "register": {
     "title": "Üye Ol | PaketJet",
     "description": "PaketJet''e üye olun.",
     "robots": "noindex, follow",
     "noIndex": true
   },
   "password_reset": {
     "title": "Şifremi Unuttum | PaketJet",
     "robots": "noindex, nofollow",
     "noIndex": true
   },
   "panel": {
     "title": "Panel | PaketJet",
     "robots": "noindex, nofollow",
     "noIndex": true
   },
   "admin": {
     "title": "Admin Panel | PaketJet",
     "robots": "noindex, nofollow",
     "noIndex": true
   }
 }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- UYGULAMA DİLLERİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'app_locales', '*',
 '[
   {"code": "tr", "label": "Türkçe", "is_active": true, "is_default": true},
   {"code": "en", "label": "English", "is_active": false, "is_default": false}
 ]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- FOOTER GENİŞLETİLMİŞ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'footer_about', 'tr',
 '"PaketJet, şehirler arası taşıma kapasitesini dijital olarak erişilebilir hale getiren Türkiye''nin ilk P2P kargo pazaryeridir. Taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır."')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'footer_legal_links', '*',
 '[
   {"title": "Gizlilik Politikası", "path": "/gizlilik-politikasi", "pageKey": "privacy"},
   {"title": "KVKK", "path": "/kvkk", "pageKey": "kvkk"},
   {"title": "Kullanım Koşulları", "path": "/kullanim-kosullari", "pageKey": "terms"},
   {"title": "Taşıma Kuralları", "path": "/tasima-kurallari", "pageKey": "rules"}
 ]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'footer_copyright', '*', '"© 2026 PaketJet Teknoloji A.Ş. Tüm hakları saklıdır."')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- AUTH SAYFA GÖRSELLERİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'auth_login_image', '*', '"/uploads/media/images/sing_in.jpg"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'auth_register_image', '*', '"/uploads/media/images/sing_up.jpg"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- SPLASH VİDEO
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'splash_videos', '*', '["/uploads/media/video/acilis.mp4"]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- GİRİŞ EKRANI MARKA GÖRSELİ
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'login_brand_image', '*', '"/uploads/media/hero/arkaplan.gif"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- =============================================================
-- BRAND PREFIX (paketjet__) — Admin panel bu prefix ile sorgular
-- General tab key'lerinin prefix'li kopyaları
-- =============================================================

-- homepage_hero (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__homepage_hero', s.locale, s.value FROM site_settings s WHERE s.`key` = 'homepage_hero' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- hero (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__hero', s.locale, s.value FROM site_settings s WHERE s.`key` = 'hero' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- hero_video (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__hero_video', s.locale, s.value FROM site_settings s WHERE s.`key` = 'hero_video' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- hero_config (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__hero_config', s.locale, s.value FROM site_settings s WHERE s.`key` = 'hero_config' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- home_backgrounds (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__home_backgrounds', s.locale, s.value FROM site_settings s WHERE s.`key` = 'home_backgrounds' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- contact_info (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__contact_info', s.locale, s.value FROM site_settings s WHERE s.`key` = 'contact_info' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- socials (tr + *)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__socials', s.locale, s.value FROM site_settings s WHERE s.`key` = 'socials' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__socials', s.locale, s.value FROM site_settings s WHERE s.`key` = 'socials' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- businessHours (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__businessHours', s.locale, s.value FROM site_settings s WHERE s.`key` = 'businessHours' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- company_profile (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__company_profile', s.locale, s.value FROM site_settings s WHERE s.`key` = 'company_profile' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- ui_header (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__ui_header', s.locale, s.value FROM site_settings s WHERE s.`key` = 'ui_header' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- footer_about (tr)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__footer_about', s.locale, s.value FROM site_settings s WHERE s.`key` = 'footer_about' AND s.locale = 'tr'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- footer_quick_links (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__footer_quick_links', s.locale, s.value FROM site_settings s WHERE s.`key` = 'footer_quick_links' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- footer_legal_links (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__footer_legal_links', s.locale, s.value FROM site_settings s WHERE s.`key` = 'footer_legal_links' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- footer_copyright (*)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
SELECT UUID(), 'paketjet__footer_copyright', s.locale, s.value FROM site_settings s WHERE s.`key` = 'footer_copyright' AND s.locale = '*'
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);
