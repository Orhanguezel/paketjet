SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `support_faqs` (`id`, `category`, `display_order`, `is_published`)
VALUES
  ('66666666-6666-4666-8666-666666666661', 'genel', 1, 1),
  ('66666666-6666-4666-8666-666666666662', 'kargo', 2, 1),
  ('66666666-6666-4666-8666-666666666663', 'genel', 3, 1),
  ('66666666-6666-4666-8666-666666666664', 'odeme', 4, 1),
  ('66666666-6666-4666-8666-666666666665', 'kargo', 5, 1),
  ('66666666-6666-4666-8666-666666666666', 'hesap', 6, 1)
ON DUPLICATE KEY UPDATE
  `category` = VALUES(`category`),
  `display_order` = VALUES(`display_order`),
  `is_published` = VALUES(`is_published`);

INSERT INTO `support_faqs_i18n` (`faq_id`, `locale`, `question`, `answer`)
VALUES
  ('66666666-6666-4666-8666-666666666661', 'tr', 'PaketJet nedir?', 'PaketJet, taşıyıcılarla göndericileri buluşturan P2P kargo pazaryeridir.'),
  ('66666666-6666-4666-8666-666666666662', 'tr', 'Nasıl kargo gönderebilirim?', 'İlanlar arasından uygun taşıyıcıyı seçip rezervasyon oluşturarak gönderim yapabilirsiniz.'),
  ('66666666-6666-4666-8666-666666666663', 'tr', 'Taşıyıcı nasıl olurum?', 'Taşıyıcı hesabı açtıktan sonra güzergah ve kapasite bilgileriyle ilan verebilirsiniz.'),
  ('66666666-6666-4666-8666-666666666664', 'tr', 'Ödeme nasıl yapılır?', 'Ödemeler platform üzerinden güvenli şekilde alınır ve teslimat akışına göre yönetilir.'),
  ('66666666-6666-4666-8666-666666666665', 'tr', 'Kargo takibi nasıl yapılır?', 'Rezervasyon ve panel ekranlarından taşıma durumu adım adım izlenebilir.'),
  ('66666666-6666-4666-8666-666666666666', 'tr', 'Hesabımı nasıl silerim?', 'Destek ekibiyle iletişime geçerek hesap kapatma talebinizi iletebilirsiniz.')
ON DUPLICATE KEY UPDATE
  `question` = VALUES(`question`),
  `answer` = VALUES(`answer`);
