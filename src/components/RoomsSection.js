/*import React, { useState, useRef } from 'react';
import RoomCard from './RoomCard';
import AdminRoom from '../AdminRoom';


const RoomsSection = ({ rooms, handleDetails, selectedRoom, detailsRef, user, onReserve}) => {
  // Dodajte proveru da li je `detailsRef` postavljen i da li `selectedRoom` postoji
  const handleScrollToRoomDetails = () => {  
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };
const handleAddRoomClick = () => {
  setShowAddRoomForm(true);
};

const [showAddRoomForm, setShowAddRoomForm] = useState(false);

  React.useEffect(() => {
    if (selectedRoom && detailsRef?.current) {
      handleScrollToRoomDetails();
    }
  }, [selectedRoom]);

  React.useEffect(() => {
    if (!user) {
      setShowAddRoomForm(false);
    }
  }, [user]);

  return (
    <section id="rooms">
      <h2>Sobe</h2>
      <p>Pogledajte naše sobe...</p>
    {user?.role === 'admin' && (
        <div className="admin-room-button-wrapper">
          <button className="add-room-button" onClick={handleAddRoomClick}>
            ➕ Dodaj novu sobu
          </button>
        </div>
      )}
      {showAddRoomForm && (
        <AdminRoom
          onRoomAdded={(newRoom) => {
            console.log('Dodato', newRoom);
            setShowAddRoomForm(false);
            // Eventualno reloaduj soba ili dodaj u state
          }}
        />
      )}
    
      {selectedRoom && (
        <div className="room-details" ref={detailsRef}>
          <img src={selectedRoom.img} alt={selectedRoom.title} />
          <div className="room-description">
            <h3>{selectedRoom.title}</h3>
            <p>{selectedRoom.description}</p>

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

       
    </section>
  );
};

export default RoomsSection;*/

import React, { useState, useRef } from 'react';
import RoomCard from './RoomCard';
import AdminRoom from '../AdminRoom';

const RoomsSection = ({ rooms, handleDetails, selectedRoom, detailsRef, user, onReserve}) => {
  // Dodajte proveru da li je `detailsRef` postavljen i da li `selectedRoom` postoji
  const handleScrollToRoomDetails = () => {  
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

const handleAddRoomClick = () => {
  setShowAddRoomForm(true);
};


const [showAddRoomForm, setShowAddRoomForm] = useState(false);

  React.useEffect(() => {
    if (selectedRoom && detailsRef?.current) {
      handleScrollToRoomDetails();
    }
  }, [selectedRoom]);

  React.useEffect(() => {
    if (!user) {
      setShowAddRoomForm(false);
    }
  }, [user]);


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
     
      {selectedRoom && (
        <div className="room-details" ref={detailsRef}>
          <img src={selectedRoom.img} alt={selectedRoom.title} />
          <div className="room-description">
            <h3>{selectedRoom.title}</h3>
            <p>{selectedRoom.description}</p>

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
      {showAddRoomForm && (
        <AdminRoom
          onRoomAdded={(newRoom) => {
            console.log('Dodato', newRoom);
            setShowAddRoomForm(false);
          }}
        />
      )}
    

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

