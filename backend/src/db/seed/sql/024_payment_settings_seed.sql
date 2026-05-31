-- Platform commission + bank details settings
INSERT IGNORE INTO site_settings (id, `key`, locale, value, created_at, updated_at)
VALUES
  (UUID(), 'platform_commission', '*', '{"rate":0,"type":"percentage"}', NOW(), NOW()),
  (UUID(), 'bank_details', 'tr', '{"iban":"","account_name":"PaketJet Teknoloji","bank_name":"","description":"Havale/EFT ile odeme yapmak icin asagidaki hesaba transfer yapiniz."}', NOW(), NOW());
