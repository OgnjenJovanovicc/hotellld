import React from 'react';
import RoomCard from './RoomCard';

const RoomsSection = ({ rooms, handleDetails, selectedRoom, detailsRef, user, onReserve, onDeleteRoom }) => {
  const handleScrollToRoomDetails = () => {  
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (selectedRoom && detailsRef?.current) {
      handleScrollToRoomDetails();
    }
  }, [selectedRoom]);

  React.useEffect(() => {
    if (!user) {
      // Modal i forma su sada u App.js
    }
  }, [user]);

  return (
    <section id="rooms">
      <h2>Sobe</h2>
      <p>Pogledajte naše sobe...</p>
      {selectedRoom && (
        <div className="room-details" ref={detailsRef}>
          <img src={selectedRoom.img} alt={selectedRoom.title} />
          <div className="room-description">
            <h3>{selectedRoom.title}</h3>
            <p>{selectedRoom.description}</p>
            <div className="button-container">
              {user ? (
                <button className="reserve-button" onClick={() => onReserve(selectedRoom)}>Rezervišite sobu</button>
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
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id || room.room_id}
            room={room}
            user={user}
            onClick={() => handleDetails(room)}
            onDelete={onDeleteRoom} // Dodato prosleđivanje funkcije za brisanje
          />
        ))}
      </div>
    </section>
  );
};

export default React.memo(RoomsSection);