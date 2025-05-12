import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './ReservationPage.module.css';
import Tooltip from '@mui/material/Tooltip';

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room } = location.state || {};
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [adults, setAdults] = useState(1);
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
    if (new Date(start) > new Date(end)) {
      setError("Datum početka ne može biti veći od datuma kraja.");
    } else {
      setError(""); // Resetuj grešku ako su datumi ispravni
    }
  };
  

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
          <div className={`${styles.roomText} ${showMore ? styles.scrollText : ""}`}>
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
      <div className={styles.stepIndicator}>
        <div className={styles.steps}>
          <div
            className={`${styles.step} ${currentStep >= 1 ? styles.completed : ''}`}
            onClick={() => handleStepClick(1)}
          >
            <span>1</span>
          </div>
          <div
            className={`${styles.step} ${currentStep >= 2 ? styles.completed : ''}`}
            onClick={() => handleStepClick(2)}
          >
            <span>2</span>
          </div>
          <div
            className={`${styles.step} ${currentStep >= 3 ? styles.completed : ''}`}
            onClick={() => handleStepClick(3)}
          >
            <span>3</span>
          </div>
        </div>
      </div>

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
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          </div>
          <div className={styles.formGroup}>
            <label>Datum kraja:</label>
            <DatePicker
              value={endDate} // ili selected={endDate} za `react-datepicker`
              onChange={(date) => {
              setEndDate(date); // Direktno postavljamo `date`
              validateDates(startDate, date); // Proveravamo validnost datuma
              }}
            renderInput={(params) => <TextField {...params} fullWidth />}
            />
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
            <div className={styles.counterInput}>
              <button onClick={() => setChildren(children > 0 ? children - 1 : 0)} className={styles.counterButtonRed}>
                <FaMinus />
              </button>
              <span>{children}</span>
              <button onClick={() => setChildren(children + 1)} className={styles.counterButton}>
                <FaPlus />
              </button>
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
    <ul>
      <li><strong>Početak:</strong> {startDate?.toLocaleDateString()}</li>
      <li><strong>Kraj:</strong> {endDate?.toLocaleDateString()}</li>
      <li><strong>Odrasli:</strong> {adults}</li>
      <li><strong>Deca:</strong> {children}</li>
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
        <Button
          className={`${styles.equalButton} ${styles.submitButton}`}
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleNextStep}
          disabled={!startDate || !endDate || !!error}
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
      onClick={handleConfirmReservation}
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
