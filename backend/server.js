
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { Pool } = require('pg');
const router = express.Router();

// Kreiranje Express aplikacije
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config(); // Učitavanje konfiguracija iz .env fajla
app.use(cors());

// Middleware za parsiranje JSON-a u request-u
app.use(express.json());



// Postavljanje PostgreSQL klijenta
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

// Povezivanje sa bazom
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Osnovna ruta za testiranje servera
app.get('/', (req, res) => {
  res.send('Hello, PostgreSQL!');
});
// Endpoint: Vrati broj slobodnih soba za dati tip i period
app.get('/api/rooms/available-count', async (req, res) => {
  const { room_type, start_date, end_date } = req.query;
  if (!room_type || !start_date || !end_date) {
    return res.status(400).json({ error: 'room_type, start_date i end_date su obavezni query parametri' });
  }
  try {
    // 1. Uzmi total_units za dati tip sobe
    const roomResult = await pool.query(
      'SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1',
      [room_type]
    );
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Nema takvog tipa sobe' });
    }
    const totalUnits = roomResult.rows[0].total_units || 0;
    // 2. Suma rezervisanih jedinica za taj tip i period
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

// Ruta za dodavanje novog korisnika (registracija)
app.post('/api/users', async (req, res) => {
  const { ime, prezime, telefon, email, sifra, role } = req.body;

  try {
    // Ne heširamo šifru, već je čuvamo kao običan tekst
    const result = await client.query(
      'INSERT INTO users(ime, prezime, telefon, email, sifra, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [ime, prezime, telefon, email, sifra, role] // Čuvanje šifre kao plain text
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Ruta za prijavu korisnika (login)
app.post('/api/login', async (req, res) => {
  const { email, sifra } = req.body;

  try {
    // Provera korisnika na osnovu emaila
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Pogrešan email ili šifra' });
    }

    // Provera ispravnosti šifre - jednostavno poređenje bez bcrypt
    if (user.sifra !== sifra) {
      return res.status(400).json({ message: 'Pogrešan email ili šifra' });
    }

    // Ako su podaci ispravni, vraćamo korisničke podatke (bez šifre)
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

// Endpoint: Vrati ID-jeve zauzetih soba za dati period
app.get('/api/rooms/unavailable', async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date i end_date su obavezni query parametri' });
  }
  try {
    // Pronađi sve sobe koje imaju makar jednu rezervaciju koja se preklapa sa zadatim periodom
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

// Endpoint: Vrati sve slobodne sobe za dati period
app.get('/api/rooms/available', async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date i end_date su obavezni query parametri' });
  }
  try {
    // Sobe koje nemaju nijednu rezervaciju koja se preklapa sa zadatim periodom
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
    // Vrati detalje greške na frontend radi lakšeg debugovanja
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

// Dohvat detalja jedne sobe
app.get('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ispravljeno: koristi room_id umesto id
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
  console.log("Primljen zahtev:", req.body); // Dodaj za debagovanje
  
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


// Pokretanje servera
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Novi endpoint: Broj rezervisanih jedinica po danu za dati tip sobe
app.get('/api/reservations/:roomType/units-per-day', async (req, res) => {
  const { roomType } = req.params;
  // Opcionalno: period za koji želiš podatke (možeš proširiti po potrebi)
  let { from, to } = req.query;
  try {
    // Prvo uzmi total_units za taj tip
    const roomResult = await pool.query('SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1', [roomType]);
    const totalUnits = roomResult.rows[0]?.total_units || 0;

    // Odredi period (default: danas do +60 dana)
    // Ispravi: koristi tačno prosleđene vrednosti, bez pomeranja
    // Ako from ili to nisu validni datumi, koristi danas i +60 dana
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let startDate = (from && dateRegex.test(from)) ? from : new Date().toISOString().split('T')[0];
    let endDate = (to && dateRegex.test(to)) ? to : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Za svaki dan u periodu, izračunaj sumu units_reserved
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
    // Format: { date: '2025-07-03', reserved: 2 }
    const map = {};
    result.rows.forEach(row => {
      // UVEK koristi ISO format YYYY-MM-DD kao ključ
      let isoDate = row.date instanceof Date
        ? row.date.toISOString().split('T')[0]
        : (typeof row.date === 'string' && row.date.length >= 10 ? row.date.slice(0, 10) : String(row.date));
      map[isoDate] = { reserved: Number(row.reserved), total: totalUnits };
    });
    // DODATNI ISPIS ZA DEBUG
    console.log('units-per-day DEBUG:', {
      roomType,
      totalUnits,
      startDate,
      endDate,
      resultRows: result.rows,
      map
    });

    // Posebno ispiši za svaki dan u periodu
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
  console.log('📥 Primljeni podaci:', req.body);

  const { room_id, start_date, end_date, adults, children, guest_info, units_reserved } = req.body;

  // ✅ Validacija osnovnih polja
  if (!room_id || !start_date || !end_date || !adults || !guest_info || !units_reserved) {
    console.error('❌ Nedostaju obavezni podaci');
    return res.status(400).json({ error: 'Nedostaju obavezni podaci' });
  }

  // ✅ Validacija guest_info polja
  if (
    !guest_info.firstName ||
    !guest_info.lastName ||
    !guest_info.email ||
    !guest_info.phone
  ) {
    console.error('❌ Nepotpuni podaci o gostu');
    return res.status(400).json({ error: 'Nepotpuni podaci o gostu' });
  }

  // ✅ Parsiranje i provera datuma (uvek koristi lokalni dan, bez vremenske zone)
  // Očekuje se da su start_date i end_date u formatu 'YYYY-MM-DD'
  // Provera validnosti stringa bez Date objekta
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
    console.error('❌ Neispravan format datuma');
    return res.status(400).json({ error: 'Neispravan format datuma' });
  }
  // Provera da li je end_date >= start_date
  if (end_date < start_date) {
    console.error('❌ Datum kraja je pre datuma početka');
    return res.status(400).json({ error: 'Datum kraja mora biti posle datuma početka' });
  }
  // Za izračunavanje cene koristi Date objekte sa fiksnim vremenom
  const start = new Date(start_date + 'T12:00:00');
  const end = new Date(end_date + 'T12:00:00');

  // Provera dostupnosti pre upisa
  try {
    // 1. Uzmi tip sobe i total_units
    const roomResult = await pool.query('SELECT room_type FROM rooms WHERE room_id = $1', [room_id]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Soba nije pronađena' });
    }
    const roomType = roomResult.rows[0].room_type;
    const totalUnitsResult = await pool.query('SELECT total_units FROM rooms WHERE room_type = $1 LIMIT 1', [roomType]);
    const totalUnits = totalUnitsResult.rows[0]?.total_units || 0;
    // 2. Suma rezervisanih jedinica za taj tip i period
    // UVEK koristi stringove u formatu YYYY-MM-DD za upite
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
    }

    // ✅ Izračunavanje ukupne cene
    const total_price = calculateTotalPrice(start, end, adults, children);

    // UVEK upisuj stringove u formatu YYYY-MM-DD
    const result = await pool.query(
      `INSERT INTO reservations 
       (room_id, start_date, end_date, adults, children, total_price, status, guest_name, guest_email, guest_phone, units_reserved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
        units_reserved
      ]
    );

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
   console.log("Primljeni podaci:", req.body); // Proverite u server konzoli
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

  // Parsiranje amenities uvek u niz
  let amenitiesArray = [];
  if (Array.isArray(amenities)) {
    amenitiesArray = amenities;
  } else if (typeof amenities === 'string') {
    amenitiesArray = amenities.split(',').map(a => a.trim()).filter(Boolean);
  }

  // Provera svih polja
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
        JSON.stringify(amenitiesArray), // šaljemo kao JSON string
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
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Greška pri učitavanju soba" });
  }
});*/

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

/*
app.delete("/api/rooms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM rooms WHERE id = $1", [id]);
    res.status(200).json({ message: "Soba uspešno obrisana" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška pri brisanju sobe" });
  }
});*/
app.delete("/api/rooms/:room_id", async (req, res) => {
  try {
    let { room_id } = req.params;
    console.log("Brisem room sa ID:", room_id, "tip:", typeof room_id);

    if (!room_id) {
      return res.status(400).json({ error: "Nedostaje ID sobe" });
    }

    // Prisilna konverzija u broj (ako je moguće)
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

    // Parsiranje amenities uvek u niz
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
function calculateTotalPrice(start, end, adults, children = 0) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysDiff = Math.ceil((end - start) / msPerDay) + 1;

  const pricePerAdultPerDay = 50;
  const pricePerChildPerDay = 25;

  const totalPrice = daysDiff * (adults * pricePerAdultPerDay + children * pricePerChildPerDay);

  console.log(`💰 Ukupna cena (${daysDiff} dana): ${totalPrice}`);
  return totalPrice;
}