-- Additive: sample listings stay visible but cannot be purchased.
SET @pj_sample_column = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='ilanlar' AND column_name='is_sample');
SET @pj_sample_ddl = IF(@pj_sample_column=0, 'ALTER TABLE ilanlar ADD COLUMN is_sample TINYINT NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE pj_sample_stmt FROM @pj_sample_ddl;
EXECUTE pj_sample_stmt;
DEALLOCATE PREPARE pj_sample_stmt;
