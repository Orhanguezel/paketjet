-- ============================================================================
-- 037_cancellation_count.sql
-- Kullanıcı iptal sayacı
-- ============================================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cancellation_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER iyzico_sub_merchant_type;
