/*import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const RoomCard = ({ room, onClick,user }) => (
  <div className="room"onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
       onClick={() => onClick(room)}>
    <img src={room.img} alt={room.title} />
    <p>{room.title}</p>
    <div className="overlay">
      <button className="details-button">Detaljniji opis</button>
      {user && user.role === 'admin' && hovered && (
        <div className="admin-icons">
          <FontAwesomeIcon icon={faEdit} className="icon edit-icon" />
          <FontAwesomeIcon icon={faTrash} className="icon delete-icon" />
        </div>
      )}
    </div>
  </div>
);

export default RoomCard;*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const RoomCard = ({ room, onClick, user }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="room"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(room)}
      style={{ position: 'relative' }} // Dodato za sigurnost
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
            background: 'red', // Privremeno za testiranje vidljivosti
            zIndex: 100,
          }}
        >
          <FontAwesomeIcon icon={faEdit} className="icon edit-icon" />
          <FontAwesomeIcon icon={faTrash} className="icon delete-icon" />
        </div>
      )}
    </div>
  );
};

export default RoomCard;
