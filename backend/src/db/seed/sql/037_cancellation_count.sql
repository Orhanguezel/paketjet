-- ============================================================================
-- 037_cancellation_count.sql
-- Kullanıcı iptal sayacı
-- ============================================================================

SET @col_check = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'cancellation_count');
SET @q = IF(@col_check = 0, 'ALTER TABLE users ADD COLUMN cancellation_count INT UNSIGNED NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
