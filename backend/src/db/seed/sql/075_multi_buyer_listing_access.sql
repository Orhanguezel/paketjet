-- A listing sells access to its contact details to each buyer independently.
-- Keep purchase history for refunded buyers, who may purchase again later.
ALTER TABLE ilan_purchases
  DROP INDEX uniq_ilan_purchase,
  ADD INDEX ilan_purchases_listing_buyer_idx (ilan_id, buyer_id);

-- Earlier purchases closed the listing. Reopen only listings with a future departure.
-- The purchase rows remain the source of truth for previous buyers.
UPDATE ilanlar AS i
SET i.status = 'active', i.sold_at = NULL, i.sold_to_user_id = NULL
WHERE i.status = 'sold'
  AND i.departure_date > UTC_TIMESTAMP(3)
  AND EXISTS (SELECT 1 FROM ilan_purchases AS p WHERE p.ilan_id = i.id);
