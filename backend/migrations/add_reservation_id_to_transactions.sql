-- Dodaj kolonu reservation_id u transactions tabelu
ALTER TABLE transactions 
ADD COLUMN reservation_id INTEGER REFERENCES reservations(reservation_id);

-- Kreiraj index za brže queryje
CREATE INDEX idx_transactions_reservation_id ON transactions(reservation_id);
