import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './ReservationPage.module.css';
import Tooltip from '@mui/material/Tooltip';
import  {LinearProgress, Box, Typography } from '@mui/material';

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const room = state?.room;
 //  const { room } = location.state || {};
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservationStartMessage, setReservationStartMessage] = useState("");
  const [reservationEndMessage, setReservationEndMessage]=useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [adults, setAdults] = useState(1);
  const[total_price,setTotalPrice]=useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [children, setChildren] = useState(0);
  const [paymentOption, setPaymentOption] = useState('naknadno');
  const [isFormVisible, setFormVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
    confirmEmail: '',
    additionalInfo: ''
  });
  const roomType = room?.room_type || room?.type;

const shouldDisableDate = (date) => {
  if (!bookedDates || !bookedDates.length) return false;
  
  // Konvertujemo Date objekat u string u formatu YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // Proveravamo da li se nalazi u nizu stringova
  return bookedDates.includes(dateStr);
};
  
useEffect(() => {
  console.log('Room objekat:', room);
console.log('Dostupni propertyji:', Object.keys(room || {}));
  console.log('useEffect se izvršava', room?.type);
  if (!roomType) {
    console.error('Nedostaje tip sobe');
    return;
  }
  const fetchBookedDates = async () => {
    console.log('Početak slanja zahteva');
    if (!room?.type) return; // Koristimo room.type umesto room.id

    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${room.type}`,{
    //  const response = await fetch(`/api/reservations/${room.type}`, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
   //const response = await fetch(`http://localhost:3001/api/reservations/${room.type}`);
      //const response = await fetch(`/api/reservations/${room.type}`);
      console.log('Odgovor primljen', response);
     
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dobijeni podaci:", data);
      if (!Array.isArray(data)) {
        throw new Error('Očekivan je niz datuma');
      }
      setBookedDates(data); // Backend već vraća niz stringova
    } catch (error) {
      console.error('Greška prilikom učitavanja zauzetih datuma:', error);
      const errorResponse = await fetch(`/api/reservations/${room.type}`);
      const text = await errorResponse.text();
      console.error("Puni odgovor servera:", text);
    }
  };

    fetchBookedDates();
  }, [room.type]);
  const handleConfirmReservation1 = async () => {
  try {
    // Provera da li su svi potrebni podaci prisutni
    if (!room?.id || !startDate || !endDate || !userData.firstName || !userData.email) {
      throw new Error('Nedostaju obavezni podaci za rezervaciju');
    }

    const response = await fetch('http://localhost:5000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_id: room.id,
        start_date: startDate.toISOString().split('T')[0], // Samo datum bez vremena
        end_date: endDate.toISOString().split('T')[0],
        adults,
        children,
        guest_info: userData
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Ako backend vraća detalje o grešci
      throw new Error(data.error || 'Došlo je do greške pri čuvanju rezervacije');
    }

    alert(`Rezervacija uspešno sačuvana! Broj rezervacije: ${data.reservation_id}`);
    setFormVisible(false);
    
  } catch (error) {
    console.error('Greška:', error);
    alert(error.message || 'Došlo je do greške pri čuvanju rezervacije. Pokušajte ponovo.');
  }
};
  
 // Promenite dependency u room.type
  if (!room) {
    return (
      <div>
        <h2>Nema izabrane sobe za rezervaciju!</h2>
        <button onClick={() => navigate('/')}>Nazad na početnu stranicu</button>
      </div>
    );
  }

  const handleNextStep = () => {
    if (currentStep === 1 && (!startDate || !endDate || adults < 1)) {
      alert('Molimo vas da popunite sve podatke u koraku 1!');
      return;
    }
    if (currentStep === 2 && (!userData.firstName || !userData.lastName || !userData.email || userData.email !== userData.confirmEmail)) {
      alert('Molimo vas da popunite sve podatke u koraku 2 i proverite da li su e-mail adrese iste!');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleConfirmReservation = () => {
    alert(
      `Rezervacija potvrđena!\nPočetak: ${startDate?.toLocaleDateString()}\nKraj: ${endDate?.toLocaleDateString()}\nOdrasli: ${adults}\nDeca: ${children}`
    );
    setFormVisible(false);
  };

  // Funkcija za promenu trenutnog koraka na klik kružića
  const handleStepClick = (step) => {
    setCurrentStep(step);
  };
  const validateDates = (start, end) => {
    if (start && end && new Date(start) > new Date(end)) {
      setError("Datum početka ne može biti veći od datuma kraja.");
    } else {
      setError(""); // Resetuj grešku ako su datumi ispravni
    }
  };
  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    
    // Izračunavanje broja dana
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 da uključi i početni dan
    
    // Cena po osobi po danu
    const pricePerAdultPerDay = 50;
    const pricePerChildPerDay = 25;
    
    // Ukupna cena
    return (adults * pricePerAdultPerDay + children * pricePerChildPerDay) * daysDiff;
  };

  
  const totalPrice=calculateTotalPrice();

  function Reservation({ room }) {
   }

  return (
    <div className={styles.reservationContainer}>
    <div className={styles.heroSection}>
      <h1>Rezervacija</h1>
    </div>

    <div className={styles.roomDetails}>
      <div className={styles.roomBox}>
        <img className={styles.roomImg} src={room.img} alt={room.title} />
        <div className={styles.roomInfo}>
        <div className={styles.amenities}>
        {room?.amenities?.map((item, index) => (
  <div key={index}>{item}</div>
))}

</div>
          <h2>{room.title}</h2>
          <div className={`${styles.roomText} ${showMore ? styles.expanded : styles.scrollText}`}>
              {showMore ? (
              <p className={`${styles.roomDescription} ${styles.roomDescriptionFade}`}>
                {room.longDescription}</p>
                ) : (
              <p>{room.description}</p>
                )}
          </div>
          <div className={styles.priceBox}>
          Cena:  <strong>{room.price}€</strong> po noći
          <a onClick={() => setShowPricingModal(true)} className={styles.morePricing}>
  Detalji o cenama
</a>
          </div>
          <div className={styles.reviews}>
          {room?.reviews && (
  <div>⭐ {room.reviews.rating} ({room.reviews.count} recenzija)</div>
)}
        {room?.reviews?.comment && (
  <blockquote>"{room.reviews.comment}"</blockquote>
)}
      </div>
      {showPricingModal && (
  <div className={styles.modalOverlay} onClick={() => setShowPricingModal(false)}>
    <div className={styles.modalContent1} onClick={(e) => e.stopPropagation()}>
      <h3> <a onClick={() => setShowPricingModal(true)} className={styles.morePricing}>
</a>Detalji o cenama</h3>
<p>- Standardna cena: {room.price}€ po noći</p>
<p>- Vikendom: {room.weekendPrice}€ po noći</p>
<p>- Popust za 7+ noći: {room.discount}</p>
      <button onClick={() => setShowPricingModal(false)}>Zatvori</button>
    </div>
  </div>
)}
          <div className={styles.buttonGroup}>
          <button onClick={() => setShowMore(!showMore)}>
            {showMore ? "Prikaži manje" : "Saznaj više"}
          </button>
         
          <button onClick={() => navigate("/")}>Nazad</button>
          <button onClick={() => setFormVisible(true)}>Počni rezervaciju</button>  
          </div>
        </div>
      </div>
    </div>
  
    
  

      {isFormVisible && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      {/* Kružni indikator */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} px={2}>
  <Box flex={1} mr={2}>
    <LinearProgress
      variant="determinate"
      value={(currentStep - 1) * 50}
      className={styles.animatedProgress}
  sx={{
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4CAF50',
     animation: `${styles.blink} 1.9s ease`,
    },
  }}
/>
  </Box>
 
</Box>

      {/* Korak 1 */}
      {currentStep === 1 && (
         <div className={styles.formContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className={styles.formGroup}>
            <label>Datum početka:</label>
            <DatePicker
              value={startDate} // ili selected={startDate} za `react-datepicker`
              onChange={(date) => {
                
              setStartDate(date); // Direktno postavljamo `date`
              validateDates(date, endDate); // Proveravamo validnost datuma
             
              if (date) {
                const dateWithTime = new Date(date);
                dateWithTime.setHours(7, 0, 0, 0);
                
                // Formatirajte datum na srpskom
                const options = { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                };
                const formattedDate = dateWithTime.toLocaleDateString('sr-RS', options);
                setReservationStartMessage(`Rezervacija važi od ${formattedDate} od 7:00`);
              } else {
                setReservationStartMessage("");
              }
            }  
          }
            renderInput={(params) => <TextField {...params} fullWidth />}   
            shouldDisableDate={shouldDisableDate}
          />
   {reservationStartMessage && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: 'rgba(25, 25, 25, 0.4)',
          borderLeft: '3px solid rgba(0, 0, 0, 0.76)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {reservationStartMessage}
        </div>
    )}
          </div>

          <div className={styles.formGroup}>
            <label>Datum kraja:</label>
            <DatePicker
              value={endDate} // ili selected={endDate} za `react-datepicker`
              onChange={(date) => {
              setEndDate(date); // Direktno postavljamo `date`
              validateDates(startDate, date); // Proveravamo validnost datuma
              if (date) {
                const dateWithTime = new Date(date);
                dateWithTime.setHours(22, 0, 0, 0);
                
                // Formatirajte datum na srpskom
                const options = { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                };
                const formattedDate = dateWithTime.toLocaleDateString('sr-RS', options);
                setReservationEndMessage(`Rezervacija važi od ${formattedDate} do 22:00`);
              } else {
                setReservationEndMessage("");
              }
            }}
            
            renderInput={(params) => <TextField {...params} fullWidth />}
            shouldDisableDate={shouldDisableDate}
            />
             {reservationEndMessage && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: 'rgba(25, 25, 25, 0.4)',
          borderLeft: '3px solid rgba(0, 0, 0, 0.76)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {reservationEndMessage}
        </div>
             )}
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.formGroup}>
            <label>Broj odraslih:</label>
            <div className={styles.counterInput}>
              <button onClick={() => setAdults(adults > 1 ? adults - 1 : 1)} className={styles.counterButtonRed}>
                <FaMinus />
              </button>
              <span>{adults}</span>
              <button onClick={() => setAdults(adults + 1)} className={styles.counterButton}>
                <FaPlus />
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Broj dece:</label>
            <div className={styles.counterRow}>
            <div className={styles.counterInput}>
              <button onClick={() => setChildren(children > 0 ? children - 1 : 0)} className={styles.counterButtonRed}>
                <FaMinus />
              </button>
              <span>{children}</span>
              <button onClick={() => setChildren(children + 1)} className={styles.counterButton}>
                <FaPlus />
              </button>
            </div>
          <div className={styles.totalPrice}>
           <div>Ukupna cena: </div> <strong className={styles.priceHighlight}>{totalPrice}€</strong>
          </div>
          </div>  
          </div>
          </LocalizationProvider>
        </div>
      )}

      {/* Korak 2 */}
      {currentStep === 2 && (
        <div className={styles.formContainer}>
          <h3>Podaci o korisniku</h3>
          <div className={styles.formTwoColumns}>
          {/* <div className={styles.column}> */}
            <div className={styles.formGroup}>
  <label htmlFor="firstName">Ime:</label>
  <TextField
    id="firstName"
    fullWidth
    variant="outlined"
    placeholder="Unesite ime"
    value={userData.firstName}
    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="lastName">Prezime:</label>
  <TextField
    id="lastName"
    fullWidth
    variant="outlined"
    placeholder="Unesite prezime"
    value={userData.lastName}
    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="address">Adresa:</label>
  <TextField
    id="address"
    fullWidth
    variant="outlined"
    placeholder="Unesite adresu"
    value={userData.address}
    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="phone">Telefon:</label>
  <TextField
    id="phone"
    fullWidth
    variant="outlined"
    placeholder="Unesite broj telefona"
    value={userData.phone}
    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="emial">Email:</label>
  <TextField
    id="email"
    fullWidth
    variant="outlined"
    placeholder="Unesite email"
    value={userData.email}
    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="confirmEmail">Potvrdite e-mail:</label>
  <TextField
    id="confirmEmail"
    fullWidth
    variant="outlined"
    placeholder="Potvrdite e-mail adresu"
    value={userData.confirmEmail}
    onChange={(e) => setUserData({ ...userData, confirmEmail: e.target.value })}
  />
</div>
<div className={styles.formGroup}>
  <label htmlFor="additionalInfo">Ddatni opis:</label>
  <TextField
    id="additionalInfo"
    fullWidth
    variant="outlined"
    placeholder="Dodatnr napomene ili zahtevi"
    value={userData.additionalInfo}
    onChange={(e) => setUserData({ ...userData, additionalInfo: e.target.value })}
  />
              </div>
            </div>
          </div>
            )}

      {/* Korak 3 */}
      {currentStep === 3 && (
   <div className={styles.formContainer}>
    <h3>Forma 3: Potvrda rezervacije i realizacija plaćanja</h3>
    <p>Pregled rezervacije:</p>
    <ul className={styles.summaryList}>
      <li><strong>Početak:</strong> {startDate?.toLocaleDateString()}</li>
      <li><strong>Kraj:</strong> {endDate?.toLocaleDateString()}</li>
      <li><strong>Odrasli:</strong> {adults}</li>
      <li><strong>Deca:</strong> {children}</li>
      <li className={styles.totalPrice}>
      <strong>UKUPNO:</strong> <span className={styles.priceHighlight}>{totalPrice}€</span>
    </li>
    </ul>

    <div className={styles.paymentSection}>
      <h4>Izaberite način plaćanja:</h4>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name="paymentOption"
            value="odmah"
            checked={paymentOption === 'odmah'}
            onChange={() => setPaymentOption('odmah')}
          />
          Platiti odmah
        </label>
        <label>
          <input
            type="radio"
            name="paymentOption"
            value="naknadno"
            checked={paymentOption === 'naknadno'}
            onChange={() => setPaymentOption('naknadno')}
          />
          Platiti naknadno
        </label>
      </div>

      {/* Ako korisnik odabere "platiti odmah", prikaži dodatne opcije za plaćanje */}
      {paymentOption === 'odmah' && (
        <div className={styles.prePaymentForm}>
          <h4>Detalji za plaćanje unapred:</h4>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Broj kartice:</label>
            <TextField
              id="cardNumber"
              fullWidth
              variant="outlined"
              placeholder="Unesite broj kartice"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">Datum isteka:</label>
            <TextField
              id="expiryDate"
              fullWidth
              variant="outlined"
              placeholder="MM/GG"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cvv">CVV:</label>
            <TextField
              id="cvv"
              fullWidth
              variant="outlined"
              type="password"
              placeholder="Unesite CVV kod"
            />
          </div>
        </div>
      )}
    </div>
  </div>
)}


      {/* Dugmad za navigaciju */}
      <div className={styles.buttonRow}>
  {currentStep > 1 && currentStep < 3 && (
    <Button
      className={styles.equalButton}
      variant="outlined"
      onClick={() => setCurrentStep(currentStep - 1)}
    >
      Nazad
    </Button>
  )}

  {currentStep < 3 && (
    <Tooltip title={error || 'Unesite ispravne datume'}>
      <span className={styles.equalButton}>
       {/*<Button
          className={`${styles.equalButton} ${styles.submitButton}`}
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleNextStep}
          disabled={!startDate || !endDate || !!error}
          fullWidth
        >
          Sledeći korak
        </Button>*/}
        <Button
          className={`${styles.equalButton} ${styles.submitButton} ${
          (!startDate || !endDate || new Date(startDate) > new Date(endDate)) ? styles.disabledNextButton : ''
          }`}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleNextStep}
            disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
            fullWidth
             > 
             Sledeći korak
            </Button>
      </span>
    </Tooltip>
  )}

  {currentStep === 3 && (
    <Button
    className={`${styles.equalButton} ${styles.finishButton}`}
      variant="contained"
      color="primary"
      onClick={handleConfirmReservation1}
    >
      Potvrdi rezervaciju
    </Button>
  )}

  <Button
    className={`${styles.equalButton} ${styles.cancelButton}`}
    onClick={() => setFormVisible(false)}
  >
    Odustani
  </Button>
</div>

</div>
    </div>

)}

    </div>
  );
};

export default ReservationPage;
