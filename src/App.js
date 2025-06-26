import React, { useState, useRef, useEffect, useCallback   } from "react";
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
import AdminRoom from "./AdminRoom";

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
import { ToastContainer,toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Pomeri rooms van funkcije App
const rooms = [
  {
    id: 1,
    img: krevet1,
    room_number: 100,
    title: "Soba 1",
    type:"Luksuz",
    capacity:5,
    description: "-Luksuzna soba sa jednim velikim krevetom i prelepim pogledom.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 45,
    weekendPrice: 55,
    discount: "10% za 7+ noći",
    reviews: {
      rating: 4.8,
      count: 120,
      comment: "Savršena lokacija i veoma čisto!",
    },
    amenities: [
      "🛏️ King size krevet",
      "📶 Besplatan Wi-Fi",
      "🚿 Privatno kupatilo",
      "🍳 Doručak uključen"
    ]
  },


  {
    id: 2,
    img: krevet23,
    room_number: 120,
    title: "Soba 2",
    type:"Clasic",
    capacity:4,
    description: "-Klasicna soba sa jednim dva kreveta i prelepim pogledom.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 35,
    weekendPrice: 40,
    discount: "10% za 7+ noći",
    reviews: {
      rating: 4.5,
      count: 120,
      comment: "Savršena lokacija i veoma čisto!",
    },
    amenities: [
      "🛏️ King size krevet",
      "📶 Besplatan Wi-Fi",
      "🚿 Privatno kupatilo",
      "🍳 Doručak uključen"
    ]
    },
    {
      id: 10,
      img: economic,
      room_number: 130,
      title: "Soba 3",
      type:"Jednokrevetna",
      capacity:5,
      description: "-Luksuzna soba sa jednim krevetom i prelepim pogledom.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
      longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
      price: 25,
    weekendPrice: 30,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.6,
    count: 120,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen"
  ]
  },
  {
    id: 4,
    img: viewroom,
    room_number: 140,
    title: "Soba 4",
    type:"Trokrevetna",
    capacity:5,
    description: "-Luksuzna soba sa tri velika kreveta i prelepim pogledom.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 45,
    weekendPrice: 50,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.7,
    count: 120,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen"
  ]
  },
  {
    id: 5,
    img: pethouse,
    room_number: 150,
    title: "Soba 5",
    type:"penthous",
    capacity:8,
    description: "-PENTHOUSE.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 100,
    weekendPrice: 120,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 50,
    count: 26,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "🛏️ King size krevet",
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen",
    "💪 Teretana"
  ]
  },
  {
    id: 6,
    img: petfriendly,
     room_number: 160,
    title: "Soba 6",
    type:"Dvokrevetna",
    capacity:4,
    description: "-Dvokrevetan soba.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 35,
    weekendPrice: 40,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.5,
    count: 86,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "🛏️ King size krevet",
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen",
  ]
  },
  {
    id: 7,
    img: rooms1,
     room_number: 170,
    title: "Soba 7",
    type:"Pet friendly",
    capacity:8,
    description: "-Pet friendly sobica.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 50,
    weekendPrice: 60,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.4,
    count: 77,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "🛏️ King size krevet",
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen",
    "💪 Teretana"
  ]
  },
  {
    id: 8,
    img: sobax,
     room_number: 180,
    title: "Soba 8",
    type:"President",
    capacity:8,
    description: "-PRESIDENT.\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:"Prostrana soba sa dva kreveta, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 200,
    weekendPrice: 220,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.9,
    count: 5,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "🛏️ King size krevet",
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen",
    "💪 Teretana"
  ]
  },
  {
    id: 9,
    img: family,
    room_number: 190,
    title: "Student",
    type:"penthous",
    capacity:8,
    description: "Studentska soba\n-Ovo je proba za koju mi je potreban neki tekst bez veze,razumes bto,tuki moj razumes a razymessssss, \n-ako dodje do sranja on je moj",
    longDescription:" DA SE PRESPAVA SAMO, idealna za porodice koje žele komfor i privatnost. Opremljena je klima uređajem, radnim stolom, velikim garderoberom i pametnim TV-om. Pogodna za duži boravak i poseduje prelep pogled na vrt.\n aaa aaaaaa aaaaaaaaaa aaaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaa aaaaaa aa\naaaaa aaaaaaaaaaaaa aaaaa aaa aaaa aaaaa aaaaaa aaa aaaaaaa aaaa aaaa aa aaa aaaaaa\n aaaa aaaaaa aaaa aaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaa aaaaaaa aaaa aaaaa aaa aaaaaa",
    price: 20,
    weekendPrice: 25,
    discount: "10% za 7+ noći",
    reviews: {
     rating: 4.6,
    count: 98,
    comment: "Savršena lokacija i veoma čisto!",
  },
  amenities: [
    "📶 Besplatan Wi-Fi",
    "🚿 Privatno kupatilo",
    "🍳 Doručak uključen",
    "💪 Teretana"
  ]
  },
];

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
      role: formData.get("role"),
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/users", user);
      if (response.status === 201) {
        toast.success("Uspešno registrovan korisnik!");
        setIsLoginForm(true);
      } else {
        toast.error("Došlo je do greške prilikom registracije.");
      }
    } catch (error) {
      console.error("Greška prilikom registracije:", error);
      toast.error("Došlo je do greške prilikom registracije.");
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
          role: response.data.user.role,
        };
  
        setUser(newUser); // Ažuriraj stanje korisnika
        console.log("User state after login:", newUser);
        setIsModalOpen(false); // Zatvori modal
        toast.success("Uspešno prijavljen korisnik!");
      }
    } catch (error) {
      console.error("Greška prilikom prijave:", error);
      toast.warning("Pogrešan email ili šifra.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    toast.info("Uspešno ste se odjavili.");
  };

  useEffect(() => {
    AOS.init({ duration: 1000,once: false});
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Menjanje slajdova svakih 5 sekundi

    return () => {clearInterval(interval);
    }; 
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

  const [dynamicRooms, setDynamicRooms] = useState([]);
/*useEffect(() => {
  axios.get("http://localhost:5000/api/rooms") 
    .then(response => {
      // Spoji hardkodirane i iz baze
      setAllRooms(prev => [...prev, ...response.data]);
    })
    .catch(error => console.error("Greška:", error));
}, []);*/

useEffect(() => {
  axios.get("http://localhost:5000/api/rooms") 
    .then(response => {
      const formattedRooms = response.data.map(dbRoom => ({
        ...dbRoom,
        // Osigurajte da sve sobe imaju jedinstven id
        id: dbRoom.id || dbRoom.room_id || `db_${dbRoom.room_number}_${Date.now()}_${Math.random()}`,
        img: dbRoom.img || dbRoom.image_url,  // Fallback slika
        title: dbRoom.title || `Soba ${dbRoom.room_number}`,
        price: dbRoom.price || dbRoom.price_per_night,
        longDescription: dbRoom.long_description || dbRoom.long_description || "",
        // Ostala polja po potrebi
      }));
      setAllRooms(prev => [...prev, ...formattedRooms]);
    })
    .catch(error => {
      console.error("Greška pri učitavanju soba:", error);
      // Možete nastaviti samo sa hardkodiranim sobama u slučaju greške
    });
}, []);


  const [allRooms, setAllRooms] = useState(rooms);

  // Dodato za modal i formu za dodavanje sobe
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const initialFormState = {
    roomNumber: '',
    roomType: '',
    capacity: '',
    description: '',
    longDescription: '',
    price_per_night: '',
    amenities: '',
    image_url: '',
  };
  const [adminRoomForm, setAdminRoomForm] = useState(initialFormState);
  const handleAdminRoomChange = useCallback((field, value) => {
    setAdminRoomForm(prev => ({ ...prev, [field]: value }));
  }, []);
  const handleAdminRoomClose = useCallback(() => {
    setShowAddRoomForm(false);
    setAdminRoomForm(initialFormState);
  }, []);

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
      toast.warning('Morate se prijaviti da biste rezervisali sobu.');
    }
  };

  const onReserve = (room) => {
    if (user) {
      navigate('/reservation', { state: { room } });
    } else {
       toast.warning('Morate se prijaviti da biste rezervisali sobu.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleDeleteRoom = async (room_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${room_id}`);
      setAllRooms(prev => prev.filter(room => room.room_id !== room_id && room.id !== room_id));
      toast.success("Soba uspešno obrisana!");
    } catch (err) {
      toast.error("Greška pri brisanju sobe");
    }
  };

return (
  <Routes>
    {/* Glavna stranica */}
    <Route
      path="/"
      element={
        <div className="App">
           <Header user={user} openModal={() => setIsModalOpen(true)} handleLogout={handleLogout} />
            <ToastContainer
            closeButton={false}
            autoClose={1500}
            />
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
          {/* Dugme za dodavanje sobe za admina */}
          {user?.role === 'admin' && (
            <div className="admin-room-button-wrapper" style={{ marginBottom: 24, textAlign: 'center' }}>
              <button className="add-room-button" onClick={() => setShowAddRoomForm(true)} style={{ fontSize: 18, padding: '10px 24px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
                ➕ Dodaj novu sobu
              </button>
            </div>
          )}
            <RoomsSection className="rooms-section fade-in"
              rooms={allRooms}
              handleDetails={handleDetails}
              selectedRoom={selectedRoom}
              detailsRef={detailsRef}
              user={user}
              onReserve={onReserve}
              onRoomAdded={(newRoom) => {
                setAllRooms(prev => [
                  ...prev,
                  {
                    ...newRoom,
                    id: newRoom.id || newRoom.room_id || `form_${newRoom.room_number}_${Date.now()}_${Math.random()}`
                  }
                ]);
              }}
              onDeleteRoom={handleDeleteRoom} // Dodato prosleđivanje funkcije za brisanje
            />
            <ContactSection className="fade-in" />
          </main>
          {/* MODAL ZA DODAVANJE SOBE */}
          {user?.role === 'admin' && (
            <div className="admin-room-button-wrapper">
              <button className="add-room-button" onClick={() => setShowAddRoomForm(true)}>
                ➕ Dodaj novu sobu
              </button>
            </div>
          )}
          {showAddRoomForm && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{ position: "relative" }}>
                <button onClick={handleAdminRoomClose} style={{ position: "absolute", top: 8, right: 8, fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>×</button>
                <AdminRoom
                  formValues={adminRoomForm}
                  onFormChange={handleAdminRoomChange}
                  onRoomAdded={(newRoom) => {
                    setAllRooms(prev => [
                      ...prev,
                      {
                        ...newRoom,
                        id: newRoom.id || newRoom.room_id || `form_${newRoom.room_number}_${Date.now()}_${Math.random()}`
                      }
                    ]);
                    handleAdminRoomClose();
                  }}
                  onClose={handleAdminRoomClose}
                />
              </div>
            </div>
          )}
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

export default App;