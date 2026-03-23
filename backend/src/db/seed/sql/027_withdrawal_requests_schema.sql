-- 027_withdrawal_requests_schema.sql
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id              CHAR(36) NOT NULL PRIMARY KEY,
  user_id         CHAR(36) NOT NULL,
  bank_account_id CHAR(36) NOT NULL,
  amount          DECIMAL(14,2) NOT NULL,
  currency        VARCHAR(10) NOT NULL DEFAULT 'TRY',
  status          ENUM('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending',
  admin_notes     TEXT NULL,
  requested_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  processed_at    DATETIME(3) NULL,
  CONSTRAINT fk_wr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wr_bank_account FOREIGN KEY (bank_account_id) REFERENCES carrier_bank_accounts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX wr_user_id_idx (user_id),
  INDEX wr_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
