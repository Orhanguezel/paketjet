-- Disable legacy booking commission for the lead/contact-rights model.
UPDATE site_settings
SET value = '{"rate":0,"type":"percentage"}',
    updated_at = NOW()
WHERE `key` = 'platform_commission';
