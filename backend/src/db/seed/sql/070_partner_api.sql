-- Partner API v1: kullanici API anahtarlari + ilanlarda partner referansi (external_ref).
-- Additive, tekrar calistirilabilir; mevcut veriye dokunmaz.
CREATE TABLE IF NOT EXISTS api_keys (
  id            CHAR(36)     NOT NULL,
  user_id       CHAR(36)     NOT NULL,
  name          VARCHAR(100) NOT NULL,
  prefix        VARCHAR(24)  NOT NULL,
  key_hash      CHAR(64)     NOT NULL,
  last_used_at  DATETIME(3)  NULL,
  last_used_ip  VARCHAR(64)  NULL,
  revoked_at    DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_api_keys_hash (key_hash),
  KEY idx_api_keys_user (user_id),
  CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @pj_ext_col=(SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='ilanlar' AND column_name='external_ref');
SET @pj_ext_ddl=IF(@pj_ext_col=0,'ALTER TABLE ilanlar ADD COLUMN external_ref VARCHAR(100) NULL','SELECT 1');
PREPARE pj_ext_stmt FROM @pj_ext_ddl; EXECUTE pj_ext_stmt; DEALLOCATE PREPARE pj_ext_stmt;
SET @pj_ext_idx=(SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name='ilanlar' AND index_name='uq_ilanlar_user_external_ref');
SET @pj_ext_ddl=IF(@pj_ext_idx=0,'CREATE UNIQUE INDEX uq_ilanlar_user_external_ref ON ilanlar (user_id, external_ref)','SELECT 1');
PREPARE pj_ext_stmt FROM @pj_ext_ddl; EXECUTE pj_ext_stmt; DEALLOCATE PREPARE pj_ext_stmt;
