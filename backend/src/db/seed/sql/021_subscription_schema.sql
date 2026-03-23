-- 113_subscription_schema.sql — Plans + User Subscriptions

CREATE TABLE IF NOT EXISTS plans (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  price       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ilan_limit  INT NOT NULL DEFAULT 1,
  duration_days INT NOT NULL DEFAULT 30,
  features    JSON DEFAULT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   TINYINT NOT NULL DEFAULT 1,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_plans_slug (slug),
  INDEX idx_plans_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  user_id     CHAR(36) NOT NULL,
  plan_id     CHAR(36) NOT NULL,
  starts_at   DATETIME(3) NOT NULL,
  expires_at  DATETIME(3) NOT NULL,
  status      VARCHAR(30) NOT NULL DEFAULT 'active',
  payment_ref VARCHAR(100) DEFAULT NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_user_subs_user_id (user_id),
  INDEX idx_user_subs_status (status),
  INDEX idx_user_subs_expires (expires_at),
  CONSTRAINT fk_user_subs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_subs_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayilan planlar
INSERT IGNORE INTO plans (id, name, slug, price, ilan_limit, duration_days, features, sort_order, is_active) VALUES
  (UUID(), 'Ucretsiz',  'free',     0.00,   1,  30, '["Ayda 1 ilan","Temel ozellikler"]',                              0, 1),
  (UUID(), 'Starter',   'starter',  49.00,  5,  30, '["Ayda 5 ilan","Temel ozellikler","E-posta destek"]',              1, 1),
  (UUID(), 'Pro',       'pro',      149.00, 20, 30, '["Ayda 20 ilan","One cikarma","Oncelikli siralama"]',              2, 1),
  (UUID(), 'Business',  'business', 349.00, 0,  30, '["Sinirsiz ilan","Premium badge","Oncelikli destek","API erisim"]', 3, 1);
