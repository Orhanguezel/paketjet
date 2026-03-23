-- ============================================================================
-- 12_carrier_seed.sql
-- Taşıyıcı (carrier rolü) test hesabı
-- Placeholder'lar seed runner tarafından enjekte edilir:
--   {{CARRIER_ID}}, {{CARRIER_EMAIL}}, {{CARRIER_PASSWORD_HASH}}
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1) Kullanıcı kaydı
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  wallet_balance, is_active, email_verified, created_at, updated_at
) VALUES (
  '{{CARRIER_ID}}',
  '{{CARRIER_EMAIL}}',
  '{{CARRIER_PASSWORD_HASH}}',
  'Test Taşıyıcı',
  '+905559998877',
  0.00, 1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  email          = VALUES(email),
  full_name      = VALUES(full_name),
  phone          = VALUES(phone),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- 2) Profil kaydı
INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES (
  '{{CARRIER_ID}}',
  'Test Taşıyıcı',
  '+905559998877',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  full_name  = VALUES(full_name),
  phone      = VALUES(phone),
  updated_at = CURRENT_TIMESTAMP(3);

-- 3) Kullanıcı rolü — 'carrier' (sadece yoksa ekle)
INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT
  UUID(),
  u.id,
  'carrier',
  CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = '{{CARRIER_EMAIL}}'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role = 'carrier'
  );
