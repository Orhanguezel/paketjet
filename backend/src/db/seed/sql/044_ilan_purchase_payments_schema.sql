-- =============================================================
-- FILE: src/db/seed/sql/044_ilan_purchase_payments_schema.sql
-- DESCRIPTION: Tekil ilan iletişim erişimi ödeme kayıtları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ilan_purchase_payments (
  id          CHAR(36)      NOT NULL,
  ilan_id     CHAR(36)      NOT NULL,
  buyer_id    CHAR(36)      NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  provider    VARCHAR(20)   NOT NULL,
  payment_ref VARCHAR(255)  NOT NULL,
  status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY uniq_ilan_payment_ref (payment_ref),
  KEY ilan_purchase_payments_ilan_idx (ilan_id),
  KEY ilan_purchase_payments_buyer_idx (buyer_id),
  CONSTRAINT fk_ilanpay_ilan FOREIGN KEY (ilan_id)
    REFERENCES ilanlar (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ilanpay_buyer FOREIGN KEY (buyer_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
