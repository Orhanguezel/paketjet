SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`)
VALUES
  (
    '00004200-0000-4000-8000-000000000001',
    'listing.content_declaration',
    'tr',
    '{"title":"İçerik Beyanı","message":"Paketimin içinde uyuşturucu, silah, yanıcı madde veya kaçak ürün bulunmadığını, tüm cezai sorumluluğun bana ait olduğunu kabul ediyorum.","acceptLabel":"Kabul Ediyorum","cancelLabel":"Vazgeç"}'
  )
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);
