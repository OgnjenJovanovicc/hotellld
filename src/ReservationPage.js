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
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const room = state?.room;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservationStartMessage, setReservationStartMessage] = useState("");
  const [reservationEndMessage, setReservationEndMessage]=useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [adults, setAdults] = useState(1);
  const [total_price,setTotalPrice]=useState(0);
const [bookedDates, setBookedDates] = useState([]); 
const [unitsPerDay, setUnitsPerDay] = useState({}); 
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
  const [unitsReserved, setUnitsReserved] = useState(1); 
  const [maxAvailable, setMaxAvailable] = useState(null); 
  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [cardError, setCardError] = useState('');
  const roomType = room?.room_type || room?.type;


const shouldDisableDate = (date) => {
  if (!unitsPerDay) return false;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const info = unitsPerDay[dateStr];
  return info && info.reserved >= info.total && info.total > 0;
};
  
useEffect(() => {
  const typeForFetch = room?.room_type || room?.type;
  if (!typeForFetch) return;
  const fetchUnitsPerDay = async () => {
    try {
    
      const today = new Date();
      const from = today.toISOString().split('T')[0];
      const toDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
      const to = toDate.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5000/api/reservations/${typeForFetch}/units-per-day?from=${from}&to=${to}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUnitsPerDay(data);
    } catch (error) {
      console.error('Greška prilikom učitavanja zauzetosti po danu:', error);
    }
  };
  fetchUnitsPerDay();
}, [room?.room_type, room?.type]);


