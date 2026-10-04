-- Örnek ilanlar sitede ve panelde sıradan ilan gibi davranır; "örnek" yalnız ilan başlığının başında kalır.
-- Örnek bayrağı kalkar (site haritası, istatistik ve arayüz farkı kalmaz); URL, iletişim adı ve üye adı
-- "örnek" içermez. Tekrar çalıştırmak güvenlidir: koşullar yalnız henüz dönüştürülmemiş satırları seçer.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ornek-ilan-01-istanbul-ankara -> istanbul-ankara-01
UPDATE ilanlar
SET slug = CONCAT(SUBSTRING(slug, 15), '-', SUBSTRING(slug, 12, 2))
WHERE slug REGEXP '^ornek-ilan-[0-9]{2}-';

UPDATE ilanlar SET contact_name = 'Taşıyıcı' WHERE contact_name = 'Örnek taşıyıcı';

UPDATE users SET full_name = 'Taşıyıcı'
WHERE id = 'e09a0000-0000-4000-8000-000000000000' AND full_name = 'Örnek ilanlar';

UPDATE ilanlar SET is_sample = 0 WHERE is_sample = 1;
