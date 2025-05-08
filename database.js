const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Povezivanje sa bazom
mongoose.connect('mongodb://localhost:27017/hotel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Povezan sa bazom"))
.catch((err) => console.log("Greška pri povezivanju sa bazom", err));

app.use(express.json());

// Model za sobe
const Room = mongoose.model('Room', {
  title: String,
  description: String,
  image: String
});

// API endpoint za dobijanje soba
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).send("Greška prilikom dobijanja soba");
  }
});

// Startovanje servera
app.listen(5000, () => {
  console.log("Server je pokrenut na portu 5000");
});
