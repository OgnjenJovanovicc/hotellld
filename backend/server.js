require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { Pool } = require('pg');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;
const dns=require('dns').promises;

app.use(cors());

// ⚠️ STRIPE WEBHOOK ENDPOINT MORA BITI PRE app.use(express.json())
// jer webhook zahteva RAW body za verifikaciju potpisa
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🔔 Webhook primljen na /webhook/stripe');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  
  console.log('Webhook Secret:', endpointSecret ? 'Postoji' : 'NEDOSTAJE!');
  console.log('Signature:', sig ? 'Postoji' : 'NEDOSTAJE!');
  
  let event;
  try {
    if (!endpointSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET nije postavljen u .env');
      return res.status(400).send('Webhook secret not configured');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('✅ Webhook event uspešno konstruisan:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    console.log('💳 Payment Intent uspešan!');
    const paymentIntent = event.data.object;
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Amount:', paymentIntent.amount);
    
    let reservation = {};
    try {
      reservation = JSON.parse(paymentIntent.metadata.reservation || '{}');
      console.log('Reservation data:', reservation);
    } catch (e) {
      console.error('Greška pri parsiranju reservation:', e);
    }
    
    try {
      // Provjera da li transakcija već postoji (idempotency)
      const existingTransaction = await pool.query(
        'SELECT id FROM transactions WHERE payment_intent_id = $1',
        [paymentIntent.id]
      );
      
      if (existingTransaction.rows.length > 0) {
        console.log('⚠️ Transakcija već postoji za Payment Intent:', paymentIntent.id);
        return res.json({ received: true, skipped: true });
      }
      
      const result = await pool.query(
        `INSERT INTO transactions 
          (payment_intent_id, amount, currency, status, reservation_data, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [
          paymentIntent.id,
          paymentIntent.amount,
          paymentIntent.currency,
          paymentIntent.status,
          JSON.stringify(reservation)
        ]
      );
      console.log('✅ Transakcija uspešno upisana u bazu:', result.rows[0]);
    } catch (dbErr) {
      console.error('❌ Greška pri upisu transakcije u bazu:', dbErr.message);
      console.error('Detalji greške:', dbErr);
    }
  } else {
    console.log('ℹ️ Primljen event tipa:', event.type, '(nije payment_intent.succeeded)');
  }
  
  res.json({ received: true });
});

// SADA dolazi express.json() nakon webhook endpoint-a
app.use(express.json());



const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

app.get('/', (req, res) => {
  res.send('Hello, PostgreSQL!');
});

app.get('/api/rooms/available-count', async (req, res) => {
  const { room_type, start_date, end_date } = req.query;
  if (!room_type || !start_date || !end_date) {
    return res.status(400).json({ error: 'room_type, start_date i end_date su obavezni query parametri' });
  }
  try {
    
    const roomResult = await pool.query(
      'SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1',
      [room_type]
    );
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Nema takvog tipa sobe' });
    }
    const totalUnits = roomResult.rows[0].total_units || 0;
    //  Suma rezervisanih jedinica za taj tip i period
    const reservationsResult = await pool.query(
      `SELECT COALESCE(SUM(r.units_reserved),0) as zauzeto
       FROM reservations r
       JOIN rooms ro ON r.room_id = ro.room_id
       WHERE ro.room_type = $1
         AND NOT (r.end_date < $2 OR r.start_date > $3)
         AND r.status = 'Confirmed'`,
      [room_type, start_date, end_date]
    );
    const zauzeto = parseInt(reservationsResult.rows[0].zauzeto, 10) || 0;
    const availableCount = Math.max(totalUnits - zauzeto, 0);
    res.json({ availableCount });
  } catch (error) {
    console.error('Greška pri dohvatanju broja slobodnih soba:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju broja slobodnih soba' });
  }
});

app.post('/api/users', async (req, res) => {
  const { ime, prezime, telefon, email, sifra, role } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,}$/;
  if (!passwordRegex.test(sifra)) {
    return res.status(400).json({ error: 'Šifra mora imati najmanje 8 karaktera, uključujući veliko slovo i specijalni karakter.' });
  }
  const emailRegex =  /^[\w.-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Neispravan email format.' });
  }

  const domain=email.split('@')[1];
  try{
    const mxRecords=await dns.resolveMx(domain);

    if(!mxRecords || mxRecords.length===0){
      return res.status(400).json({ error: 'Email domen nema validne MX zapise.' });
    }
  }catch(err){
    return res.status(400).json({ error: 'Email domen ne postoji ili nije dostuoan.' });
  }
  try {
    const result = await client.query(
      'INSERT INTO users(ime, prezime, telefon, email, sifra, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [ime, prezime, telefon, email, sifra, role] 
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Failed to register user' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, sifra } = req.body;
  
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Pogrešan email ili šifra' });
    }

    if (user.sifra !== sifra) {
      return res.status(400).json({ message: 'Pogrešan email ili šifra' });
    }

    const { sifra: password, ...userWithoutPassword } = user; // Uklanjanje šifre iz odgovora
    if(user.role==='admin'){
      console.log('admin je00');
    }
    res.json({ message: 'Uspešno ste prijavljeni', user: userWithoutPassword });
  } catch (err) {
    console.error('Error during login:', err.stack);
    res.status(500).json({ message: 'Došlo je do greške' });
  }
});


app.get('/api/rooms/unavailable', async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date i end_date su obavezni query parametri' });
  }
  try {
    const result = await pool.query(
      `SELECT DISTINCT room_id FROM reservations
       WHERE NOT (end_date < $1 OR start_date > $2)`,
      [start_date, end_date]
    );
    const unavailableRoomIds = result.rows.map(r => r.room_id);
    res.json(unavailableRoomIds);
  } catch (error) {
    console.error('Greška pri dohvatanju zauzetih soba:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju zauzetih soba' });
  }
});

app.get('/api/rooms/available', async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date i end_date su obavezni query parametri' });
  }
  try {
    const result = await pool.query(`
      SELECT r.* FROM rooms r
      WHERE r.room_id NOT IN (
        SELECT room_id FROM reservations
        WHERE NOT (end_date < $1 OR start_date > $2)
      )
    `, [start_date, end_date]);
    const availableRooms = result.rows;
    res.json(availableRooms);
  } catch (error) {
    console.error('Greška pri dohvatanju slobodnih soba:', error);
    res.status(500).json({ 
      error: 'Greška pri dohvatanju slobodnih soba',
      details: error.message,
      stack: error.stack
    });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms');
    const roomsWithConsistentStructure = result.rows.map(room => ({
      ...room,
      img: room.image_url,
      long_description: room.long_description || [],
      title: room.title || `Soba ${room.room_number}`,
      amenities: room.amenities || [],
      room_type: room.room_type ? String(room.room_type) : "",
      weekendPrice: room.weekend_price || "",
      discount: room.discount || "",
      reviews: room.reviews ? (typeof room.reviews === 'string' ? JSON.parse(room.reviews) : room.reviews) : { rating: '', count: '', comment: '' }
    }));
    res.status(200).json(roomsWithConsistentStructure);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju soba" });
  }
});

app.get('/api/reservations', async (req, res) => {
  try{
    const result=await client.query('SELECT * FROM reservations');
    if(result.rows.length===0){
      return res.status(404).json({ error: 'Nema podataka o rezervacijama' });
    }
    res.json(result.rows);
  }catch(err){
    console.error('Error fetching reservations:', err.stack);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('SELECT * FROM rooms WHERE room_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching room:', err.stack);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});


app.get('/api/test', (req, res) => {
  res.json({ message: "Server radi!" });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO messages (name, email, message, created_at) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [name, email, message]
    );
    
    console.log("Upisano u bazu:", result.rows[0]);
    res.status(201).json({ success: true, data: result.rows[0] });
    
  } catch (error) {
    console.error("Greška u /api/contact:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      hint: "Proveri konekciju sa bazom i SQL upit"
    });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/reservations/:roomType/units-per-day', async (req, res) => {
  const { roomType } = req.params;
  let { from, to } = req.query;
  try {
    const roomResult = await pool.query('SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1', [roomType]);
    const totalUnits = roomResult.rows[0]?.total_units || 0;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let startDate = (from && dateRegex.test(from)) ? from : new Date().toISOString().split('T')[0];
    let endDate = (to && dateRegex.test(to)) ? to : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
   //generiše svaki dan u periodu i broji rezervacije
    const sql = `
      SELECT d::date as date, COALESCE(SUM(r.units_reserved),0) as reserved
      FROM generate_series($2::date, $3::date, interval '1 day') d
      LEFT JOIN reservations r ON r.room_id IN (
        SELECT room_id FROM rooms WHERE room_type = $1
      )
   AND d > r.start_date AND d <= (r.end_date + interval '1 day')
      AND r.status = 'Confirmed'
      GROUP BY d
      ORDER BY d
    `;
    const result = await pool.query(sql, [roomType, startDate, endDate]);
    const map = {};
    result.rows.forEach(row => {
      let isoDate = row.date instanceof Date
        ? row.date.toISOString().split('T')[0]
        : (typeof row.date === 'string' && row.date.length >= 10 ? row.date.slice(0, 10) : String(row.date));
      map[isoDate] = { reserved: Number(row.reserved), total: totalUnits };
    });
    /*console.log('units-per-day DEBUG:', {
      roomType,
      totalUnits,
      startDate,
      endDate,
      resultRows: result.rows,
      map
    });*/

    Object.entries(map).forEach(([date, val]) => {
      if (val.reserved >= val.total && val.total > 0) {
        console.log(`[DISABLED-DAY] ${date}: reserved=${val.reserved}, total=${val.total}`);
      } else {
        console.log(`[ENABLED-DAY] ${date}: reserved=${val.reserved}, total=${val.total}`);
      }
    });
    res.json(map);
  } catch (error) {
    console.error('Greška pri dohvatanju zauzetih jedinica po danu:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju rezervacija' });
  }
});


app.post('/api/reservations', async (req, res) => {
  const { room_id, start_date, end_date, adults, children, guest_info, units_reserved,placeno } = req.body;

  if (!room_id || !start_date || !end_date || !adults || !guest_info || !units_reserved) {
    console.error('❌ Nedostaju obavezni podaci');
    return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
  }
/*
  if (
    !guest_info.firstName ||
    !guest_info.lastName ||
    !guest_info.email ||
    !guest_info.phone
  ) {
    console.error('❌ Nepotpuni podaci o gostu');
    return res.status(400).json({ error: 'Nepotpuni podaci o gostu' });
  }*/
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
    console.error('❌ Neispravan format datuma');
    return res.status(400).json({ error: 'Neispravan format datuma' });
  }
  if (end_date < start_date) {
    console.error('❌ Datum kraja je pre datuma početka');
    return res.status(400).json({ error: 'Datum kraja mora biti posle datuma početka' });
  }
  //Za izračunavanje cene koristi se Date objekte sa fiksnim vremenom
  const start = new Date(start_date + 'T12:00:00');
  const end = new Date(end_date + 'T12:00:00');


  try {
    const roomResult = await pool.query('SELECT room_type FROM rooms WHERE room_id = $1', [room_id]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Soba nije pronađena' });
    }
    /*
    const roomType = roomResult.rows[0].room_type;
    const totalUnitsResult = await pool.query('SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1', [roomType]);
    const totalUnits = totalUnitsResult.rows[0]?.total_units || 0;
    const reservationsResult = await pool.query(
      `SELECT COALESCE(SUM(r.units_reserved),0) as zauzeto
       FROM reservations r
       JOIN rooms ro ON r.room_id = ro.room_id
       WHERE ro.room_type = $1
         AND NOT (r.end_date < $2 OR r.start_date > $3)
         AND r.status = 'Confirmed'`,
      [roomType, start_date, end_date]
    );
    const zauzeto = parseInt(reservationsResult.rows[0].zauzeto, 10) || 0;
    const availableCount = Math.max(totalUnits - zauzeto, 0);
    if (units_reserved > availableCount) {
      return res.status(400).json({ error: 'Nema dovoljno slobodnih soba za izabrani period' });
    }*/

    // ✅ Izračunavanje ukupne cene
    // Dohvati cijenu sobe po noci
    const roomPrice = await pool.query('SELECT price_per_night FROM rooms WHERE room_id = $1', [room_id]);
    const pricePerNight = roomPrice.rows[0]?.price_per_night || 50;
    const total_price = calculateTotalPrice(start, end, adults, children, units_reserved, pricePerNight);

    // UVEK upisuj stringove u formatu YYYY-MM-DD
    const result = await pool.query(
      `INSERT INTO reservations 
       (room_id, start_date, end_date, adults, children, total_price, status, guest_name, guest_email, guest_phone, units_reserved,placeno)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        room_id,
        start_date,
        end_date,
        adults,
        children || 0,
        total_price,  
        "Confirmed",
        `${guest_info.firstName} ${guest_info.lastName}`,
        guest_info.email,
        guest_info.phone,
        units_reserved,
        placeno || false    
      ]
    );
    console.log('Insert result:', result.rows[0]);

    console.log('✅ Uspešno sačuvana rezervacija:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Greška pri čuvanju rezervacije:', error);
    res.status(500).json({ 
      error: 'Greška pri čuvanju rezervacije',
      details: error.message,
      stack: error.stack
    });
  }
});

