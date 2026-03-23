-- Bookings: payment_ref + commission columns
ALTER TABLE bookings ADD COLUMN payment_ref VARCHAR(255) NULL AFTER payment_method;
ALTER TABLE bookings ADD COLUMN commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 AFTER payment_ref;
ALTER TABLE bookings ADD COLUMN commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER commission_rate;
