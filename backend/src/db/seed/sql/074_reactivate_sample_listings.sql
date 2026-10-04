-- Keep prelaunch examples available for the explicitly requested test purchase flow.
-- Completed examples remain sold; only active or date-expired examples are refreshed.
UPDATE ilanlar
SET departure_date = DATE_ADD(UTC_TIMESTAMP(3), INTERVAL (14 + MOD(CRC32(id), 30)) DAY),
    arrival_date = DATE_ADD(UTC_TIMESTAMP(3), INTERVAL (15 + MOD(CRC32(id), 30)) DAY),
    status = 'active'
WHERE is_sample = 1 AND status IN ('active', 'expired');
