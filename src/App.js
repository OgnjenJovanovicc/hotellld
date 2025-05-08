
import React, { useState, useRef, useEffect  } from "react";
import axios from "axios";
import { useNavigate,BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { FaEnvelope, FaSignInAlt, FaSignOutAlt  } from "react-icons/fa";
import Header from './components/Header';
import Slider from './components/Slider';
import AboutSection from './components/AboutSection';
import RoomsSection from './components/RoomsSection';
import AuthModal from './components/AuthModal';
import ContactSection from './components/ContactSection';

// Importujte slike za sobe
import krevet1 from './assest/krevet1.webp';
import krevet23 from './assest/krevet23.webp';
import economic from './assest/economic.webp';
import viewroom from './assest/planinasoba.webp';
import pethouse from './assest/penthouse.webp';
import petfriendly from './assest/petfrindly.avif';
import rooms1 from './assest/rooms.jpg';
import sobax from './assest/sobax .jpg';
import family from './assest/family.webp';
import hotelimage from'./assest/hotelimage.png';
import reservation from './assest/reservation.jpg';
import background1 from './assest/slika1.webp';
import background2 from './assest/slika2.webp';
import background3 from './assest/slika3.webp';
import background4 from './assest/hotel.webp';
import ReservationPage from './ReservationPage';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [user, setUser] = useState(null);
  const detailsRef = useRef(null);
  const backgroundImages = [background1, background2, background3, background4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const user = {
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      telefon: formData.get("telefon"),
      email: formData.get("email"),
      sifra: formData.get("sifra"),
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/users", user);
      if (response.status === 201) {
        alert("Uspešno registrovan korisnik!");
        setIsLoginForm(true);
      } else {
        alert("Došlo je do greške prilikom registracije.");
      }
    } catch (error) {
      console.error("Greška prilikom registracije:", error);
      alert("Došlo je do greške prilikom registracije.");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {
      email: formData.get("email"),
      sifra: formData.get("sifra"),
    };
    
    try {
      const response = await axios.post("http://localhost:5000/api/login", loginData);
      
      if (response.data) {
        const newUser = {
          email: loginData.email,
          sifra: loginData.sifra,
        };
  
        setUser(newUser); // Ažuriraj stanje korisnika
        console.log("User state after login:", newUser);
        setIsModalOpen(false); // Zatvori modal
        alert("Uspešno prijavljen korisnik!");
      }
    } catch (error) {
      console.error("Greška prilikom prijave:", error);
      alert("Pogrešan email ili šifra.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    alert("Uspešno ste se odjavili.");
  };

  useEffect(() => {
    AOS.init({ duration: 1000,once: false});
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Menjanje slajdova svakih 5 sekundi

    return () => clearInterval(interval); // Čišćenje intervala
  }, [backgroundImages.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const rooms = [
    {
      id: 1,
      img: krevet1,
      title: "Soba 1",
      description: "-Luksuzna soba sa jednim velikim krevetom i prelepim pogledom.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
      longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa"
    },
    {
      id: 2,
      img: krevet23,
      title: "Soba 2",
      description: "Prostrana soba sa dva kreveta, idealna za porodice.",
    },
    {
      id: 3,
      img: economic,
      title: "Soba 3",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 4,
      img: viewroom,
      title: "Soba 4",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 5,
      img: pethouse,
      title: "Soba 5",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 6,
      img: petfriendly,
      title: "Soba 6",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 7,
      img: rooms1,
      title: "Soba 7",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 8,
      img: sobax,
      title: "Soba 8",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
    {
      id: 9,
      img: family,
      title: "Soba 9",
      description: "Ekonomična soba za kratke boravke, udobna i funkcionalna.",
    },
  ];

  const handleDetails = (room) => {
    setSelectedRoom(room);
    if (room && detailsRef?.current) {
      setTimeout(() => {
        detailsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200); // Scroll after rendering the selected room
    }
  };

  const handleReserve = (room) => {
    if (user) {
      navigate('/reservation', { state: { room } });
    } else {
      alert('Morate se prijaviti da biste rezervisali sobu.');
    }
  };

  const onReserve = (room) => {
    if (user) {
      navigate('/reservation', { state: { room } });
    } else {
      alert('Morate se prijaviti da biste rezervisali sobu.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
{

return (
  <Routes>
    {/* Glavna stranica */}
    <Route
      path="/"
      element={
        <div className="App">
           <Header user={user} openModal={() => setIsModalOpen(true)} handleLogout={handleLogout} />
    <Slider 
      backgroundImages={backgroundImages} 
      currentIndex={currentIndex} 
      handleNext={() => setCurrentIndex((currentIndex + 1) % backgroundImages.length)}
      handlePrev={() => setCurrentIndex((currentIndex - 1 + backgroundImages.length) % backgroundImages.length)} 
      goToSlide={setCurrentIndex}
    />
          <main>
          <AboutSection className="fade-in" images={[
       hotelimage,reservation
      ]
      } />
            <RoomsSection className="rooms-section fade-in"
              rooms={rooms}
              handleDetails={handleDetails}
              selectedRoom={selectedRoom}
              detailsRef={detailsRef}
              user={user}
              onReserve={onReserve}
            />
            <ContactSection className="fade-in" />
          </main>
          {isModalOpen && (
            <AuthModal
              isLoginForm={isLoginForm}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
              setIsModalOpen={setIsModalOpen}
              setIsLoginForm={setIsLoginForm}
              closeModal={closeModal}
            />
          )}
        </div>
      }
    />

    {/* Stranica za rezervacije */}
    <Route path="/reservation" element={<ReservationPage />} />
  </Routes>
);
}
}
export default App;
