-- ============================================================================
-- 036_carrier_kyc_schema.sql
-- Taşıyıcı KYC (Kimlik Doğrulama) tabloları
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── users tablosuna KYC alanları ─────────────────────────────────────────────

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tc_identity VARCHAR(11) DEFAULT NULL AFTER phone,
  ADD COLUMN IF NOT EXISTS tax_number VARCHAR(20) DEFAULT NULL AFTER tc_identity,
  ADD COLUMN IF NOT EXISTS tax_office VARCHAR(100) DEFAULT NULL AFTER tax_number,
  ADD COLUMN IF NOT EXISTS legal_company_title VARCHAR(255) DEFAULT NULL AFTER tax_office,
  ADD COLUMN IF NOT EXISTS kyc_status ENUM('not_submitted','pending','approved','rejected') NOT NULL DEFAULT 'not_submitted' AFTER legal_company_title,
  ADD COLUMN IF NOT EXISTS kyc_submitted_at DATETIME(3) DEFAULT NULL AFTER kyc_status,
  ADD COLUMN IF NOT EXISTS kyc_approved_at DATETIME(3) DEFAULT NULL AFTER kyc_submitted_at,
  ADD COLUMN IF NOT EXISTS iyzico_sub_merchant_key VARCHAR(100) DEFAULT NULL AFTER kyc_approved_at,
  ADD COLUMN IF NOT EXISTS iyzico_sub_merchant_type VARCHAR(30) DEFAULT NULL AFTER iyzico_sub_merchant_key;

-- ── carrier_kyc_documents tablosu ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS carrier_kyc_documents (
  id CHAR(36) NOT NULL PRIMARY KEY,
  carrier_id CHAR(36) NOT NULL,
  document_type ENUM('identity_front','identity_back','tax_certificate','address_proof','iban_document') NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_note TEXT DEFAULT NULL,
  reviewed_by CHAR(36) DEFAULT NULL,
  reviewed_at DATETIME(3) DEFAULT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_carrier_doc_type (carrier_id, document_type),
  KEY idx_carrier_kyc_carrier (carrier_id),
  KEY idx_carrier_kyc_status (status),
  CONSTRAINT fk_carrier_kyc_user FOREIGN KEY (carrier_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_carrier_kyc_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
