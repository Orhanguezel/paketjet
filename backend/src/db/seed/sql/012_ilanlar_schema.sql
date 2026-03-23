-- =============================================================
-- FILE: src/db/seed/sql/104_ilanlar_schema.sql
-- DESCRIPTION: PaketJet — ilanlar + ilan_photos tabloları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1. İlanlar
CREATE TABLE IF NOT EXISTS ilanlar (
  id                    CHAR(36)        NOT NULL,
  user_id               CHAR(36)        NOT NULL,

  -- Güzergah
  from_city             VARCHAR(128)    NOT NULL,
  to_city               VARCHAR(128)    NOT NULL,
  from_district         VARCHAR(128)    DEFAULT NULL,
  to_district           VARCHAR(128)    DEFAULT NULL,
  departure_date        DATETIME(3)     NOT NULL,
  arrival_date          DATETIME(3)     DEFAULT NULL,

  -- Kapasite & Fiyat
  total_capacity_kg     DECIMAL(10,2)   NOT NULL,
  available_capacity_kg DECIMAL(10,2)   NOT NULL,
  price_per_kg          DECIMAL(10,2)   NOT NULL,
  currency              VARCHAR(10)     NOT NULL DEFAULT 'TRY',
  is_negotiable         TINYINT(1)      NOT NULL DEFAULT 0,

  -- Araç & İçerik
  vehicle_type          VARCHAR(50)     NOT NULL DEFAULT 'car',
  title                 VARCHAR(255)    DEFAULT NULL,
  description           TEXT            DEFAULT NULL,

  -- İletişim
  contact_phone         VARCHAR(50)     NOT NULL,
  contact_email         VARCHAR(255)    DEFAULT NULL,

  -- Durum: active | paused | completed | cancelled
  status                VARCHAR(50)     NOT NULL DEFAULT 'active',

  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY ilanlar_user_id_idx      (user_id),
  KEY ilanlar_status_idx       (status),
  KEY ilanlar_from_city_idx    (from_city),
  KEY ilanlar_to_city_idx      (to_city),
  KEY ilanlar_departure_idx    (departure_date),

  CONSTRAINT fk_ilanlar_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. İlan Fotoğrafları
CREATE TABLE IF NOT EXISTS ilan_photos (
  id          CHAR(36)        NOT NULL,
  ilan_id     CHAR(36)        NOT NULL,
  url         VARCHAR(500)    NOT NULL,
  `order`     INT             NOT NULL DEFAULT 0,
  created_at  DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY ilan_photos_ilan_id_idx (ilan_id),

  CONSTRAINT fk_ilan_photos_ilan FOREIGN KEY (ilan_id)
    REFERENCES ilanlar (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
