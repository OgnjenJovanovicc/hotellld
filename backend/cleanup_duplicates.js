require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'Hotel',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432
});

async function cleanupDuplicates() {
  try {
    const result = await pool.query(`
      DELETE FROM transactions t1
      WHERE t1.id NOT IN (
        SELECT MIN(id) FROM transactions t2 
        GROUP BY t2.payment_intent_id
      )
    `);
    console.log('✅ Obrisano:', result.rowCount, 'duplikatnih transakcija');
  } catch (err) {
    console.error('❌ Greška:', err.message);
  } finally {
    process.exit();
  }
}

cleanupDuplicates();
