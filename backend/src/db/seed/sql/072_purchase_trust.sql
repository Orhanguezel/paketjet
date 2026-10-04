-- Additive purchase acceptance, verified member ratings, and one-credit remedies.
CREATE TABLE IF NOT EXISTS purchase_terms_acceptances (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  flow VARCHAR(32) NOT NULL,
  reference_id CHAR(36) NOT NULL,
  terms_version VARCHAR(80) NOT NULL,
  accepted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_terms_flow_reference (flow, reference_id),
  KEY idx_terms_user (user_id),
  CONSTRAINT fk_terms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS purchase_ratings (
  id CHAR(36) NOT NULL PRIMARY KEY,
  purchase_id CHAR(36) NOT NULL,
  reviewer_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  score TINYINT UNSIGNED NOT NULL,
  comment VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_purchase_reviewer (purchase_id, reviewer_id),
  KEY idx_purchase_rating_member (member_id, created_at),
  CONSTRAINT fk_purchase_rating_purchase FOREIGN KEY (purchase_id) REFERENCES ilan_purchases(id) ON DELETE RESTRICT,
  CONSTRAINT fk_purchase_rating_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_purchase_rating_member FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS purchase_credit_remedies (
  id CHAR(36) NOT NULL PRIMARY KEY,
  purchase_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  actor_id CHAR(36) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_credit_remedy_purchase (purchase_id),
  CONSTRAINT fk_credit_remedy_purchase FOREIGN KEY (purchase_id) REFERENCES ilan_purchases(id) ON DELETE RESTRICT,
  CONSTRAINT fk_credit_remedy_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_credit_remedy_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
