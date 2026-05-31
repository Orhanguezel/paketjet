-- =============================================================
-- FILE: src/db/seed/sql/045_auth_consent_versions.sql
-- Store accepted legal text versions on user signup.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @col_check = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'rules_accepted_version'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE users ADD COLUMN rules_accepted_version VARCHAR(120) DEFAULT NULL AFTER rules_accepted_at',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_check = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'kvkk_consent_version'
);
SET @q = IF(@col_check = 0,
  'ALTER TABLE users ADD COLUMN kvkk_consent_version VARCHAR(120) DEFAULT NULL AFTER kvkk_consent_at',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
