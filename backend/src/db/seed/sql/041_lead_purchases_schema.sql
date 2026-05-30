-- =============================================================
-- FILE: src/db/seed/sql/041_lead_purchases_schema.sql
-- DESCRIPTION: PaketJet pazar yeri pivotu (2026-05-30)
--   - ilan_purchases : lead-reveal satın alma (tek alıcı, bookings yerine)
--   - user_credits   : "İlan Alma Hakkı" bakiyesi (adet, para değil)
--   - credit_ledger  : hak hareketleri
-- Fiyatlandırma site_settings'te (039_pricing_settings_seed.sql) — burada tablo yok.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1. İlan satın alma (iletişim açma) — TEK ALICI
CREATE TABLE IF NOT EXISTS ilan_purchases (
  id                       CHAR(36)      NOT NULL,
  ilan_id                  CHAR(36)      NOT NULL,
  buyer_id                 CHAR(36)      NOT NULL,   -- satın alan (taşıyıcı)
  seller_id                CHAR(36)      NOT NULL,   -- ilan sahibi (gönderici, denormalize)

  price_paid               DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  pay_method               VARCHAR(20)   NOT NULL DEFAULT 'credit', -- credit | card
  credit_used              TINYINT(1)    NOT NULL DEFAULT 0,
  payment_ref              VARCHAR(255)  DEFAULT NULL,

  -- Yasal kayıt (satın alma anı snapshot'ları)
  estimated_value_snapshot DECIMAL(12,2) DEFAULT NULL,  -- ihtilaf tavanı
  contact_snapshot         JSON          DEFAULT NULL,  -- {name,phone,email,address}

  status                   VARCHAR(20)   NOT NULL DEFAULT 'completed', -- completed | refunded
  created_at               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at               DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  -- ⚠️ TEK ALICI GARANTİSİ: bir ilan yalnızca bir kez satılabilir (atomik)
  UNIQUE KEY uniq_ilan_purchase (ilan_id),
  KEY ilan_purchases_buyer_idx  (buyer_id),
  KEY ilan_purchases_seller_idx (seller_id),
  KEY ilan_purchases_status_idx (status),

  CONSTRAINT fk_ilanpur_ilan   FOREIGN KEY (ilan_id)  REFERENCES ilanlar (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ilanpur_buyer  FOREIGN KEY (buyer_id) REFERENCES users (id)   ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ilanpur_seller FOREIGN KEY (seller_id) REFERENCES users (id)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. İlan Alma Hakkı bakiyesi (adet)
CREATE TABLE IF NOT EXISTS user_credits (
  id          CHAR(36)   NOT NULL,
  user_id     CHAR(36)   NOT NULL,
  balance     INT        NOT NULL DEFAULT 0,   -- ADET (para değil)
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_credits (user_id),
  CONSTRAINT fk_user_credits_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Hak hareketleri
CREATE TABLE IF NOT EXISTS credit_ledger (
  id            CHAR(36)   NOT NULL,
  user_id       CHAR(36)   NOT NULL,
  delta         INT        NOT NULL,            -- +paket alımı / -reveal harcaması
  reason        VARCHAR(40) NOT NULL,           -- package_purchase | reveal_spend | admin_grant | refund
  ref_id        CHAR(36)   DEFAULT NULL,        -- ilgili purchase / paket id
  balance_after INT        NOT NULL,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  KEY credit_ledger_user_idx   (user_id),
  KEY credit_ledger_reason_idx (reason),
  KEY credit_ledger_created_idx (created_at),
  CONSTRAINT fk_credit_ledger_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
