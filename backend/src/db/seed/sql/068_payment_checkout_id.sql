-- Odeme saglayicisindaki odeme sayfasi kimligi (Shopier: odeme basina olusturulan tek kullanimlik urun id).
-- Additive, tekrar calistirilabilir; mevcut veriye dokunmaz.
SET @pj_chk_col=(SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='payment_sessions' AND column_name='provider_checkout_id');
SET @pj_chk_ddl=IF(@pj_chk_col=0,'ALTER TABLE payment_sessions ADD COLUMN provider_checkout_id VARCHAR(64) NULL AFTER token_hash','SELECT 1');
PREPARE pj_chk_stmt FROM @pj_chk_ddl; EXECUTE pj_chk_stmt; DEALLOCATE PREPARE pj_chk_stmt;
SET @pj_chk_idx=(SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name='payment_sessions' AND index_name='payment_session_checkout');
SET @pj_chk_ddl=IF(@pj_chk_idx=0,'CREATE UNIQUE INDEX payment_session_checkout ON payment_sessions (provider, provider_checkout_id)','SELECT 1');
PREPARE pj_chk_stmt FROM @pj_chk_ddl; EXECUTE pj_chk_stmt; DEALLOCATE PREPARE pj_chk_stmt;
