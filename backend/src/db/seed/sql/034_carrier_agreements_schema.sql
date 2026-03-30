-- 034: carrier_agreements schema + seed
-- Tasiyicilarin platform ile anlasma tipi: commission veya subscription

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS carrier_agreements (
  id               CHAR(36)     NOT NULL PRIMARY KEY,
  user_id          CHAR(36)     NOT NULL,
  agreement_type   VARCHAR(30)  NOT NULL DEFAULT 'commission',
  -- 'commission' | 'subscription'

  commission_rate  DECIMAL(5,2) DEFAULT NULL,
  -- Tasiyiciya ozel oran; NULL ise plan veya platform default kullanilir

  plan_id          CHAR(36)     DEFAULT NULL,
  -- subscription tipinde hangi plan

  status           VARCHAR(30)  NOT NULL DEFAULT 'active',
  -- active | suspended | expired

  starts_at        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at       DATETIME(3)  DEFAULT NULL,

  admin_note       TEXT         DEFAULT NULL,

  created_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  UNIQUE KEY uq_carrier_agreement_user (user_id),
  INDEX idx_ca_status (status),
  INDEX idx_ca_type (agreement_type),
  CONSTRAINT fk_ca_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ca_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────
-- Seed: Her tasiyiciya varsayilan commission anlasmasi
-- Platform default komisyon orani (site_settings) kullanilir
-- ───────────────────────────────────────────────────────
INSERT IGNORE INTO carrier_agreements (id, user_id, agreement_type, commission_rate, plan_id, status, starts_at)
VALUES
  (UUID(), '{{CARRIER_ID}}',                      'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000002', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000003', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000004', 'commission', 8.00, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000005', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000006', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000007', 'commission', 12.00, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000008', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000009', 'commission', NULL, NULL, 'active', NOW()),
  (UUID(), 'c0000000-0000-4000-8000-000000000010', 'commission', NULL, NULL, 'active', NOW());
