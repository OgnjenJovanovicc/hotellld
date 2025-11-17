require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'Hotel',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Greška pri konekciji:', err.stack);
    process.exit(1);
  }

  const sql = `DELETE FROM transactions WHERE id NOT IN (
    SELECT MIN(id) FROM transactions GROUP BY payment_intent_id
  )`;

  client.query(sql, (err, result) => {
    release();
    if (err) {
      console.error('❌ Greška pri brisanju:', err);
    } else {
      console.log('✅ Obrisano:', result.rowCount, 'duplikatnih redova');
    }
    pool.end();
  });
});
