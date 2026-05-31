/* PaketJet mail sender/contact defaults */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'contact_email', '*', '"info@paketjet.net"'),
(UUID(), 'contact_to_email', '*', '"info@paketjet.net"'),
(UUID(), 'smtp_username', '*', '"info@paketjet.net"'),
(UUID(), 'smtp_from_email', '*', '"info@paketjet.net"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'contact_info', 'tr',
 '{
   "company_name": "PaketJet Teknoloji A.Ş.",
   "phone": "+90 312 000 00 00",
   "phone_2": "+90 532 000 00 00",
   "email": "info@paketjet.net",
   "email_2": "destek@paketjet.net",
   "address": "Çankaya, Ankara, Türkiye",
   "city": "Ankara",
   "country": "Türkiye",
   "working_hours": "Pazartesi - Cuma: 09:00 - 18:00",
   "maps_embed_url": "https://www.google.com/maps?q=Çankaya,Ankara,Turkey&output=embed",
   "maps_lat": "39.9208",
   "maps_lng": "32.8541"
 }')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
