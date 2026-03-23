-- =============================================================
-- FILE: src/db/seed/sql/105_bookings_schema.sql
-- DESCRIPTION: PaketJet — bookings tablosu
-- Bağımlılık: 10_auth_schema.sql, 104_ilanlar_schema.sql
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id               CHAR(36)        NOT NULL,
  ilan_id          CHAR(36)        NOT NULL,
  customer_id      CHAR(36)        NOT NULL,
  carrier_id       CHAR(36)        NOT NULL,

  -- Yük bilgisi
  kg_amount        DECIMAL(10,2)   NOT NULL,
  total_price      DECIMAL(12,2)   NOT NULL,
  currency         VARCHAR(10)     NOT NULL DEFAULT 'TRY',

  -- Adresler
  pickup_address   TEXT            DEFAULT NULL,
  delivery_address TEXT            DEFAULT NULL,

  -- Notlar
  customer_notes   TEXT            DEFAULT NULL,
  carrier_notes    TEXT            DEFAULT NULL,

  -- Durum: pending | confirmed | in_transit | delivered | cancelled | disputed
  status           VARCHAR(50)     NOT NULL DEFAULT 'pending',

  -- Ödeme: unpaid | paid | refunded
  payment_status   VARCHAR(50)     NOT NULL DEFAULT 'unpaid',
  -- Yöntem: wallet | card | transfer
  payment_method   VARCHAR(50)     DEFAULT NULL,

  -- İş akışı zaman damgaları
  confirmed_at     DATETIME(3)     DEFAULT NULL,
  delivered_at     DATETIME(3)     DEFAULT NULL,
  cancelled_at     DATETIME(3)     DEFAULT NULL,

  created_at       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY bookings_ilan_id_idx     (ilan_id),
  KEY bookings_customer_id_idx (customer_id),
  KEY bookings_carrier_id_idx  (carrier_id),
  KEY bookings_status_idx      (status),

  CONSTRAINT fk_bookings_ilan     FOREIGN KEY (ilan_id)     REFERENCES ilanlar (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES users (id)   ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_carrier  FOREIGN KEY (carrier_id)  REFERENCES users (id)   ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
