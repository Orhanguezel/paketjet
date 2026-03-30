/* 95_integration_settings_seed.sql — PaketJet third-party API integration defaults */

-- Google OAuth
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.google.enabled',       'false', NOW(3), NOW(3)),
  (UUID(), 'integration.google.client_id',     '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.google.client_secret', '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.google.api_key',       '""',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- Google Maps (güzergah görselleştirme)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.google_maps.enabled', 'false', NOW(3), NOW(3)),
  (UUID(), 'integration.google_maps.api_key', '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.google_maps.map_id',  '""',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- Cloudinary (dosya yönetimi)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.cloudinary.enabled',    'false',     NOW(3), NOW(3)),
  (UUID(), 'integration.cloudinary.cloud_name', '""',        NOW(3), NOW(3)),
  (UUID(), 'integration.cloudinary.api_key',    '""',        NOW(3), NOW(3)),
  (UUID(), 'integration.cloudinary.api_secret', '""',        NOW(3), NOW(3)),
  (UUID(), 'integration.cloudinary.folder',     '"uploads"', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- Telegram (bildirim botu)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.telegram.enabled',          'false', NOW(3), NOW(3)),
  (UUID(), 'integration.telegram.bot_token',        '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.telegram.default_chat_id',  '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.telegram.webhook_secret',   '""',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- İyzico (ödeme sistemi)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.iyzico.enabled',    'false',                                NOW(3), NOW(3)),
  (UUID(), 'integration.iyzico.api_key',    '""',                                   NOW(3), NOW(3)),
  (UUID(), 'integration.iyzico.secret_key', '""',                                   NOW(3), NOW(3)),
  (UUID(), 'integration.iyzico.base_url',   '"https://sandbox-api.iyzipay.com"',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- PayTR (ödeme sistemi)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.paytr.enabled',       'false', NOW(3), NOW(3)),
  (UUID(), 'integration.paytr.merchant_id',   '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.paytr.merchant_key',  '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.paytr.merchant_salt', '""',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);

-- Facebook (sosyal giriş)
INSERT INTO `site_settings` (`id`,`key`,`value`,`created_at`,`updated_at`) VALUES
  (UUID(), 'integration.facebook.enabled',      'false', NOW(3), NOW(3)),
  (UUID(), 'integration.facebook.app_id',       '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.facebook.app_secret',   '""',    NOW(3), NOW(3)),
  (UUID(), 'integration.facebook.access_token', '""',    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = NOW(3);
