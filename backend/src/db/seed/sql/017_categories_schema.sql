-- =============================================================
-- FILE: src/db/seed/sql/109_categories_schema.sql
-- DESCRIPTION: PaketJet — categories + category_i18n tabloları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id`               CHAR(36)      NOT NULL,
  `module_key`       VARCHAR(64)   NOT NULL DEFAULT 'general',
  `image_url`        LONGTEXT      DEFAULT NULL,
  `storage_asset_id` CHAR(36)      DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `icon`             VARCHAR(255)  DEFAULT NULL,
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `categories_active_idx`        (`is_active`),
  KEY `categories_order_idx`         (`display_order`),
  KEY `categories_storage_asset_idx` (`storage_asset_id`),
  KEY `categories_module_idx`        (`module_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category_i18n` (
  `category_id`      CHAR(36)      NOT NULL,
  `locale`           VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `name`             VARCHAR(255)  NOT NULL,
  `slug`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `meta_title`       VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`category_id`, `locale`),
  UNIQUE KEY `category_i18n_slug_locale_uq` (`slug`, `locale`),
  KEY `category_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_category_i18n_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PaketJet kargo kategorileri seed
INSERT IGNORE INTO `categories` (`id`, `module_key`, `icon`, `is_active`, `is_featured`, `display_order`)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ilanlar', 'package',      1, 1, 1),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'ilanlar', 'truck',        1, 1, 2),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'ilanlar', 'car',          1, 1, 3),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'ilanlar', 'box',          1, 0, 4),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', 'ilanlar', 'thermometer',  1, 0, 5),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6', 'ilanlar', 'shield',       1, 0, 6);

INSERT IGNORE INTO `category_i18n` (`category_id`, `locale`, `name`, `slug`, `description`)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'tr', 'Genel Kargo',        'genel-kargo',       'Her türlü paket ve koli taşıması'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'tr', 'Büyük Yük',          'buyuk-yuk',         'Kamyon ve TIR ile büyük yük taşıması'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'tr', 'Minibüs / Minivan',  'minibus-minivan',   'Minibüs veya minivan ile taşıma'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'tr', 'Koli & Paket',       'koli-paket',        'El bagajı ve küçük paket taşıması'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', 'tr', 'Soğuk Zincir',       'soguk-zincir',      'Soğutma gerektiren gıda ve ilaç taşıması'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6', 'tr', 'Sigortalı Taşıma',   'sigortali-tasima',  'Sigorta güvenceli değerli eşya taşıması');
