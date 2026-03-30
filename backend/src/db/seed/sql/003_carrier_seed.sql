-- ============================================================================
-- 003_carrier_seed.sql
-- 10 taşıyıcı (carrier rolü) test hesabı
-- İlk taşıyıcı placeholder'lardan gelir, diğerleri sabit UUID ile eklenir.
-- Tüm taşıyıcılar aynı şifreyi kullanır: {{CARRIER_PASSWORD_HASH}}
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────
-- 1) Hasan Demir (env placeholder — ana test taşıyıcı)
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('{{CARRIER_ID}}', '{{CARRIER_EMAIL}}', '{{CARRIER_PASSWORD_HASH}}', 'Hasan Demir', '+905429998877', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('{{CARRIER_ID}}', 'Hasan Demir', '+905429998877', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 2) Mehmet Yıldırım
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000002', 'mehmet.yildirim@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Mehmet Yıldırım', '+905321112233', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000002', 'Mehmet Yıldırım', '+905321112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 3) Ali Kaya
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000003', 'ali.kaya@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Ali Kaya', '+905334445566', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000003', 'Ali Kaya', '+905334445566', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 4) Mustafa Çelik
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000004', 'mustafa.celik@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Mustafa Çelik', '+905345556677', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000004', 'Mustafa Çelik', '+905345556677', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 5) Ömer Şahin
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000005', 'omer.sahin@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Ömer Şahin', '+905356667788', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000005', 'Ömer Şahin', '+905356667788', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 6) Fatih Arslan
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000006', 'fatih.arslan@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Fatih Arslan', '+905367778899', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000006', 'Fatih Arslan', '+905367778899', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 7) Burak Özdemir
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000007', 'burak.ozdemir@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Burak Özdemir', '+905378889900', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000007', 'Burak Özdemir', '+905378889900', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 8) İbrahim Aydın
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000008', 'ibrahim.aydin@test.com', '{{CARRIER_PASSWORD_HASH}}', 'İbrahim Aydın', '+905389990011', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000008', 'İbrahim Aydın', '+905389990011', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 9) Serkan Koç
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000009', 'serkan.koc@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Serkan Koç', '+905390001122', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000009', 'Serkan Koç', '+905390001122', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 10) Emre Güneş
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000010', 'emre.gunes@test.com', '{{CARRIER_PASSWORD_HASH}}', 'Emre Güneş', '+905301112233', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('c0000000-0000-4000-8000-000000000010', 'Emre Güneş', '+905301112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- Tüm taşıyıcılara 'carrier' rolü ata
-- ───────────────────────────────────────────────────────
INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT UUID(), u.id, 'carrier', CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email IN (
  '{{CARRIER_EMAIL}}',
  'mehmet.yildirim@test.com',
  'ali.kaya@test.com',
  'mustafa.celik@test.com',
  'omer.sahin@test.com',
  'fatih.arslan@test.com',
  'burak.ozdemir@test.com',
  'ibrahim.aydin@test.com',
  'serkan.koc@test.com',
  'emre.gunes@test.com'
)
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = 'carrier'
);
