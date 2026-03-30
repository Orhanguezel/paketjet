-- =============================================================
-- 014_ilanlar_seed.sql
-- PaketJet — 10 taşıyıcıya dağıtılmış örnek ilanlar + wallet
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Wallet kayıtları (yoksa oluştur)
INSERT IGNORE INTO wallets (id, user_id, balance, total_earnings, currency) VALUES
  (UUID(), '{{CARRIER_ID}}',                      500.00, 1200.00, 'TRY'),
  (UUID(), '{{CUSTOMER_ID}}',                     250.00,    0.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000002', 350.00,  800.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000003', 120.00,  450.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000004', 600.00, 2100.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000005', 200.00,  300.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000006',  80.00,  150.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000007', 450.00, 1600.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000008', 300.00,  900.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000009', 175.00,  500.00, 'TRY'),
  (UUID(), 'c0000000-0000-4000-8000-000000000010', 400.00, 1100.00, 'TRY');

-- İlanlar — her taşıyıcıya 1-2 ilan, toplam 15 ilan
REPLACE INTO ilanlar
  (id, user_id, from_city, to_city, from_district, to_district,
   departure_date, arrival_date,
   total_capacity_kg, available_capacity_kg, price_per_kg,
   currency, is_negotiable, vehicle_type,
   title, description, contact_phone, status)
