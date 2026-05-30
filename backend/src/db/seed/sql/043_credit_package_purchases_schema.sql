-- =============================================================
-- FILE: src/db/seed/sql/043_credit_package_purchases_schema.sql
-- DESCRIPTION: İlan Alma Hakkı paket ödeme kayıtları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS credit_package_purchases (
  id            CHAR(36)      NOT NULL,
  user_id       CHAR(36)      NOT NULL,
  package_key   VARCHAR(80)   NOT NULL,
  credits       INT           NOT NULL,
  price         DECIMAL(12,2) NOT NULL,
  provider      VARCHAR(20)   NOT NULL,
  payment_ref   VARCHAR(255)  NOT NULL,
  status        VARCHAR(20)   NOT NULL DEFAULT 'pending',
  created_at    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY uniq_credit_package_payment_ref (payment_ref),
  KEY credit_package_purchases_user_idx (user_id),
  CONSTRAINT fk_credit_pkg_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
