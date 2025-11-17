require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'Hotel',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🔄 Pokrećem migraciju...');
    
    // Provjeri da li kolona već postoji
    const columnExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'reservation_id'
      )
    `);
    
    if (columnExists.rows[0].exists) {
      console.log('✅ Kolona reservation_id već postoji');
      return;
    }

    // Dodaj kolonu
    await client.query(`
      ALTER TABLE transactions 
      ADD COLUMN reservation_id INTEGER REFERENCES reservations(reservation_id)
    `);
    console.log('✅ Dodana kolona reservation_id');

    // Kreiraj index
    await client.query(`
      CREATE INDEX idx_transactions_reservation_id ON transactions(reservation_id)
    `);
    console.log('✅ Kreiran index');

  } catch (err) {
    console.error('❌ Greška pri migraciji:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