VALUES
  -- Hasan Demir ({{CARRIER_ID}})
  ('11111111-1111-4111-8111-111111111111', '{{CARRIER_ID}}',
   'İstanbul', 'Ankara', 'Kadıköy', 'Çankaya',
   DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 6 HOUR,
   50.00, 50.00, 6.50, 'TRY', 0, 'van',
   'İstanbul → Ankara Minivan',
   'Küçük koliler ve paketleri taşıyorum. Kırılgan eşyalar kabul edilmez.',
   '+905429998877', 'active'),

  ('11111111-1111-4111-8111-111111111112', '{{CARRIER_ID}}',
   'Ankara', 'İstanbul', 'Çankaya', 'Beşiktaş',
   DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 7 HOUR,
   50.00, 35.00, 7.00, 'TRY', 0, 'van',
   'Ankara → İstanbul Dönüş Seferi',
   'Ankara dönüşünde boş kapasite var. Her türlü paket alınır.',
   '+905429998877', 'active'),

  -- Mehmet Yıldırım
  ('22222222-2222-4222-8222-222222222222', 'c0000000-0000-4000-8000-000000000002',
   'İzmir', 'Ankara', NULL, NULL,
   DATE_ADD(NOW(), INTERVAL 5 DAY), NULL,
   200.00, 200.00, 3.00, 'TRY', 1, 'truck',
   'İzmir → Ankara Kamyon',
   'Büyük yükler de dahil her türlü taşıma yapılır. Fiyat için görüşürüz.',
   '+905321112233', 'active'),

  -- Ali Kaya
  ('33333333-3333-4333-8333-333333333333', 'c0000000-0000-4000-8000-000000000003',
   'Bursa', 'İstanbul', 'Osmangazi', 'Bağcılar',
   DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 3 HOUR,
   15.00, 15.00, 10.00, 'TRY', 0, 'car',
   'Bursa → İstanbul Otomobil',
   'El bagajı büyüklüğünde paket taşıyabilirim.',
   '+905334445566', 'active'),

  -- Mustafa Çelik
  ('44444444-4444-4444-8444-444444444444', 'c0000000-0000-4000-8000-000000000004',
   'Antalya', 'İstanbul', NULL, NULL,
   DATE_ADD(NOW(), INTERVAL 7 DAY), NULL,
   80.00, 80.00, 4.50, 'TRY', 1, 'van',
   'Antalya → İstanbul Minivan',
   'Düzenli sefer. Haftalık çalışıyorum.',
   '+905345556677', 'active'),

  ('44444444-4444-4444-8444-444444444445', 'c0000000-0000-4000-8000-000000000004',
   'İstanbul', 'Antalya', 'Esenyurt', NULL,
   DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY) + INTERVAL 8 HOUR,
   80.00, 60.00, 4.00, 'TRY', 1, 'van',
   'İstanbul → Antalya Haftalık Sefer',
   'Her hafta düzenli sefer. Koli ve bavul taşınır.',
   '+905345556677', 'active'),

  -- Ömer Şahin
  ('55555555-5555-4555-8555-555555555501', 'c0000000-0000-4000-8000-000000000005',
   'Trabzon', 'İstanbul', NULL, 'Kartal',
   DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR,
   40.00, 40.00, 8.00, 'TRY', 0, 'van',
   'Trabzon → İstanbul Karadeniz Seferi',
   'Karadeniz bölgesinden İstanbul''a taşıma. Fındık, çay kolileri öncelikli.',
   '+905356667788', 'active'),

  -- Fatih Arslan
  ('66666666-6666-4666-8666-666666666601', 'c0000000-0000-4000-8000-000000000006',
   'Gaziantep', 'İstanbul', NULL, NULL,
   DATE_ADD(NOW(), INTERVAL 6 DAY), DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 14 HOUR,
   120.00, 120.00, 3.50, 'TRY', 1, 'truck',
   'Gaziantep → İstanbul Kamyon',
   'Güneydoğu''dan İstanbul''a büyük yük taşıma. Mobilya kabul edilir.',
   '+905367778899', 'active'),

  -- Burak Özdemir
  ('77777777-7777-4777-8777-777777777701', 'c0000000-0000-4000-8000-000000000007',
   'İstanbul', 'İzmir', 'Ümraniye', 'Bornova',
   DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 6 HOUR,
   30.00, 30.00, 7.50, 'TRY', 0, 'car',
   'İstanbul → İzmir Otomobil',
   'Hafta sonu İzmir''e gidiyorum, küçük paketler alabilirim.',
   '+905378889900', 'active'),

  ('77777777-7777-4777-8777-777777777702', 'c0000000-0000-4000-8000-000000000007',
   'İzmir', 'İstanbul', 'Bornova', 'Ümraniye',
   DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 6 HOUR,
   30.00, 25.00, 7.50, 'TRY', 0, 'car',
   'İzmir → İstanbul Dönüş',
   'Pazar günü İstanbul''a dönüyorum. Boş kapasite mevcut.',
   '+905378889900', 'active'),

  -- İbrahim Aydın
  ('88888888-8888-4888-8888-888888888801', 'c0000000-0000-4000-8000-000000000008',
   'Konya', 'Ankara', NULL, 'Keçiören',
   DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 4 HOUR,
   60.00, 60.00, 5.00, 'TRY', 0, 'van',
   'Konya → Ankara Minivan',
   'Haftada 2 sefer yapıyorum. Güvenilir taşıma.',
   '+905389990011', 'active'),

  -- Serkan Koç
  ('99999999-9999-4999-8999-999999999901', 'c0000000-0000-4000-8000-000000000009',
   'Eskişehir', 'İstanbul', NULL, 'Kadıköy',
   DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 5 HOUR,
   25.00, 25.00, 9.00, 'TRY', 0, 'car',
   'Eskişehir → İstanbul Otomobil',
   'Üniversite dönüşü, küçük paketler taşıyabilirim.',
   '+905390001122', 'active'),

  ('99999999-9999-4999-8999-999999999902', 'c0000000-0000-4000-8000-000000000009',
   'İstanbul', 'Eskişehir', 'Kadıköy', NULL,
   DATE_ADD(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY) + INTERVAL 5 HOUR,
   25.00, 20.00, 8.50, 'TRY', 1, 'car',
   'İstanbul → Eskişehir Dönüş',
   'Hafta sonu Eskişehir''e dönüyorum. Koli taşırım.',
   '+905390001122', 'active'),

  -- Emre Güneş
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaa001', 'c0000000-0000-4000-8000-000000000010',
   'Samsun', 'Ankara', NULL, NULL,
   DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 6 HOUR,
   100.00, 100.00, 4.00, 'TRY', 1, 'truck',
   'Samsun → Ankara Kamyon',
   'Karadeniz''den başkente düzenli sefer. Her boy yük kabul edilir.',
   '+905301112233', 'active');

-- Boş slug'ları otomatik doldur: sehir-sehir-aractip-rastgele
UPDATE ilanlar SET slug = CONCAT(
  LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(from_city, 'İ','i'),'ı','i'),'ğ','g'),'ü','u'),'ş','s'),'ö','o'),'ç','c'),'Ğ','g'),'Ü','u'),'Ş','s'),'Ö','o'),'Ç','c')),
  '-',
  LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(to_city, 'İ','i'),'ı','i'),'ğ','g'),'ü','u'),'ş','s'),'ö','o'),'ç','c'),'Ğ','g'),'Ü','u'),'Ş','s'),'Ö','o'),'Ç','c')),
  '-', vehicle_type,
  '-', SUBSTRING(id, 1, 4)
) WHERE slug = '' OR slug IS NULL;
