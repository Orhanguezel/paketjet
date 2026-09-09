-- Additive, re-runnable session revocation version. No accounts or passwords are changed.
SET @pj_auth_column = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='auth_version');
SET @pj_auth_ddl = IF(@pj_auth_column=0, 'ALTER TABLE users ADD COLUMN auth_version INT NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE pj_auth_stmt FROM @pj_auth_ddl;
EXECUTE pj_auth_stmt;
DEALLOCATE PREPARE pj_auth_stmt;
