CREATE TABLE IF NOT EXISTS payment_sessions (
  payment_ref VARCHAR(255) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  ilan_id CHAR(36) NULL,
  kind VARCHAR(16) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  token_hash CHAR(64) NULL,
  provider_payment_id VARCHAR(255) NULL,
  receipt JSON NULL,
  state VARCHAR(24) NOT NULL DEFAULT 'initializing',
  error_code VARCHAR(100) NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX payment_session_listing (ilan_id),
  INDEX payment_session_user (user_id),
  UNIQUE KEY payment_session_token (token_hash),
  UNIQUE KEY payment_session_provider_receipt (provider, provider_payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Preserve historical financial records. Unverified pending payments become visible review tasks, not revenue.
INSERT IGNORE INTO payment_sessions (payment_ref,user_id,ilan_id,kind,provider,amount,state,error_code,expires_at,created_at)
SELECT payment_ref,buyer_id,ilan_id,'listing',provider,price,IF(status='completed','completed','review'),'legacy_unverified',created_at,created_at FROM ilan_purchase_payments;
INSERT IGNORE INTO payment_sessions (payment_ref,user_id,kind,provider,amount,state,error_code,expires_at,created_at)
SELECT payment_ref,user_id,'credits',provider,price,IF(status='completed','completed','review'),'legacy_unverified',created_at,created_at FROM credit_package_purchases;
