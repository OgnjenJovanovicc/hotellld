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
    console.error('Greška:', err);
    process.exit(1);
  }

  client.query(`SELECT id, reservation_data FROM transactions`, (err, result) => {
    release();
    if (err) console.error('Greška:', err);
    else {
      console.log('Transakcije i njihovi podaci:');
      result.rows.forEach(row => {
        console.log(`\nID: ${row.id}`);
        console.log(`Podaci: ${row.reservation_data}`);
        try {
          const parsed = JSON.parse(row.reservation_data);
          console.log(`  → Guest: ${parsed.guest_info?.firstName} ${parsed.guest_info?.lastName}`);
          console.log(`  → Room: ${parsed.room_id}`);
        } catch (e) {
          console.log('  → Parse error:', e.message);
        }
      });
    }
    pool.end();
  });
});
