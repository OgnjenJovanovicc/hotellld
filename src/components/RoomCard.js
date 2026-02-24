import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const RoomCard = ({ room, onClick, user, onDelete, onEdit }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="room"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(room)}
    >
      <img src={room.img} alt={room.title} />
      <p className="room-title">{room.room_type || room.title}</p>

      <div className="overlay">
        <button type="button" className="details-button">
          Detaljniji opis
        </button>
      </div>

      {user && user.role === 'admin' && hovered && (
        <div className="admin-icons">
          <button
            type="button"
            className="admin-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onEdit === 'function') {
                onEdit(room);
              }
            }}
            title="Izmeni sobu"
            aria-label="Izmeni sobu"
          >
            <FontAwesomeIcon icon={faEdit} className="icon edit-icon" />
          </button>

          <button
            type="button"
            className="admin-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onDelete === 'function') {
                onDelete(room.room_id || room.id);
              }
            }}
            title="Obrisi sobu"
            aria-label="Obrisi sobu"
          >
            <FontAwesomeIcon icon={faTrash} className="icon delete-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
