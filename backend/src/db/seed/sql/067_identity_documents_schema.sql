-- Kimlik belgesi (on yuz). Gorsel herkese acik depoda DEGIL, PRIVATE_STORAGE_ROOT altinda durur;
-- yalniz sahibi ve admin yetkili endpoint uzerinden okuyabilir. Additive, tekrar calistirilabilir.
CREATE TABLE IF NOT EXISTS identity_documents (
  id            CHAR(36)     NOT NULL,
  user_id       CHAR(36)     NOT NULL,
  side          VARCHAR(16)  NOT NULL DEFAULT 'front',
  file_path     VARCHAR(255) NOT NULL,
  mime          VARCHAR(64)  NOT NULL,
  size          INT UNSIGNED NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reject_reason VARCHAR(255) NULL,
  reviewed_by   CHAR(36)     NULL,
  reviewed_at   DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_identity_user_side (user_id, side),
  KEY idx_identity_status (status),
  CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