useEffect(() => {
  const fetchMaxAvailable = async () => {
    if (!roomType || !startDate || !endDate) return;
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/available-count?room_type=${encodeURIComponent(roomType)}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`);
      if (!response.ok) throw new Error('Ne mogu da dobijem broj slobodnih soba');
      const data = await response.json();
      setMaxAvailable(data.availableCount);
      setUnitsReserved(prev => Math.min(prev, data.availableCount));
    } catch (e) {
      setMaxAvailable(null);
    }
  };
  fetchMaxAvailable();
}, [roomType, startDate, endDate]);
 
  const handleConfirmReservation1 = async () => {
    try {
      let  placeno = false;
      if (!room?.id || !startDate || !endDate || !userData.firstName || !userData.email) {
        throw new Error('Nedostaju obavezni podaci za rezervaciju');
      }
      if (!unitsReserved || unitsReserved < 1) {
        throw new Error('Morate izabrati broj soba');
      }
      if (maxAvailable !== null && unitsReserved > maxAvailable) {
        throw new Error('Nema dovoljno slobodnih soba za izabrani period');
      }
      
      if (paymentOption === 'odmah') {
        // Validacija kartice
        const { cardNumber, expiryDate, cvv } = cardData;
        if (!cardNumber.match(/^\d{16}$/)) {
          setCardError('Broj kartice mora imati 16 cifara');
          return;
        }
        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)) {
          setCardError('Datum isteka mora biti u formatu MM/YY');
          return;
        }
        if (!cvv.match(/^\d{3}$/)) {
          setCardError('CVV mora imati 3 cifre');
          return;
        }
        setCardError('');
        placeno = true;
        
      }
      const getLocalDateString = (date) => {
        if (!(date instanceof Date)) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: room.id,
          start_date: getLocalDateString(startDate),
          end_date: getLocalDateString(endDate),
          adults,
          children,
          guest_info: userData,
          units_reserved: unitsReserved,
          placeno : placeno,
          ...(placeno ? { payment: cardData } : {})
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Došlo je do greške pri čuvanju rezervacije');
      }
      toast.success(`Rezervacija uspešno sačuvana! Broj rezervacije: ${data.reservation_id}`);
      setFormVisible(false);
    } catch (error) {
      console.error('Greška:', error);
      toast.error(error.message || 'Došlo je do greške pri čuvanju rezervacije. Pokušajte ponovo.');
    }
  };
  
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
      toast.warning('Molimo vas da popunite sve podatke u koraku 1!');
      return;
    }
    if (currentStep === 2 && (!userData.firstName || !userData.lastName || !userData.email || userData.email !== userData.confirmEmail)) {
      toast.warning('Molimo vas da popunite sve podatke u koraku 2 i proverite da li su e-mail adrese iste!');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleConfirmReservation = () => {
    toast.info(
      `Rezervacija potvrđena!\nPočetak: ${startDate?.toLocaleDateString()}\nKraj: ${endDate?.toLocaleDateString()}\nOdrasli: ${adults}\nDeca: ${children}`
    );
    setFormVisible(false);
  };

 
  const handleStepClick = (step) => {
    setCurrentStep(step);
  };
 
  const validateDates = (start, end) => {
    if (start && end && new Date(start) > new Date(end)) {
      setError("Datum početka ne može biti veći od datuma kraja.");
      return;
    }
  
    if (start && end && unitsPerDay) {
      let d = new Date(start);
      const endD = new Date(end);
      let foundFullyBooked = false;
      while (d <= endD) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const info = unitsPerDay[dateStr];
        if (info && info.reserved >= info.total && info.total > 0) {
          foundFullyBooked = true;
          break;
        }
        d.setDate(d.getDate() + 1);
      }
      if (foundFullyBooked) {
        setError("Izabrani opseg sadrži dan koji je potpuno rezervisan. Molimo izaberite drugi opseg.");
        return;
      }
    }
    setError(""); 
  };
  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 
    const pricePerNight = room?.price || 50;
    return unitsReserved * pricePerNight * daysDiff;
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
                value={startDate}
                onChange={(date) => {
                  if (date instanceof Date && !isNaN(date)) {
                    const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    setStartDate(onlyDate);
                    validateDates(onlyDate, endDate);
                    const options = { day: 'numeric', month: 'long', year: 'numeric' };
                    const formattedDate = onlyDate.toLocaleDateString('sr-RS', options);
                    setReservationStartMessage(`Rezervacija važi od ${formattedDate} od 18:00`);
                  } else {
                    setStartDate(null);
                    setReservationStartMessage("");
                  }
                }}
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
                value={endDate}
                onChange={(date) => {
                  if (date instanceof Date && !isNaN(date)) {
                    const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    setEndDate(onlyDate);
                    validateDates(startDate, onlyDate);
                    const options = { day: 'numeric', month: 'long', year: 'numeric' };
                    const formattedDate = onlyDate.toLocaleDateString('sr-RS', options);
                    setReservationEndMessage(`Rezervacija važi do ${formattedDate} do 15:00`);
                  } else {
                    setEndDate(null);
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
              <label>Broj soba:</label>
              <div className={styles.counterInput}>
                <button
                  onClick={() => setUnitsReserved(Math.max(1, unitsReserved - 1))}
                  className={styles.counterButtonRed}
                  disabled={unitsReserved <= 1}
                >
                  <FaMinus />
                </button>
                <span>{unitsReserved}</span>
                <button
                  onClick={() => setUnitsReserved(Math.min((maxAvailable || 1), unitsReserved + 1))}
                  className={styles.counterButton}
                  disabled={maxAvailable !== null && unitsReserved >= maxAvailable}
                >
                  <FaPlus />
                </button>
              </div>
              {maxAvailable !== null && (
                <div style={{ color: maxAvailable > 0 ? 'green' : 'red', fontSize: 13, marginTop: 4 }}>
                  Slobodno soba za izabrani period: <b>{maxAvailable}</b>
                </div>
              )}
            </div>
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
      <li><strong>Broj soba:</strong> {unitsReserved}</li>
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
              value={cardData.cardNumber}
              onChange={e => setCardData({ ...cardData, cardNumber: e.target.value.replace(/\D/g, '') })}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">Datum isteka:</label>
            <TextField
              id="expiryDate"
              fullWidth
              variant="outlined"
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={e => setCardData({ ...cardData, expiryDate: e.target.value })}
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
              value={cardData.cvv}
              onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
            />
          </div>
          {cardError && <div style={{ color: 'red', marginTop: 8 }}>{cardError}</div>}
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
   <ToastContainer 
   closeButton={false}
   autoClose={1500}/>
    </div>
  );
};

export default ReservationPage;
