import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminRoom = ({ onRoomAdded, onClose, formValues, onFormChange, isEditMode, onEditRoomSubmit }) => {
  // Ako dobijamo formValues i onFormChange iz propsa, koristimo ih, inače koristimo lokalni state (radi kompatibilnosti)
  const isControlled = !!formValues && !!onFormChange;
  const [localState, setLocalState] = useState({
    roomNumber: "",
    roomType: "",
    capacity: "",
    description: "",
    longDescription: "",
    price_per_night: "",
    amenities: "",
    image_url: "",
  });

  // Sync local state sa propsima ako se koristi controlled
  useEffect(() => {
    if (isControlled) return;
    setLocalState({
      roomNumber: "",
      roomType: "",
      capacity: "",
      description: "",
      longDescription: "",
      price_per_night: "",
      amenities: "",
      image_url: "",
    });
  }, [onClose]);

  const getValue = (field) => isControlled ? formValues[field] : localState[field];
  const setValue = (field, value) => {
    if (isControlled) {
      onFormChange(field, value);
    } else {
      setLocalState(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode && typeof onEditRoomSubmit === 'function') {
      onEditRoomSubmit();
      return;
    }
    const roomData = {
      room_number: getValue("roomNumber") ? parseInt(getValue("roomNumber"), 10) : undefined,
      room_type: getValue("roomType"),
      capacity: getValue("capacity") ? parseInt(getValue("capacity"), 10) : undefined,
      description: getValue("description"),
      long_description: getValue("longDescription"),
      price_per_night: getValue("price_per_night") ? parseFloat(getValue("price_per_night")) : undefined,
      amenities: getValue("amenities").trim() ? getValue("amenities").split(",").map(a => a.trim()) : [],
      image_url: getValue("image_url"),
    };
    try {
      const response = await axios.post("http://localhost:5000/api/rooms", roomData);
      if (response.status === 201) {
        alert("Soba uspešno dodata!");
        if (onRoomAdded) onRoomAdded(response.data);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Greška prilikom dodavanja sobe");
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      maxWidth: 400,
      width: '100%',
      margin: '0 auto',
      padding: '32px 32px 24px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 24,
        fontSize: '2rem',
        fontWeight: 600,
        color: '#222',
      }}>{isEditMode ? 'Izmeni sobu' : 'Dodaj sobu'}</h2>
      <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={handleSubmit}>
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("roomNumber")}
          onChange={(e) => setValue("roomNumber", e.target.value)}
          placeholder="Broj sobe"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("roomType")}
          onChange={(e) => setValue("roomType", e.target.value)}
          placeholder="Tip sobe"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("capacity")}
          onChange={(e) => setValue("capacity", e.target.value)}
          placeholder="Kapacitet"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("description")}
          onChange={(e) => setValue("description", e.target.value)}
          placeholder="Opis"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("price_per_night")}
          onChange={(e) => setValue("price_per_night", e.target.value)}
          placeholder="Cena po noći"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("longDescription")}
          onChange={(e) => setValue("longDescription", e.target.value)}
          placeholder="Duži opis"
          required
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("amenities")}
          onChange={(e) => setValue("amenities", e.target.value)}
          placeholder="Sadržaji (odvojeni zarezom)"
        />
        <input
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', outline: 'none', marginBottom: 0 }}
          type="text"
          value={getValue("image_url")}
          onChange={(e) => setValue("image_url", e.target.value)}
          placeholder="URL slike sobe"
          required
        />
        <button
          type="submit"
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: 12,
            fontSize: '1.1rem',
            fontWeight: 500,
            marginTop: 10,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isEditMode ? 'Izmeni sobu' : 'Dodaj sobu'}
        </button>
      </form>
    </div>
  );
};

export default React.memo(AdminRoom);
