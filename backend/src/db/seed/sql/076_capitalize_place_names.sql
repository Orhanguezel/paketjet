-- Yer adlarinin ilk harfi buyuk (Turkce i/ı kurali). Yeni kayitlarda ilanlar/validation.ts
-- capitalizePlace bunu kelime bazinda yapar; bu dosya mevcut kayitlarin ilk harfini duzeltir.
-- Tekrar calistirmak guvenlidir: zaten buyuk harfle baslayan satira dokunmaz.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
UPDATE ilanlar
SET from_city = CONCAT((CASE LEFT(from_city,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(from_city,1)) END), SUBSTRING(from_city, 2))
WHERE from_city IS NOT NULL AND from_city <> ''
  AND LEFT(from_city,1) COLLATE utf8mb4_bin <> (CASE LEFT(from_city,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(from_city,1)) END) COLLATE utf8mb4_bin;
UPDATE ilanlar
SET to_city = CONCAT((CASE LEFT(to_city,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(to_city,1)) END), SUBSTRING(to_city, 2))
WHERE to_city IS NOT NULL AND to_city <> ''
  AND LEFT(to_city,1) COLLATE utf8mb4_bin <> (CASE LEFT(to_city,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(to_city,1)) END) COLLATE utf8mb4_bin;
UPDATE ilanlar
SET from_district = CONCAT((CASE LEFT(from_district,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(from_district,1)) END), SUBSTRING(from_district, 2))
WHERE from_district IS NOT NULL AND from_district <> ''
  AND LEFT(from_district,1) COLLATE utf8mb4_bin <> (CASE LEFT(from_district,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(from_district,1)) END) COLLATE utf8mb4_bin;
UPDATE ilanlar
SET to_district = CONCAT((CASE LEFT(to_district,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(to_district,1)) END), SUBSTRING(to_district, 2))
WHERE to_district IS NOT NULL AND to_district <> ''
  AND LEFT(to_district,1) COLLATE utf8mb4_bin <> (CASE LEFT(to_district,1) COLLATE utf8mb4_bin WHEN 'i' THEN 'İ' WHEN 'ı' THEN 'I' ELSE UPPER(LEFT(to_district,1)) END) COLLATE utf8mb4_bin;
