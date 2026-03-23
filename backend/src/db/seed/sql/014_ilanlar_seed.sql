-- =============================================================
-- FILE: src/db/seed/sql/106_ilanlar_seed.sql
-- DESCRIPTION: PaketJet — örnek ilan ve rezervasyon verileri
-- Bağımlılık: 10_auth_schema.sql, 104_ilanlar_schema.sql, 105_bookings_schema.sql
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Taşıyıcı (SELLER) ve müşteri (CUSTOMER) seed kullanıcılarının
-- wallet'larını oluştur (yoksa)
INSERT IGNORE INTO wallets (id, user_id, balance, total_earnings, currency)
VALUES
  (UUID(), '{{CARRIER_ID}}',   500.00, 0.00, 'TRY'),
  (UUID(), '{{CUSTOMER_ID}}', 250.00, 0.00, 'TRY');

-- Örnek ilanlar (SELLER kullanıcısından)
REPLACE INTO ilanlar
  (id, user_id, from_city, to_city, from_district, to_district,
   departure_date, arrival_date,
   total_capacity_kg, available_capacity_kg, price_per_kg,
   currency, is_negotiable, vehicle_type,
   title, description, contact_phone, status)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    '{{CARRIER_ID}}',
    'İstanbul', 'Ankara',
    'Kadıköy', 'Çankaya',
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 6 HOUR),
    50.00, 50.00, 6.50,
    'TRY', 0, 'van',
    'İstanbul → Ankara Minivan',
    'Küçük koliler ve paketleri taşıyorum. Kırılgan eşyalar kabul edilmez.',
    '05001234567', 'active'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '{{CARRIER_ID}}',
    'İzmir', 'Ankara',
    NULL, NULL,
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    NULL,
    200.00, 200.00, 3.00,
    'TRY', 1, 'truck',
    'İzmir → Ankara Kamyon',
    'Büyük yükler de dahil her türlü taşıma yapılır. Fiyat için görüşürüz.',
    '05009876543', 'active'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '{{CARRIER_ID}}',
    'Bursa', 'İstanbul',
    'Osmangazi', 'Bağcılar',
    DATE_ADD(NOW(), INTERVAL 1 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR),
    15.00, 15.00, 10.00,
    'TRY', 0, 'car',
    'Bursa → İstanbul Otomobil',
    'El bagajı büyüklüğünde paket taşıyabilirim.',
    '05001112233', 'active'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '{{CARRIER_ID}}',
    'Antalya', 'İstanbul',
    NULL, NULL,
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    NULL,
    80.00, 80.00, 4.50,
    'TRY', 1, 'van',
    'Antalya → İstanbul Minivan',
    'Düzenli sefer. Haftalık çalışıyorum.',
    '05004445566', 'active'
  );
