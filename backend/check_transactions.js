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
    console.error('Greška pri konekciji:', err.stack);
    process.exit(1);
  }

  client.query(`SELECT id, payment_intent_id, created_at FROM transactions ORDER BY payment_intent_id`, (err, result) => {
    release();
    if (err) {
      console.error('Greška:', err);
    } else {
      console.log('Sve transakcije:');
      result.rows.forEach(row => {
        console.log(`  ID: ${row.id}, PI: ${row.payment_intent_id}, Datum: ${row.created_at}`);
      });
    }
    pool.end();
  });
});
