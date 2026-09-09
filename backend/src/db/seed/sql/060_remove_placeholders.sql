-- Remove only known seed placeholders; preserve any real edited contact data.
UPDATE site_settings SET value='""' WHERE `key` IN ('contact_phone_display','contact_phone_tel','contact_whatsapp_link') AND JSON_UNQUOTE(value) IN ('0312 000 00 00','03120000000','https://wa.me/903120000000');
