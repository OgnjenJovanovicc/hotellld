/*import React, { useState } from 'react';
import axios from 'axios';

const AdminRoom = ({ onRoomAdded }) => {
  const [roomData, setRoomData] = useState({
    room_number: '',
    room_type: '',
    capacity: '',
    description: '',
    long_description: '',
    price_per_night: '',
    amenities: '', // "WiFi, Klima, Fen..."
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      if (response.data) {
        alert('Soba uspešno dodata!');
        if (onRoomAdded) onRoomAdded(response.data);
      }
    } catch (error) {
      console.error(error);
      alert('Greška pri dodavanju sobe');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-xl">
      <h2 className="text-xl font-bold">Dodaj novu sobu</h2>
      <div>
        <label>Broj sobe</label>
        <input 
          type="text"
          name="room_number"
          value={roomData.room_number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tip sobe</label>
        <input 
          type="text"
          name="room_type"
          value={roomData.room_type}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Kapacitet</label>
        <input 
          type="number"
          name="capacity"
          value={roomData.capacity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Opis</label>
        <textarea 
          name="description"
          value={roomData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Duži opis</label>
        <textarea 
          name="long_description"
          value={roomData.long_description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cena po noći</label>
        <input 
          type="number"
          name="price_per_night"
          value={roomData.price_per_night}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Dodaci (npr. WiFi, Klima, Fen)</label>
        <input 
          type="text"
          name="amenities"
          value={roomData.amenities}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>URL slike</label>
        <input 
          type="text"
          name="image_url"
          value={roomData.image_url}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white rounded p-2"
      >
        {loading ? 'Dodavanje...' : 'Dodaj sobu'}
      </button>
    </form>
  );
};

export default AdminRoom;
*/
import React, { useState } from "react";
import axios from "axios";

const AdminRoom = ({ onRoomAdded }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price_per_night, setPrice] = useState("");
  const [amenities, setAmenities] = useState("");
  const [image_url, setUrlImg] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  const roomData = {
    room_number: parseInt(roomNumber),
    room_type: roomType,
    capacity: parseInt(capacity),
    description,
    long_description: longDescription,
    price_per_night: parseFloat(price_per_night),
    amenities: amenities.trim() ? amenities.split(",").map(a => a.trim()) : [],
    image_url: image_url,
  };
  console.log("Podaci koji se šalju:", roomData); // Proverite u konzoli pregledača
  // ...ostatak koda

    try {
      const response = await axios.post("http://localhost:5000/api/rooms", roomData);
      if (response.status === 201) {
        alert("Soba uspešno dodata!");
        if (onRoomAdded) onRoomAdded(response.data);
      }
    } catch (err) {
      console.error(err);
      alert("Greška prilikom dodavanja sobe");
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
        placeholder="Broj sobe"
        required
      />
      <input
        type="text"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        placeholder="Tip sobe"
        required
      />
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        placeholder="Kapacitet"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Opis"
        required
      />
      <input
        type="number"
        value={price_per_night}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Cena po noći"
        required
      />
            <input
        type="text"
        value={longDescription}
        onChange={(e) => setLongDescription(e.target.value)}
        placeholder="Duži opis"
        required
      />
      <input
        type="text"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        placeholder="Sadržaji (odvojeni zarezom)"
      />
      <input
        type="text"
        value={image_url}
        onChange={(e) => setUrlImg(e.target.value)}
        placeholder="URL slike sobe"
        required
      />
      <button type="submit">Dodaj sobu</button>
    </form>
  );
};

export default AdminRoom;
