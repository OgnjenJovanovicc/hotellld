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

// Ruta za dodavanje novog korisnika (registracija)
app.post('/api/users', async (req, res) => {
  const { ime, prezime, telefon, email, sifra } = req.body;

  try {
    // Ne heširamo šifru, već je čuvamo kao običan tekst
    const result = await client.query(
      'INSERT INTO users(ime, prezime, telefon, email, sifra) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [ime, prezime, telefon, email, sifra] // Čuvanje šifre kao plain text
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
    res.json({ message: 'Uspešno ste prijavljeni', user: userWithoutPassword });
  } catch (err) {
    console.error('Error during login:', err.stack);
    res.status(500).json({ message: 'Došlo je do greške' });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM rooms');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooms:', err.stack);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Dohvat detalja jedne sobe
app.get('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching room:', err.stack);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

app.post('/api/reservations', async (req, res) => {
  const { roomId, userId, reservationDate } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO reservations (room_id, user_id, reservation_date) VALUES ($1, $2, $3) RETURNING *',
      [roomId, userId, reservationDate]
    );
    res.status(201).json({ message: 'Rezervacija uspešna', reservation: result.rows[0] });
  } catch (err) {
    console.error('Error creating reservation:', err.stack);
    res.status(500).json({ error: 'Failed to create reservation' });
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
app.get('/api/reservations/:roomType', async (req, res) => {
  const { roomType } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.start_date, r.end_date
       FROM reservations r
       JOIN rooms ro ON r.room_id = ro.room_id
       WHERE ro.room_type = $1
       AND r.end_date >= CURRENT_DATE`, // Samo aktivne/buduće rezervacije
      [roomType]
    );

    // Koristimo Set da izbegnemo duplikate
    const bookedDatesSet = new Set();

    result.rows.forEach(({ start_date, end_date }) => {
      const start = new Date(start_date);
      const end = new Date(end_date);
      
      // Prolazimo kroz sve datume između start_date i end_date
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        bookedDatesSet.add(dateString);
      }
    });

    // Konvertujemo Set u niz i sortiramo datume
    const bookedDates = Array.from(bookedDatesSet).sort();

    res.json(bookedDates);
  } catch (error) {
    console.error('Greška pri dohvatanju zauzetih datuma:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju rezervacija' });
  }
});

