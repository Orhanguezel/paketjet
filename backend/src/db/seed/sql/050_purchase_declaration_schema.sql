-- =============================================================
-- FILE: src/db/seed/sql/050_purchase_declaration_schema.sql
-- DESCRIPTION: Satın alma anında ürün değeri + içerik beyanı snapshot'ları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchases' AND COLUMN_NAME = 'estimated_value_currency'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchases ADD COLUMN estimated_value_currency VARCHAR(10) NOT NULL DEFAULT ''TRY'' AFTER estimated_value_snapshot',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchases' AND COLUMN_NAME = 'content_declared'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchases ADD COLUMN content_declared TINYINT(1) NOT NULL DEFAULT 0 AFTER estimated_value_currency',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchases' AND COLUMN_NAME = 'content_declared_at'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchases ADD COLUMN content_declared_at DATETIME(3) DEFAULT NULL AFTER content_declared',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchases' AND COLUMN_NAME = 'content_declared_ip'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchases ADD COLUMN content_declared_ip VARCHAR(64) DEFAULT NULL AFTER content_declared_at',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchase_payments' AND COLUMN_NAME = 'estimated_value_snapshot'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchase_payments ADD COLUMN estimated_value_snapshot DECIMAL(12,2) DEFAULT NULL AFTER payment_ref',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchase_payments' AND COLUMN_NAME = 'estimated_value_currency'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchase_payments ADD COLUMN estimated_value_currency VARCHAR(10) NOT NULL DEFAULT ''TRY'' AFTER estimated_value_snapshot',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchase_payments' AND COLUMN_NAME = 'content_declared'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchase_payments ADD COLUMN content_declared TINYINT(1) NOT NULL DEFAULT 0 AFTER estimated_value_currency',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchase_payments' AND COLUMN_NAME = 'content_declared_at'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchase_payments ADD COLUMN content_declared_at DATETIME(3) DEFAULT NULL AFTER content_declared',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ilan_purchase_payments' AND COLUMN_NAME = 'content_declared_ip'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE ilan_purchase_payments ADD COLUMN content_declared_ip VARCHAR(64) DEFAULT NULL AFTER content_declared_at',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
