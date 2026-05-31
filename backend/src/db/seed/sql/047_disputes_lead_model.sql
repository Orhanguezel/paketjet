-- =============================================================
-- FILE: src/db/seed/sql/047_disputes_lead_model.sql
-- DESCRIPTION: Lead/ilan ihtilaflarını beyan edilen ürün değeri tavanıyla saklar.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_disputes = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes'
);

SET @q = IF(@has_disputes = 1,
  'ALTER TABLE disputes MODIFY booking_id CHAR(36) DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'ilan_id'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN ilan_id CHAR(36) DEFAULT NULL AFTER booking_id',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'purchase_id'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN purchase_id CHAR(36) DEFAULT NULL AFTER ilan_id',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'opened_against'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN opened_against CHAR(36) DEFAULT NULL AFTER opened_by',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'issue_type'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN issue_type VARCHAR(40) NOT NULL DEFAULT ''other'' AFTER opened_against',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'declared_value'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN declared_value DECIMAL(12,2) DEFAULT NULL AFTER issue_type',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND COLUMN_NAME = 'declared_value_currency'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE disputes ADD COLUMN declared_value_currency VARCHAR(10) NOT NULL DEFAULT ''TRY'' AFTER declared_value',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND INDEX_NAME = 'uq_dispute_purchase'
);
SET @q = IF(@idx_check = 0,
  'ALTER TABLE disputes ADD UNIQUE KEY uq_dispute_purchase (purchase_id)',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_check = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'disputes' AND INDEX_NAME = 'idx_dispute_ilan'
);
SET @q = IF(@idx_check = 0,
  'ALTER TABLE disputes ADD KEY idx_dispute_ilan (ilan_id)',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
