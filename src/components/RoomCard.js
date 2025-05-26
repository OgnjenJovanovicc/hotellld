import React from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";

const handleEdit = (room) => {
  alert(`Izmena sobe: ${room.name}`);
};

const handleDelete = (room) => {
  if (window.confirm(`Da li želite da obrišete sobu: ${room.name}?`)) {
    alert(`Soba obrisana: ${room.name}`);
  }
};

const RoomCard = ({ room, onClick,user }) => (
  <div className="room" onClick={() => onClick(room)}>
    <img src={room.img} alt={room.title} />
    <p>{room.title}</p>
    <div className="overlay">
      <button className="details-button">Detaljniji opis</button>
     {user?.role === "admin" && (
      <div className="admin-icons">
        <button onClick={() => handleEdit(room)}><FaEdit /></button>
        <button onClick={() => handleDelete(room)}><FaTrash /></button>
      </div>
    )}
    </div>
  </div>
);

export default RoomCard;
