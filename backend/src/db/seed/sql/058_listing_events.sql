CREATE TABLE IF NOT EXISTS listing_events (
 id CHAR(36) PRIMARY KEY, ilan_id CHAR(36) NOT NULL, actor_id VARCHAR(64) NOT NULL,
 previous_status VARCHAR(32) NULL, status VARCHAR(32) NOT NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), INDEX listing_event_id(ilan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
