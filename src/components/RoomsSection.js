import React, { useState, useRef } from 'react';
import RoomCard from './RoomCard';

const RoomsSection = ({ rooms, handleDetails, selectedRoom, detailsRef, user, onReserve}) => {
  // Dodajte proveru da li je `detailsRef` postavljen i da li `selectedRoom` postoji
  const handleScrollToRoomDetails = () => {  
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleAddRoomClick = () => {
  // Ovo može da otvori modal ili preusmeri na formu
  //alert("Otvaranje forme za dodavanje sobe (implementiraj modal ili navigaciju)");
};

  // Kada korisnik izabere sobu, pozivate ovu funkciju
  React.useEffect(() => {
    if (selectedRoom && detailsRef?.current) {
      handleScrollToRoomDetails();
    }
  }, [selectedRoom]);
  return (
    <section id="rooms">
      <h2>Sobe</h2>
      <p>Pogledajte naše sobe...</p>
       {user?.role === 'admin' && (
<div className="admin-room-button-wrapper">
      <button
        className="add-room-button"
        onClick={() => handleAddRoomClick(true)} // ili tvoj handler
      >
        ➕ Dodaj novu sobu
      </button>
    </div>
  )}
      {/* Ako je selektovana soba, prikazujemo detalje */}
      {selectedRoom && (
        <div className="room-details" ref={detailsRef}>
          <img src={selectedRoom.img} alt={selectedRoom.title} />
          <div className="room-description">
            <h3>{selectedRoom.title}</h3>
            <p>{selectedRoom.description}</p>

            {/* Ako je korisnik prijavljen, prikazuje dugme za rezervaciju */}
            <div className="button-container">
  {user ? (
    <button className="reserve-button"  onClick={() => onReserve(selectedRoom)}>Rezervišite sobu</button>
  ) : (
    <p className="login-reminder">
      <em>Morate se prijaviti da bi rezervisali sobu.</em>
    </p>
  )}
  <button className="close-button" onClick={() => handleDetails(null)}>
    Zatvori
  </button>
</div>
          </div>
        </div>
      )}

      {/* Prikazivanje svih soba */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            user={user}
            onClick={() => handleDetails(room)} // Poziva funkciju za selektovanje sobe
          />
        ))}
      </div>
    </section>
  );
};

export default RoomsSection;

