import React from 'react';

const RoomCard = ({ room, onClick }) => (
  <div className="room" onClick={() => onClick(room)}>
    <img src={room.img} alt={room.title} />
    <p>{room.title}</p>
    <div className="overlay">
      <button className="details-button">Detaljniji opis</button>
    </div>
  </div>
);

export default RoomCard;
