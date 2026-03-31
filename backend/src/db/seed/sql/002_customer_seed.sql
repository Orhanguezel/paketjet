-- ============================================================================
-- 002_customer_seed.sql
-- 10 müşteri (customer rolü) test hesabı
-- İlk müşteri placeholder'lardan gelir, diğerleri sabit UUID ile eklenir.
-- Tüm müşteriler aynı şifreyi kullanır: {{CUSTOMER_PASSWORD_HASH}}
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────
-- 1) Emre Yılmaz (env placeholder — ana test müşteri)
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('{{CUSTOMER_ID}}', '{{CUSTOMER_EMAIL}}', '{{CUSTOMER_PASSWORD_HASH}}', 'Emre Yılmaz', '+905351234567', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('{{CUSTOMER_ID}}', 'Emre Yılmaz', '+905351234567', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 2) Zeynep Aksoy
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000002', 'zeynep.aksoy@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Zeynep Aksoy', '+905411223344', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000002', 'Zeynep Aksoy', '+905411223344', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 3) Ayşe Tuncer
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000003', 'ayse.tuncer@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Ayşe Tuncer', '+905422334455', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000003', 'Ayşe Tuncer', '+905422334455', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 4) Deniz Karaca
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000004', 'deniz.karaca@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Deniz Karaca', '+905433445566', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000004', 'Deniz Karaca', '+905433445566', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 5) Selin Öztürk
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000005', 'selin.ozturk@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Selin Öztürk', '+905444556677', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000005', 'Selin Öztürk', '+905444556677', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 6) Kerem Yalçın
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000006', 'kerem.yalcin@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Kerem Yalçın', '+905455667788', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000006', 'Kerem Yalçın', '+905455667788', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 7) Elif Doğan
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000007', 'elif.dogan@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Elif Doğan', '+905466778899', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000007', 'Elif Doğan', '+905466778899', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 8) Can Aktaş
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000008', 'can.aktas@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Can Aktaş', '+905477889900', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000008', 'Can Aktaş', '+905477889900', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 9) Melis Erdoğan
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000009', 'melis.erdogan@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Melis Erdoğan', '+905488990011', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000009', 'Melis Erdoğan', '+905488990011', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- 10) Barış Tekin
-- ───────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, phone, wallet_balance, is_active, email_verified, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000010', 'baris.tekin@test.com', '{{CUSTOMER_PASSWORD_HASH}}', 'Barış Tekin', '+905499001122', 0.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), is_active=1, email_verified=1, updated_at=CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('d0000000-0000-4000-8000-000000000010', 'Barış Tekin', '+905499001122', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), updated_at=CURRENT_TIMESTAMP(3);

-- ───────────────────────────────────────────────────────
-- Tüm müşterilere 'customer' rolü ata
-- ───────────────────────────────────────────────────────
INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT UUID(), u.id, 'customer', CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email IN (
  '{{CUSTOMER_EMAIL}}',
  'zeynep.aksoy@test.com',
  'ayse.tuncer@test.com',
  'deniz.karaca@test.com',
  'selin.ozturk@test.com',
  'kerem.yalcin@test.com',
  'elif.dogan@test.com',
  'can.aktas@test.com',
  'melis.erdogan@test.com',
  'baris.tekin@test.com'
)
AND NOT EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = 'customer'
);
