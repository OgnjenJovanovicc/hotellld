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
      style={{ position: 'relative' }} 
    >
      <img src={room.img} alt={room.title} />
      <p>{room.title}</p>
      <div className="overlay">
        <button className="details-button">Detaljniji opis</button>
      </div>
      
      {user && user.role === 'admin' && hovered && (
        <div 
          className="admin-icons"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red', 
            zIndex: 100,
          }}
        >
          <FontAwesomeIcon
            icon={faEdit}
            className="icon edit-icon"
            onClick={e => {
              e.stopPropagation();
              if (typeof onEdit === 'function') {
                onEdit(room);
              }
            }}
            style={{ cursor: 'pointer', marginRight: '10px' }}
            title="Izmeni sobu"
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="icon delete-icon"
            onClick={e => {
              e.stopPropagation();
              if (typeof onDelete === 'function') {
                onDelete(room.room_id);
              }
            }}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            title="Obriši sobu"
          />
        </div>
      )}
    </div>
  );
};

export default RoomCard;