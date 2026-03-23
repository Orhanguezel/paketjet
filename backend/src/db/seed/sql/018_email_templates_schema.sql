-- =============================================================
-- FILE: src/db/seed/sql/110_email_templates_schema.sql
-- DESCRIPTION: PaketJet — email_templates tablosu + varsayılan şablonlar
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_templates` (
  `id`           CHAR(36)      NOT NULL,
  `template_key`  VARCHAR(100)  NOT NULL,
  `template_name` VARCHAR(255)  DEFAULT NULL,
  `subject`       VARCHAR(500)  DEFAULT NULL,
  `content_html`  LONGTEXT      DEFAULT NULL,
  `variables`     LONGTEXT      DEFAULT NULL,
  `is_active`    TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_templates_key_uq`    (`template_key`),
  KEY `email_templates_active_idx`       (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan PaketJet e-posta şablonları
INSERT IGNORE INTO `email_templates` (`id`, `template_key`, `template_name`, `subject`, `variables`, `is_active`)
VALUES
  (UUID(), 'booking_created',    'Rezervasyon Oluşturuldu',      'Rezervasyonunuz alındı — {{from_city}} → {{to_city}}', '["customer_name","carrier_name","from_city","to_city","kg_amount","total_price","departure_date"]', 1),
  (UUID(), 'booking_confirmed',  'Rezervasyon Onaylandı',        'Rezervasyonunuz onaylandı — {{from_city}} → {{to_city}}', '["customer_name","carrier_name","from_city","to_city","departure_date"]', 1),
  (UUID(), 'booking_cancelled',  'Rezervasyon İptal Edildi',     'Rezervasyonunuz iptal edildi', '["customer_name","from_city","to_city","reason"]', 1),
  (UUID(), 'booking_delivered',  'Kargo Teslim Edildi',          'Kargonuz teslim edildi — {{from_city}} → {{to_city}}', '["customer_name","carrier_name","from_city","to_city"]', 1),
  (UUID(), 'booking_in_transit', 'Kargo Yola Çıktı',             'Kargonuz yola çıktı — {{from_city}} → {{to_city}}', '["customer_name","from_city","to_city"]', 1),
  (UUID(), 'wallet_deposit',     'Cüzdan Bakiyesi Yüklendi',     '{{amount}} TL cüzdanınıza eklendi', '["user_name","amount","new_balance"]', 1),
  (UUID(), 'wallet_refund',      'İade Gerçekleşti',             '{{amount}} TL iade edildi', '["user_name","amount","new_balance"]', 1),
  (UUID(), 'carrier_payment',    'Ödeme Alındı',                 '{{amount}} TL hesabınıza aktarıldı', '["carrier_name","amount","new_balance"]', 1),
  (UUID(), 'password_reset',     'Şifre Sıfırlama',              'Şifrenizi sıfırlamak için bağlantıya tıklayın', '["user_name","reset_link","expires_in"]', 1),
  (UUID(), 'welcome',            'PaketJet''e Hoş Geldiniz',     'Hesabınız başarıyla oluşturuldu', '["user_name","role"]', 1);
