-- Remove legacy KYC, carrier-bank, withdrawal and iyzico sub-merchant schema.
DROP TABLE IF EXISTS withdrawal_requests;
DROP TABLE IF EXISTS carrier_bank_accounts;
DROP TABLE IF EXISTS carrier_kyc_documents;

SET @col_check = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'tc_identity'
);

SET @q = IF(@col_check > 0,
  'ALTER TABLE users
    DROP COLUMN tc_identity,
    DROP COLUMN tax_number,
    DROP COLUMN tax_office,
    DROP COLUMN legal_company_title,
    DROP COLUMN kyc_status,
    DROP COLUMN kyc_submitted_at,
    DROP COLUMN kyc_approved_at,
    DROP COLUMN iyzico_sub_merchant_key,
    DROP COLUMN iyzico_sub_merchant_type',
  'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
