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
/*import krevet1 from './assest/krevet1.webp';
import krevet23 from './assest/krevet23.webp';
import economic from './assest/economic.webp';
import viewroom from './assest/planinasoba.webp';
import pethouse from './assest/penthouse.webp';
import petfriendly from './assest/petfrindly.avif';
import rooms1 from './assest/rooms.jpg';
import sobax from './assest/sobax .jpg';
import family from './assest/family.webp';*/
//import hotelimage from'./assest/hotelimage.png';
//import reservation from './assest/reservation.jpg';
//import background1 from './assest/slika1.webp';
//import background2 from './assest/slika2.webp';
//import background3 from './assest/slika3.webp';
//import background4 from './assest/hotel.webp';
import ReservationPage from './ReservationPage';
import { ToastContainer,toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Pomeri rooms van funkcije App
const rooms = [
  /*{
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
*/
/*
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
    },*//*
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
  },*//*
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
  },*//*
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
  },*//*
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
  },*//*
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
  },*/
/*
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
  },*//*
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
  },*/
];

// Dodaj granice cene (možeš ih podesiti po potrebi)
const minRoomPrice = 0;
const maxRoomPrice = 680;

function App() {
  // OSTAJE SAMO OVAJ useState ZA FILTERS
  const [filters, setFilters] = useState({
    maxPrice: maxRoomPrice,
    capacity: '',
    startDate: '',
    endDate: '',
    amenities: [],
    rating: ''
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [user, setUser] = useState(() => {
    // Pokušaj da pročitaš korisnika iz localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const detailsRef = useRef(null);
  const hotelimage='./assest/hotelimage.png';
  const reservation = './assest/reservation.jpg';
  //const backgroundImages = [background1, background2, background3, background4];
  const backgroundImages = [
  "/assest/slika1.webp",
  "/assest/slika2.webp",
  "/assest/slika3.webp",
  "/assest/hotel.webp"
];
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
        // Sačuvaj korisnika u localStorage
        localStorage.setItem("user", JSON.stringify(newUser));
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
    localStorage.removeItem("user"); // Ukloni korisnika iz localStorage
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
  // State za sve sobe iz baze (za reset filtera)
  const [allRoomsBackup, setAllRoomsBackup] = useState([]);

  // Povuci sve sobe iz baze na pocetku i sacuvaj backup
  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms") 
      .then(response => {
        const formattedRooms = response.data.map(dbRoom => ({
          ...dbRoom,
          id: dbRoom.id || dbRoom.room_id || `db_${dbRoom.room_number}_${Date.now()}_${Math.random()}`,
          img: dbRoom.img || dbRoom.image_url,
          title: dbRoom.title || `Soba ${dbRoom.room_number}`,
          price: dbRoom.price || dbRoom.price_per_night,
          longDescription: dbRoom.long_description || dbRoom.long_description || "",
        }));
        setAllRooms(formattedRooms);
        setAllRoomsBackup(formattedRooms);
      })
      .catch(error => {
        console.error("Greška pri učitavanju soba:", error);
      });
  }, []);

  // Kada korisnik izabere oba datuma, povuci slobodne sobe iz backenda
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
axios.get(`http://localhost:5000/api/rooms/available?start_date=${filters.startDate}&end_date=${filters.endDate}`)        .then(res => {
          const formattedRooms = res.data.map(dbRoom => ({
            ...dbRoom,
            id: dbRoom.id || dbRoom.room_id || `db_${dbRoom.room_number}_${Date.now()}_${Math.random()}`,
            img: dbRoom.img || dbRoom.image_url,
            title: dbRoom.title || `Soba ${dbRoom.room_number}`,
            price: dbRoom.price || dbRoom.price_per_night,
            longDescription: dbRoom.long_description || dbRoom.long_description || "",
          }));
          setAllRooms(formattedRooms);
        })
        .catch(err => {
          console.error('Greška pri dohvatanju slobodnih soba:', err);
        });
    } else {
      // Ako nema oba datuma, prikazi sve sobe
      setAllRooms(allRoomsBackup);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate]);

  // Dodato za modal i formu za dodavanje sobe
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const initialFormState = {
    roomNumber: '',
    roomType: '',
    capacity: '',
    description: '',
    longDescription: '',
    price_per_night: '',
    amenities: '',
    image_url: '',
    weekendPrice: '',
    discount: '',
    reviews_rating: '',
    reviews_count: '',
    reviews_comment: ''
  };
  const [adminRoomForm, setAdminRoomForm] = useState(initialFormState);

  const handleEditRoom = (room) => {
    setIsEditMode(true);
    setRoomToEdit(room);
    setShowAddRoomForm(true);
    setAdminRoomForm({
      roomNumber: room.room_number || room.roomNumber || '',
      roomType: room.room_type || room.roomType || '',
      capacity: room.capacity || '',
      description: room.description || '',
      longDescription: room.longDescription || room.long_description || '',
      price_per_night: room.price_per_night || room.price || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : (room.amenities || ''),
      image_url: room.img || room.image_url || '',
      weekendPrice: room.weekendPrice || room.weekend_price ||'',
      discount: room.discount || '',
      reviews_rating: room.reviews?.rating || '',
      reviews_count: room.reviews?.count || '',
      reviews_comment: room.reviews?.comment || '',
      total_units: room.total_units !== undefined ? String(room.total_units) : ''
    });
  };

  const handleEditRoomSubmit = async () => {
    if (!roomToEdit) return;
    try {
      const updatedRoom = {
        room_number: adminRoomForm.roomNumber,
        room_type: adminRoomForm.roomType,
        capacity: adminRoomForm.capacity,
        description: adminRoomForm.description,
        long_description: adminRoomForm.longDescription,
        price_per_night: adminRoomForm.price_per_night,
        amenities: adminRoomForm.amenities,
        image_url: adminRoomForm.image_url,
        weekendPrice: adminRoomForm.weekendPrice,
        discount: adminRoomForm.discount,
        reviews: {
          rating: adminRoomForm.reviews_rating,
          count: adminRoomForm.reviews_count,
          comment: adminRoomForm.reviews_comment,
        },
         total_units: adminRoomForm.total_units
      };
      const id = roomToEdit.room_id || roomToEdit.id;
      const res = await axios.put(`http://localhost:5000/api/rooms/${id}`, updatedRoom);
      if (res.status === 200) {
        setAllRooms(prev => prev.map(r => (r.room_id === id || r.id === id) ? { ...r, ...updatedRoom, id: r.id, room_id: r.room_id } : r));
        toast.success('Soba uspešno izmenjena!');
        setShowAddRoomForm(false);
        setIsEditMode(false);
        setRoomToEdit(null);
        setAdminRoomForm(initialFormState);
      } else {
        toast.error('Greška pri izmeni sobe.');
      }
    } catch (err) {
      toast.error('Greška pri izmeni sobe.');
    }
  };

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState(null);

  const handleDeleteRoomClick = (room_id) => {
    setRoomIdToDelete(room_id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteRoom(roomIdToDelete);
    setShowDeleteConfirm(false);
    setRoomIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setRoomIdToDelete(null);
  };

  const [showFilterModal, setShowFilterModal] = useState(false);
  // ...existing code...

  // Ikone za pogodnosti
  const amenityOptions = [
    { label: 'Wi-Fi', icon: '📶', tooltip: 'Bežični internet' },
    { label: 'Privatno kupatilo', icon: '🚿', tooltip: 'Sopstveno kupatilo' },
    { label: 'Doručak uključen', icon: '🍳', tooltip: 'Doručak je uključen u cenu' },
    { label: 'Teretana', icon: '💪', tooltip: 'Pristup teretani' }
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value)
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Izmeni reset filtera da vraca sve sobe
  const handleFilterReset = () => {
    setFilters({ maxPrice: maxRoomPrice, capacity: '', startDate: '', endDate: '', amenities: [], rating: '' });
    setAllRooms(allRoomsBackup);
  };

  const handlePriceRangeChange = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({ ...prev, maxPrice: value }));
  };

  const filterRooms = (rooms) => {
    return rooms.filter((room) => {
      // Cena (samo maksimalna)
      if (filters.maxPrice && Number(room.price) > Number(filters.maxPrice)) return false;
      // Kapacitet
      if (filters.capacity && Number(room.capacity) < Number(filters.capacity)) return false;
      // Ocena
      if (filters.rating && room.reviews && Number(room.reviews.rating) < Number(filters.rating)) return false;
      // Pogodnosti
      if (filters.amenities.length > 0) {
        // Normalizuj na mala slova i bez crtice za upoređivanje
        const roomAmenities = Array.isArray(room.amenities)
          ? room.amenities.map(x => String(x).toLowerCase().replace(/-/g, '').replace(/\s/g, ''))
          : [String(room.amenities || '').toLowerCase().replace(/-/g, '').replace(/\s/g, '')];
        for (let a of filters.amenities) {
          const normA = a.toLowerCase().replace(/-/g, '').replace(/\s/g, '');
          if (!roomAmenities.some(amen => amen.includes(normA))) return false;
        }
      }
      // Datum dostupnosti (osnovna provera - placeholder, zameni sa pravom logikom kada budeš imao rezervacije)
      if (filters.startDate && filters.endDate) {
        // Primer: room.bookings = [{start: '2025-07-01', end: '2025-07-05'}, ...]
        if (Array.isArray(room.bookings)) {
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
          // Ako postoji preklapanje sa nekom rezervacijom, soba NIJE dostupna
          const overlaps = room.bookings.some(b => {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            return (start <= bEnd && end >= bStart);
          });
          if (overlaps) return false;
        }
      }
      return true;
    });
  };

  const filteredRooms = filterRooms(allRooms);

  // Funkcija za promenu oba klizača
  const handlePriceRangeChangeOld = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      let max = Number(prev.maxPrice);
      if (name === 'maxPrice') {
        max = Math.max(Number(value), minRoomPrice + 1);
      }
      // Ograniči opseg
      max = Math.min(maxRoomPrice, Math.max(max, minRoomPrice + 1));
      return { ...prev, maxPrice: max };
    });
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
      {/* Dugme za filtere */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <button className="add-room-button" style={{ background: '#2563eb' }} onClick={() => setShowFilterModal(true)}>
          Filtriraj sobe
        </button>
      </div>
      {/* Modal za filtere */}
      {showFilterModal && (
        <div className="filter-modal-overlay">
          <div className="filter-modal-glass">
            <button
              onClick={() => setShowFilterModal(false)}
              className="filter-modal-close"
              aria-label="Zatvori filter modal"
            >×</button>
            <h2 className="filter-modal-title">Filtriraj sobe</h2>
            <form className="filter-modal-form">
              {/* Cena po noći - lepši prikaz */}
              <div className="filter-modal-group" style={{ marginBottom: 18 }}>
                <label className="filter-modal-label" style={{ fontWeight: 600, fontSize: 16, color: '#222', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span role="img" aria-label="novac" style={{ fontSize: 20, color: '#d4af37' }}>💶</span>
                  Maksimalna cena po noći
                </label>
                <div className="price-slider-wrapper">
                  <span style={{ color: '#888', fontSize: 14, minWidth: 32, alignSelf: 'flex-end' }}>{minRoomPrice} €</span>
                  <div
                    className="price-slider-bubble"
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {filters.maxPrice} €
                  </div>
                  <input
                    type="range"
                    name="maxPrice"
                    min={minRoomPrice}
                    max={maxRoomPrice}
                    value={filters.maxPrice}
                    onChange={handlePriceRangeChange}
                    className="price-slider"
                    style={{ accentColor: '#d4af37', width: '100%' }}
                  />
                  <span style={{ color: '#888', fontSize: 14, minWidth: 32, alignSelf: 'flex-end' }}>{maxRoomPrice} €</span>
                </div>
              </div>
              {/* Kapacitet */}
              <div className="filter-modal-group">
                <label className="filter-modal-label">Kapacitet:</label>
                <input type="number" name="capacity" min="1" value={filters.capacity} onChange={handleFilterChange} className="filter-modal-input" />
              </div>
              {/* Period boravka */}
              <div className="filter-modal-group">
                <label className="filter-modal-label">Datum početka:</label>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="filter-modal-input" />
              </div>
              <div className="filter-modal-group">
                <label className="filter-modal-label">Datum završetka:</label>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="filter-modal-input" />
              </div>
              {/* Pogodnosti */}
              <div className="filter-modal-group">
                <label className="filter-modal-label">Usluge i pogodnosti:</label>
                <div className="filter-modal-amenities">
                  {amenityOptions.map((a) => (
                    <label
                      key={a.label}
                      className={`filter-modal-amenity${filters.amenities.includes(a.label) ? ' active' : ''}`}
                      title={a.tooltip}
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={a.label}
                        checked={filters.amenities.includes(a.label)}
                        onChange={handleFilterChange}
                      />
                      <span className="filter-modal-amenity-icon">{a.icon}</span>
                      <span>{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Ocena - zvezdice umesto padajućeg menija */}
              <div className="filter-modal-group">
                <label className="filter-modal-label">Ocena sobe:</label>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  {[1,2,3,4,5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setFilters(prev => ({ ...prev, rating: star === Number(prev.rating) ? '' : star }))}
                      style={{
                        fontSize: 26,
                        color: star <= Number(filters.rating) ? '#d4af37' : '#bbb',
                        cursor: 'pointer',
                        transition: 'color 0.18s',
                        userSelect: 'none',
                        filter: star <= Number(filters.rating) ? 'drop-shadow(0 1px 2px #d4af3740)' : 'none',
                      }}
                      title={star + ' zvezdica' + (star > 1 ? 'e' : '')}
                    >
                      ★
                    </span>
                  ))}
                  <span
                    onClick={() => setFilters(prev => ({ ...prev, rating: '' }))}
                    style={{
                      fontSize: 15,
                      color: '#888',
                      marginLeft: 10,
                      cursor: 'pointer',
                      textDecoration: filters.rating === '' ? 'underline' : 'none',
                      alignSelf: 'center',
                    }}
                  >
                    bilo koja
                  </span>
                </div>
              </div>
              {/* Aktivni filteri kao chips */}
              <div className="filter-modal-chips-row">
                {filters.capacity && (
                  <span className="filter-modal-chip" title="Kapacitet">👥 {filters.capacity}</span>
                )}
                {filters.amenities.map(a => {
                  const found = amenityOptions.find(opt => opt.label === a);
                  return (
                    <span className="filter-modal-chip" key={a} title={found?.tooltip || a}>{found?.icon || '✔️'} {a}</span>
                  );
                })}
                {filters.rating && (
                  <span className="filter-modal-chip" title="Ocena">⭐ {filters.rating}+</span>
                )}
                {filters.maxPrice !== maxRoomPrice && (
                  <span className="filter-modal-chip" title="Maksimalna cena">💶 {filters.maxPrice} €</span>
                )}
              </div>
              {/* Broj rezultata */}
              <div className="filter-modal-results-count">
                Pronađeno soba: <b>{filteredRooms.length}</b>
              </div>
              <div className="filter-modal-actions">
                <button
                  type="button"
                  className="add-room-button filter-modal-apply"
                  onClick={() => setShowFilterModal(false)}
                >Primeni</button>
                <button
                  type="button"
                  className="add-room-button filter-modal-reset"
                  onClick={handleFilterReset}
                >Resetuj</button>
              </div>
            </form>
          </div>
        </div>
      )}
          {/* Dugme za dodavanje sobe za admina */}
          {user?.role === 'admin' && (
            <div className="admin-room-button-wrapper" style={{ marginBottom: 24, textAlign: 'center' }}>
              <button className="add-room-button" onClick={() => setShowAddRoomForm(true)} style={{ fontSize: 18, padding: '10px 24px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
                ➕ Dodaj novu sobu
              </button>
            </div>
          )}
            <RoomsSection className="rooms-section fade-in"
              rooms={filteredRooms}
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
              onDeleteRoom={handleDeleteRoomClick}
              onEditRoom={handleEditRoom}
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
              <div style={{ position: "relative", maxHeight: 600, maxWidth: 480, width: "100%", overflowY: "auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: "32px 24px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                    setShowAddRoomForm(false);
                    setAdminRoomForm(initialFormState);
                  }}
                  onClose={handleAdminRoomClose}
                  isEditMode={isEditMode}
                  onEditRoomSubmit={handleEditRoomSubmit}
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
          {showDeleteConfirm && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000
  }}>
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: 32,
      minWidth: 280,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      textAlign: "center"
    }}>
      <p style={{ marginBottom: 24 }}>Da li ste sigurni da želite da izbrišete ovu sobu?</p>
      <button
        style={{
          marginRight: 16,
          background: "#e53e3e",
          color: "#fff",
          padding: "8px 20px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
        onClick={handleConfirmDelete}
      >
        Da
      </button>
      <button
        style={{
          background: "#eee",
          color: "#222",
          padding: "8px 20px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
        onClick={handleCancelDelete}
      >
        Ne
      </button>
    </div>
  </div>
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