app.post("/api/rooms", async (req, res) => {
  const {
    room_number,
    room_type,
    capacity,
    description,
    long_description,
    price_per_night,
    amenities,
    image_url,
    weekendPrice,
    discount,
    reviews,
    total_units
  } = req.body;

  let amenitiesArray = [];
  if (Array.isArray(amenities)) {
    amenitiesArray = amenities;
  } else if (typeof amenities === 'string') {
    amenitiesArray = amenities.split(',').map(a => a.trim()).filter(Boolean);
  }

  if (
    !room_number ||
    !room_type ||
    !capacity ||
    !description ||
    !long_description ||
    !price_per_night ||
    !image_url ||
    total_units === undefined
  ) {
    return res.status(400).json({ error: "Nedostaju neophodni podaci." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO rooms (room_number, room_type, capacity, description, long_description, price_per_night, amenities, image_url, weekend_price, discount, reviews, total_units) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        parseInt(room_number, 10),
        room_type,
        parseInt(capacity, 10),
        description,
        long_description,
        parseFloat(price_per_night),
        JSON.stringify(amenitiesArray),
        image_url ,
        weekendPrice || null,
        discount || null,
        reviews ? JSON.stringify(reviews) : null,
        parseInt(total_units, 10)
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Greška prilikom dodavanja sobe:", error.message, error.stack);
    res.status(500).json({ error: "Greška prilikom dodavanja sobe", details: error.message, stack: error.stack });
  }
});

/*
app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms");
    const roomsWithConsistentStructure = result.rows.map(room => ({
      ...room,
      img: room.image_url,
      long_description: room.long_description || [],
      title: room.title || `Soba ${room.room_number}`,
      amenities: room.amenities || [],
      room_type: room.room_type ? String(room.room_type) : "",
      weekendPrice: room.weekend_price || "",
      discount: room.discount || "",
      reviews: room.reviews ? (typeof room.reviews === 'string' ? JSON.parse(room.reviews) : room.reviews) : { rating: '', count: '', comment: '' }
    }));
    res.status(200).json(roomsWithConsistentStructure);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju soba" });
  }
});
*/

app.delete("/api/rooms/:room_id", async (req, res) => {
  try {
    let { room_id } = req.params;
    if (!room_id) {
      return res.status(400).json({ error: "Nedostaje ID sobe" });
    }
    room_id = Number(room_id);
    if (isNaN(room_id)) {
      return res.status(400).json({ error: "ID sobe nije validan broj" });
    }

    const result = await pool.query("DELETE FROM rooms WHERE room_id = $1", [room_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Soba nije pronađena" });
    }
    res.status(200).json({ message: "Soba uspešno obrisana" });
  } catch (error) {
    console.error("Error pri brisanju:", error);
    res.status(500).json({ error: "Greška pri brisanju sobe" });
  }
});

app.put("/api/rooms/:room_id", async (req, res) => {
  try {
    let { room_id } = req.params;
    if (!room_id) {
      return res.status(400).json({ error: "Nedostaje ID sobe" });
    }
    room_id = Number(room_id);
    if (isNaN(room_id)) {
      return res.status(400).json({ error: "ID sobe nije validan broj" });
    }
    const {
      room_number,
      room_type,
      capacity,
      description,
      long_description,
      price_per_night,
      amenities,
      image_url,
      weekendPrice,
      discount,
      reviews,
      total_units
    } = req.body;


    let amenitiesArray = [];
    if (Array.isArray(amenities)) {
      amenitiesArray = amenities;
    } else if (typeof amenities === 'string') {
      amenitiesArray = amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const updateQuery = `UPDATE rooms SET
      room_number = $1,
      room_type = $2,
      capacity = $3,
      description = $4,
      long_description = $5,
      price_per_night = $6,
      amenities = $7,
      image_url = $8,
      weekend_price = $9,
      discount = $10,
      reviews = $11,
      total_units = $12
      WHERE room_id = $13 RETURNING *`;
    const values = [
      parseInt(room_number, 10),
      room_type,
      parseInt(capacity, 10),
      description,
      long_description,
      parseFloat(price_per_night),
      JSON.stringify(amenitiesArray),
      image_url,
      weekendPrice || null,
      discount || null,
      reviews ? JSON.stringify(reviews) : null,
      parseInt(total_units, 10),
      room_id
    ];
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Soba nije pronađena" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Greška pri izmeni sobe:", error.message, error.stack);
    res.status(500).json({ error: "Greška pri izmeni sobe", details: error.message, stack: error.stack });
  }
});


// ✅ Funkcija za izračunavanje cene
// Formula: (cijena_sobe_po_noci * broj_soba * broj_dana) + (odrasli * cijena_po_odraslom * broj_dana) + (deca * cijena_po_djetetu * broj_dana)
function calculateTotalPrice(start, end, adults, children = 0, unitsReserved = 1, roomPricePerNight = 50) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysDiff = Math.ceil((end - start) / msPerDay) + 1;

  const pricePerAdultPerDay = 25;
  const pricePerChildPerDay = 12.5;

  // Cijena = (cijena_sobe * broj_soba * dani) + (odrasli * cijena * dani) + (deca * cijena * dani)
  const roomCost = roomPricePerNight * unitsReserved * daysDiff;
  const adultsCost = adults * pricePerAdultPerDay * daysDiff;
  const childrenCost = children * pricePerChildPerDay * daysDiff;
  const totalPrice = roomCost + adultsCost + childrenCost;

  console.log(`💰 Izračun: Sobe(${roomPricePerNight}*${unitsReserved}*${daysDiff}) + Odrasli(${adults}*${pricePerAdultPerDay}*${daysDiff}) + Deca(${children}*${pricePerChildPerDay}*${daysDiff}) = ${totalPrice}€`);
  return totalPrice;
}

// Endpoint za izračunavanje cijene
app.post('/api/calculate-price', async (req, res) => {
  const { start_date, end_date, adults, children, units_reserved, room_id } = req.body;
  
  if (!start_date || !end_date || !adults || !units_reserved || !room_id) {
    return res.status(400).json({ error: 'Nedostaju obavezni parametri' });
  }
  
  try {
    // Dohvati cijenu sobe
    const roomResult = await pool.query('SELECT price_per_night FROM rooms WHERE room_id = $1', [room_id]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Soba nije pronađena' });
    }
    
    const pricePerNight = roomResult.rows[0].price_per_night || 50;
    const start = new Date(start_date + 'T12:00:00');
    const end = new Date(end_date + 'T12:00:00');
    
    const totalPrice = calculateTotalPrice(start, end, adults, children || 0, units_reserved, pricePerNight);
    
    res.json({ 
      totalPrice,
      breakdown: {
        roomPrice: pricePerNight,
        unitsReserved: units_reserved,
        adults,
        children: children || 0,
        days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      }
    });
  } catch (error) {
    console.error('Greška pri izračunavanju cijene:', error);
    res.status(500).json({ error: 'Greška pri izračunavanju cijene' });
  }
});

// Endpoint za kreiranje Stripe Payment Intent-a
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency, reservationData } = req.body;
  console.log('📝 Zahtev za Payment Intent:', { amount, currency, reservationData });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'eur',
      metadata: {
        reservation: JSON.stringify(reservationData)
      }
    });
    console.log('✅ Payment Intent kreiran:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Stripe PaymentIntent error:', error);
    res.status(500).json({ error: 'Stripe PaymentIntent error', details: error.message });
  }
});
 /* */
app.get('/api/admin/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dohvatanju transakcija' });
  }
});