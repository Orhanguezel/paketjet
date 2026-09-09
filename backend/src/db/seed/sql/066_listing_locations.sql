-- Preserve existing routes; precise locations are optional.
SET @pj_loc_count=(SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='ilanlar' AND column_name='from_location');
SET @pj_loc_ddl=IF(@pj_loc_count=0,'ALTER TABLE ilanlar ADD COLUMN from_location JSON NULL','SELECT 1');
PREPARE pj_loc_stmt FROM @pj_loc_ddl; EXECUTE pj_loc_stmt; DEALLOCATE PREPARE pj_loc_stmt;
SET @pj_loc_count=(SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='ilanlar' AND column_name='to_location');
SET @pj_loc_ddl=IF(@pj_loc_count=0,'ALTER TABLE ilanlar ADD COLUMN to_location JSON NULL','SELECT 1');
PREPARE pj_loc_stmt FROM @pj_loc_ddl; EXECUTE pj_loc_stmt; DEALLOCATE PREPARE pj_loc_stmt;
