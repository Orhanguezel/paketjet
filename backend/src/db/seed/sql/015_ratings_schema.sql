-- 107_ratings_schema.sql
-- Taşıyıcı değerlendirme tablosu

CREATE TABLE IF NOT EXISTS `ratings` (
  `id`          CHAR(36)     NOT NULL,
  `booking_id`  CHAR(36)     NOT NULL,
  `customer_id` CHAR(36)     NOT NULL,
  `carrier_id`  CHAR(36)     NOT NULL,
  `score`       TINYINT      NOT NULL COMMENT '1-5 arası puan',
  `comment`     TEXT         NULL,
  `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY  `ratings_booking_id_unique` (`booking_id`),
  KEY         `ratings_carrier_id_idx`   (`carrier_id`),
  KEY         `ratings_customer_id_idx`  (`customer_id`),

  CONSTRAINT `fk_ratings_booking`
    FOREIGN KEY (`booking_id`)  REFERENCES `bookings` (`id`)  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_customer`
    FOREIGN KEY (`customer_id`) REFERENCES `users`    (`id`)  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_carrier`
    FOREIGN KEY (`carrier_id`)  REFERENCES `users`    (`id`)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
