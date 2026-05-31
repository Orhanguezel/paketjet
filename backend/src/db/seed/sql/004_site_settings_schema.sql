/* site_settings_schema.sql  — PaketJet */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `site_settings`;

CREATE TABLE `site_settings` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `locale` VARCHAR(8) NOT NULL DEFAULT '*',
  `value` MEDIUMTEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- BRAND / UI
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_name',         '*', '"PaketJet"'),
(UUID(), 'brand_display_name', '*', '"PaketJet"'),
(UUID(), 'brand_logo_text',    '*', '"PaketJet"'),
(UUID(), 'brand_subtitle',     '*', '"P2P Kargo Pazaryeri"'),
(UUID(), 'brand_tagline',      '*', '"Kargo Göndermek Artık Çok Kolay"'),
(UUID(), 'topbar_location',    '*', '"Türkiye"'),
(UUID(), 'topbar_slogan',      '*', '"Güvenli ve Hızlı P2P Kargo"'),
(UUID(), 'ui_theme',           '*', '{"primaryHex":"#F97316","darkMode":"light","radius":"0.5rem"}'),
(UUID(), 'site_version',       '*', '"1.0.0"'),
(UUID(), 'admin_path',         '*', '"/admin"');

-- =============================================================
-- BRAND MEDIA (storage_assets URLs)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_logo',                  '*', '"/uploads/media/logo/logo-transparent.png"'),
(UUID(), 'brand_logo_dark',             '*', '"/uploads/media/logo/logo-transparent.png"'),
(UUID(), 'brand_logo_icon',             '*', '"/uploads/media/logo/favicon-32x32.png"'),
(UUID(), 'brand_logo_icon_transparent', '*', '"/uploads/media/logo/logo-transparent.png"'),
(UUID(), 'brand_logo_icon_192',         '*', '"/uploads/media/logo/favicon-192x192.png"'),
(UUID(), 'brand_logo_icon_512',         '*', '"/uploads/media/logo/logo-512x512.png"'),
(UUID(), 'brand_og_image',              '*', '"/uploads/media/logo/logo-512x512.png"');

-- =============================================================
-- SITE MEDIA (Logo & Favicon)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo"}'),
(UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Dark"}'),
(UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo-transparent.png","alt":"PaketJet Logo Light"}'),
(UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/favicon.ico","alt":"PaketJet Favicon"}'),
(UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/apple-touch-icon.png","alt":"PaketJet Apple Touch"}'),
(UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo-512x512.png","alt":"PaketJet Icon 512"}'),
(UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/logo/logo-512x512.png","alt":"PaketJet - P2P Kargo Pazaryeri"}');

-- =============================================================
-- CONTACT
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'contact_phone_display',  '*', '"0312 000 00 00"'),
(UUID(), 'contact_phone_tel',      '*', '"03120000000"'),
(UUID(), 'contact_email',          '*', '"info@paketjet.net"'),
(UUID(), 'contact_to_email',       '*', '"info@paketjet.net"'),
(UUID(), 'contact_address',        '*', '"Türkiye"'),
(UUID(), 'contact_whatsapp_link',  '*', '"https://wa.me/903120000000"');

-- =============================================================
-- STORAGE / UPLOAD CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'storage_driver',             '*', '"local"'),
(UUID(), 'storage_local_root',         '*', '"/www/wwwroot/paketjet/uploads"'),
(UUID(), 'storage_local_base_url',     '*', '"/uploads"'),
(UUID(), 'storage_cdn_public_base',    '*', '"https://cdn.paketjet.com"'),
(UUID(), 'storage_public_api_base',    '*', '"https://paketjet.com/api"'),
(UUID(), 'cloudinary_cloud_name',      '*', '""'),
(UUID(), 'cloudinary_api_key',         '*', '""'),
(UUID(), 'cloudinary_api_secret',      '*', '"__SET_IN_ENV__"'),
(UUID(), 'cloudinary_folder',          '*', '"uploads"'),
(UUID(), 'cloudinary_unsigned_preset', '*', '""');

-- =============================================================
-- SMTP / MAIL CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'smtp_host',        '*', '"smtp.example.com"'),
(UUID(), 'smtp_port',        '*', '587'),
(UUID(), 'smtp_username',    '*', '"info@paketjet.net"'),
(UUID(), 'smtp_password',    '*', '"__SET_IN_ENV__"'),
(UUID(), 'smtp_from_email',  '*', '"info@paketjet.net"'),
(UUID(), 'smtp_from_name',   '*', '"PaketJet"'),
(UUID(), 'smtp_ssl',         '*', 'false');

-- =============================================================
-- HEADER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'header_info_text',  '*', '"Taşıyıcı ilanlarını keşfet"'),
(UUID(), 'header_cta_label',  '*', '"KARGO GÖNDER"');

-- =============================================================
-- HEADER MENU
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'header_menu', '*',
  '[{"title":"Anasayfa","path":"/"},{"title":"İlanlar","path":"/ilanlar"},{"title":"Hakkımızda","path":"/hakkimizda"},{"title":"İletişim","path":"/iletisim"}]'
);

-- =============================================================
-- FOOTER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'footer_keywords',    '*', '["P2P Kargo","Taşıyıcı İlanı","Kargo Gönder","Rezervasyon","Güvenli Kargo","PaketJet"]'),
(UUID(), 'footer_services',    '*', '["Kargo Gönder","İlan Ara","Taşıyıcı Ol"]'),
(UUID(), 'footer_quick_links', '*', '[{"title":"Anasayfa","path":"/"},{"title":"İlanlar","path":"/ilanlar"},{"title":"Hakkımızda","path":"/hakkimizda"},{"title":"İletişim","path":"/iletisim"},{"title":"Destek","path":"/destek"}]');

