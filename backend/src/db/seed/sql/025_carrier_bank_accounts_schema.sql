-- 025: carrier_bank_accounts tablosu
CREATE TABLE IF NOT EXISTS carrier_bank_accounts (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  user_id       CHAR(36) NOT NULL,
  iban          VARCHAR(34) NOT NULL,
  account_holder VARCHAR(191) NOT NULL,
  bank_name     VARCHAR(100) NOT NULL,
  is_verified   TINYINT NOT NULL DEFAULT 0,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY carrier_bank_user_unique (user_id),
  CONSTRAINT fk_carrier_bank_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
