SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
VALUES
  ('00003900-0000-4000-8000-000000000001', 'pricing.listing_credit_price', 'tr', '50'),
  ('00003900-0000-4000-8000-000000000002', 'pricing.credit_packages', 'tr', '[{"key":"starter","credits":1,"price":50},{"key":"growth","credits":5,"price":225},{"key":"pro","credits":10,"price":400}]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);