-- =============================================================
-- MENU (Header dropdown)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'menu_kurumsal', '*',
  '[{"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about"},{"title":"S.S.S.","path":"/sss","pageKey":"faq"},{"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact"}]'
);

-- =============================================================
-- SEO GLOBAL DEFAULTS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_defaults', '*',
 '{"canonicalBase":"https://paketjet.com","siteName":"PaketJet | Kargo Göndermek Artık Çok Kolay","description":"PaketJet ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","ogLocale":"tr_TR","author":"PaketJet","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
(UUID(), 'public_base_url',  '*', '"http://localhost:3000"'),
(UUID(), 'site_title',       '*', '"PaketJet"'),
(UUID(), 'company_brand',    '*', '{"name":"PaketJet","shortName":"PaketJet"}'),
(UUID(), 'socials',          '*', '{"instagram":"https://www.instagram.com/paketjet","facebook":"https://www.facebook.com/paketjet","twitter":"https://www.twitter.com/paketjet"}'),
(UUID(), 'social_facebook_url',  '*', '"https://www.facebook.com/paketjet"'),
(UUID(), 'social_instagram_url', '*', '"https://www.instagram.com/paketjet"'),
(UUID(), 'social_twitter_url',   '*', '"https://www.twitter.com/paketjet"'),
(UUID(), 'seo_social_same_as',  '*', '["https://www.instagram.com/paketjet","https://www.facebook.com/paketjet"]'),
(UUID(), 'seo_app_icons', '*',
 '{"appleTouchIcon":"/uploads/media/logo/logo3.jpg","favicon":"/uploads/media/logo/logo4.jpg","faviconSvg":"/uploads/media/logo/logo4.jpg","logoIcon192":"/uploads/media/logo/logo3.jpg","logoIcon512":"/uploads/media/logo/logo.jpeg"}'),
(UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"');

-- =============================================================
-- SEO SAYFA BAZLI — Her sayfanın kendi SEO ayarları
-- title, description, keywords, ogImage, robots (index/noindex)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES

-- Anasayfa
(UUID(), 'seo_pages_home', '*',
 '{"title":"PaketJet | Kargo Göndermek Artık Çok Kolay","description":"PaketJet ile taşıyıcı ilanlarına göz at, kargo rezervasyonu yap. Türkiye geneli P2P kargo pazaryeri.","keywords":"paketjet, kargo gönder, taşıyıcı ilan, p2p kargo, kargo rezervasyon","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İlanlar listesi
(UUID(), 'seo_pages_listings', '*',
 '{"title":"Taşıma İlanları | PaketJet","description":"Tüm taşıyıcı ilanlarını inceleyin. Güzergah, kapasite ve fiyata göre filtreli arama.","keywords":"taşıyıcı ilanı, kargo ilanı, paketjet ilanlar, kargo bul","ogImage":"/uploads/media/hero/og-ilanlar.jpg","robots":"index, follow","noIndex":false}'),

-- İlan detay (template)
(UUID(), 'seo_pages_listing_detail', '*',
 '{"titleTemplate":"{{title}} | PaketJet","descriptionTemplate":"{{from_city}} → {{to_city}} güzergahında taşıma ilanı. PaketJet ile güvenli kargo rezervasyonu yapın.","keywordsTemplate":"paketjet, {{from_city}}, {{to_city}}, kargo, taşıyıcı","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İlan ver
(UUID(), 'seo_pages_ilan_ver', '*',
 '{"title":"İlan Ver | PaketJet","description":"Taşıyıcı olarak müsait kapasitenizi yayınlayın. Güzergah ve tarih belirleyin, kargo taleplerini alın.","keywords":"ilan ver, taşıyıcı ol, kargo ilanı aç, kapasite paylaş","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- Hakkımızda
(UUID(), 'seo_pages_about', '*',
 '{"title":"Hakkımızda | PaketJet","description":"PaketJet hakkında bilgi edinin. Türkiye geneli P2P kargo pazaryeri.","keywords":"paketjet hakkında, p2p kargo nedir","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- İletişim
(UUID(), 'seo_pages_contact', '*',
 '{"title":"İletişim | PaketJet","description":"PaketJet ile iletişime geçin. Sorularınız için bize ulaşın.","keywords":"paketjet iletişim, kargo destek","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- S.S.S.
(UUID(), 'seo_pages_faq', '*',
 '{"title":"Sıkça Sorulan Sorular | PaketJet","description":"PaketJet hakkında sıkça sorulan sorular ve cevapları. Kargo gönderimi, rezervasyon, ödeme süreçleri.","keywords":"paketjet sss, kargo soru cevap, nasıl çalışır","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

-- Giriş yap
(UUID(), 'seo_pages_login', '*',
 '{"title":"Giriş Yap | PaketJet","description":"PaketJet hesabınıza giriş yapın.","keywords":"paketjet giriş, login","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

-- Üye ol
(UUID(), 'seo_pages_register', '*',
 '{"title":"Üye Ol | PaketJet","description":"PaketJet''e üye olun. Taşıyıcı veya müşteri olarak hemen kayıt olun.","keywords":"paketjet kayıt, üye ol, taşıyıcı kayıt","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

-- Şifremi unuttum
(UUID(), 'seo_pages_password_reset', '*',
 '{"title":"Şifremi Unuttum | PaketJet","description":"PaketJet şifre sıfırlama sayfası.","keywords":"paketjet şifre sıfırlama","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}'),

-- Panel (dashboard — noindex)
(UUID(), 'seo_pages_panel', '*',
 '{"title":"Panel | PaketJet","description":"PaketJet kullanıcı paneli.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}'),

-- Admin (noindex)
(UUID(), 'seo_pages_admin', '*',
 '{"title":"Admin Panel | PaketJet","description":"PaketJet yönetim paneli.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}');

-- =============================================================
-- JSON-LD (Organization)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_local_business', '*',
 '{"@context":"https://schema.org","@type":"Organization","name":"PaketJet","description":"Türkiye geneli P2P kargo pazaryeri. Taşıyıcılar ilan açar, müşteriler kargo yeri satın alır.","url":"https://paketjet.com","sameAs":["https://www.instagram.com/paketjet","https://www.facebook.com/paketjet"]}');

-- =============================================================
-- HOMEPAGE SETTINGS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'homepage_sections', '*',
 '[{"key":"hero","enabled":true,"order":1,"label":"Hero Bölümü"},{"key":"categories","enabled":true,"order":2,"label":"Tüm Kategoriler"},{"key":"featured","enabled":true,"order":3,"label":"Öne Çıkan İlanlar"},{"key":"recent","enabled":true,"order":4,"label":"Son İlanlar"}]'),

-- Hero bölümü ayarları
(UUID(), 'homepage_hero', '*',
 '{"title":"Kargo Göndermek Artık Çok Kolay","subtitle":"Taşıyıcı ilanlarına göz at, uygun güzergahı bul, kargo alanını hemen rezerve et.","bgImage":"/uploads/media/hero/arkaplan.gif","bgImageDark":"/uploads/media/hero/arkaplan.gif","bgOverlayOpacity":0.55,"ctaLabel":"KARGO GÖNDER","ctaPath":"/ilan-ver","ctaSecondaryLabel":"İLANLARI GÖR","ctaSecondaryPath":"/ilanlar","videoLoops":2,"videoPauseMs":8000,"videoFadeMs":1000}'),

-- Hero banner görselleri (slider/carousel)
(UUID(), 'homepage_banners', '*',
 '[{"image":"/uploads/media/hero/arkaplan.gif","alt":"PaketJet - P2P Kargo","link":"/ilanlar","order":1},{"image":"/uploads/media/logo/logo.jpeg","alt":"PaketJet Logo","link":"/ilan-ver","order":2}]');

-- =============================================================
-- CTA
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'cta_post_listing_title',    '*', '"Kargo İlanı Ver"'),
(UUID(), 'cta_post_listing_subtitle', '*', '"Taşıyıcı olarak müsait kapasitenizi saniyeler içinde yayınlayın"'),
(UUID(), 'cta_post_listing_path',     '*', '"/ilan-ver"');

-- =============================================================
-- ADMIN UI BRANDING
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'ui_admin_config', '*',
  '{
    "default_locale":"tr",
    "theme":{"mode":"light","preset":"soft-pop","font":"inter"},
    "layout":{"sidebar_variant":"inset","sidebar_collapsible":"icon","navbar_style":"sticky","content_layout":"full-width"},
    "branding":{
      "app_name":"PaketJet Admin Panel",
      "app_copyright":"PaketJet",
      "html_lang":"tr",
      "theme_color":"#F97316",
      "favicon_16":"/uploads/media/logo/favicon-32x32.png",
      "favicon_32":"/uploads/media/logo/favicon-32x32.png",
      "favicon":"/uploads/media/logo/favicon.ico",
      "favicon_svg":"/uploads/media/logo/favicon-32x32.png",
      "apple_touch_icon":"/uploads/media/logo/apple-touch-icon.png",
      "logo":"/uploads/media/logo/logo-transparent.png",
      "logo_dark":"/uploads/media/logo/logo-transparent.png",
      "logo_icon":"/uploads/media/logo/favicon-192x192.png",
      "meta":{
        "title":"PaketJet Admin Panel",
        "description":"PaketJet yönetim paneli. Taşıyıcılar, ilanlar, rezervasyonlar ve site ayarları yönetimi.",
        "og_url":"https://paketjet.com/admin",
        "og_title":"PaketJet Admin Panel",
        "og_description":"PaketJet yönetim paneli ile ilan ve rezervasyon yönetimini merkezi olarak yapın.",
        "og_image":"/uploads/media/logo/logo-512x512.png",
        "twitter_card":"summary_large_image"
      }
    }
  }'
),
(
  UUID(), 'ui_admin', '*',
  '{
    "app_name":"PaketJet Admin Panel",
    "app_version":"v1.0.0",
    "developer_branding":{"name":"PaketJet","url":"https://paketjet.com","full_name":"PaketJet"},
    "nav":{
      "labels":{
        "general":"Genel / Yönetim",
        "listings":"İlan Yönetimi",
        "finance":"Kullanıcılar & Finans",
        "support":"Destek",
        "system":"Sistem & Ayarlar"
      },
      "items":{
        "dashboard":"Özet",
        "ilanlar":"İlanlar",
        "bookings":"Rezervasyonlar",
        "categories":"Kategoriler",
        "gallery":"Galeri",
        "users":"Kullanıcılar",
        "carriers":"Taşıyıcılar",
        "wallets":"Cüzdanlar",
        "reports":"Raporlar",
        "contacts":"İletişim Mesajları",
        "email_templates":"E-posta Şablonları",
        "site_settings":"Site Ayarları",
        "storage":"Dosya Yöneticisi",
        "theme":"Tema",
        "telegram":"Telegram",
        "audit":"Denetim"
      }
    },
    "common":{
      "actions":{
        "create":"Oluştur",
        "edit":"Düzenle",
        "delete":"Sil",
        "save":"Kaydet",
        "cancel":"İptal",
        "refresh":"Yenile",
        "search":"Ara",
        "filter":"Filtrele",
        "close":"Kapat",
        "back":"Geri",
        "confirm":"Onayla"
      },
      "states":{
        "loading":"Yükleniyor...",
        "error":"İşlem başarısız.",
        "empty":"Veri bulunamadı.",
        "updating":"Güncelleniyor...",
        "saving":"Kaydediliyor..."
      }
    }
  }'
);
