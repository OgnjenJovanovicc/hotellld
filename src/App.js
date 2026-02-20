import React, { useState, useRef, useEffect, useCallback   } from "react";
import axios from "axios";
import { useNavigate,BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { FaEnvelope, FaSignInAlt, FaSignOutAlt  } from "react-icons/fa";
import Header from './components/Header';
import Slider from './components/Slider';
import AboutSection from './components/AboutSection';
import RoomsSection from './components/RoomsSection';
import AuthModal from './components/AuthModal';
import ContactSection from './components/ContactSection';
import AdminRoom from "./AdminRoom";
import ReservationPage from './ReservationPage';
import AdminPanel from './components/AdminPanel';
import { ToastContainer,toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';


const rooms = [

];
//TEST

const minRoomPrice = 0;
const maxRoomPrice = 680;

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const detailsRef = useRef(null);
  const hotelimage='./assest/hotelimage.png';
  const reservation = './assest/reservation.jpg';

  const backgroundImages = [
  "/assest/slika9.jpg",
  "/assest/slika4.jpg",
  "/assest/ognjen.jpg",
  "/assest/slika6.jpg",
  "/assest/slika10.jpg",
  "/assest/slika11.jpg",
  "/assest/slika7.jpg"
];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);

     const email= formData.get("email");
    const emailRegex = /^[\w.-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
    if(!emailRegex.test(email)) { 
    toast.error("Unesite ispravnu email format.");
    return;
    }
    const password = formData.get("sifra");
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,}$/;
   if(!passwordRegex.test(password)) {  
    toast.error("Šifra mora imati najmanje 8 karaktera, uključujući veliko slovo i specijalni karakter.");
    return;
  }
    const user = {
      ime: formData.get("ime"),
      prezime: formData.get("prezime"),
      telefon: formData.get("telefon"),
      email: email,
      sifra: password,
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
      toast.error("Došlo je do greške prilikom registracije, proverite uneste podatke!!!.");
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
        setUser(newUser); 
        localStorage.setItem("user", JSON.stringify(newUser));
        setIsModalOpen(false); 
        toast.success("Uspešno prijavljen korisnik!");
      }
    } catch (error) {
      console.error("Greška prilikom prijave:", error);
      toast.warning("Pogrešan email ili šifra.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user"); 
    setUser(null);
    toast.info("Uspešno ste se odjavili.");
  };

  useEffect(() => {
    AOS.init({ duration: 1000,once: false});

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); 

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


useEffect(() => {
  setIsLoading(true); 
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
      setTimeout(() => setIsLoading(false), 2500); 
    })
    .catch(error => {
      console.error("Greška pri učitavanju soba:", error);
      setTimeout(() => setIsLoading(false), 2500); 
    });
}, []);

  const [allRooms, setAllRooms] = useState(rooms);

  const [allRoomsBackup, setAllRoomsBackup] = useState([]);

/*
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
  }, []);*/

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

      setAllRooms(allRoomsBackup);
    }

  }, [filters.startDate, filters.endDate]);

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
      
      if (filters.maxPrice && Number(room.price) > Number(filters.maxPrice)) return false;
     
      if (filters.capacity && Number(room.capacity) < Number(filters.capacity)) return false;
      
      if (filters.rating && room.reviews && Number(room.reviews.rating) < Number(filters.rating)) return false;
      
      if (filters.amenities.length > 0) {
        
        const roomAmenities = Array.isArray(room.amenities)
          ? room.amenities.map(x => String(x).toLowerCase().replace(/-/g, '').replace(/\s/g, ''))
          : [String(room.amenities || '').toLowerCase().replace(/-/g, '').replace(/\s/g, '')];
        for (let a of filters.amenities) {
          const normA = a.toLowerCase().replace(/-/g, '').replace(/\s/g, '');
          if (!roomAmenities.some(amen => amen.includes(normA))) return false;
        }
      }   
      if (filters.startDate && filters.endDate) {
        if (Array.isArray(room.bookings)) {
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
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

  const handlePriceRangeChangeOld = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      let max = Number(prev.maxPrice);
      if (name === 'maxPrice') {
        max = Math.max(Number(value), minRoomPrice + 1);
      }

      max = Math.min(maxRoomPrice, Math.max(max, minRoomPrice + 1));
      return { ...prev, maxPrice: max };
    });
  };

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <svg className="loader-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 44C32 44 32 24 52 24C52 24 44 44 32 44Z" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 44C32 44 32 24 12 24C12 24 20 44 32 44Z" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 44V54" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  return (
    <>
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
            <AboutSection className="fade-in" images={[hotelimage, reservation]} />
            <div className="rooms-layout" style={{ display: 'flex', alignItems: 'center', gap: '48px', maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
              {/* Sidebar filteri */}
              <aside className="filter-sidebar" style={{ minWidth: 340, maxWidth: 400, background: 'linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)', borderRadius: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.13)', padding: '36px 24px', paddingLeft: '40px', marginLeft: '32px', alignSelf: 'center', backdropFilter: 'blur(8px)', border: '1.5px solid #e5e7eb', position: 'relative' }}>
                <h2 style={{ fontSize: 26, marginBottom: 22, color: '#222', fontWeight: 700, letterSpacing: '1px', textAlign: 'center', fontFamily: 'Inter, Playfair Display, serif' }}>Filtriraj sobe</h2>
                <form className="filter-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Cena po noći */}
                  <div className="filter-modal-group" style={{ marginBottom: 18 }}>
                    <label className="filter-modal-label" style={{ fontWeight: 600, fontSize: 17, color: '#222', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="novac" style={{ fontSize: 22, color: '#d4af37' }}>💶</span>
                      Maksimalna cena po noći
                    </label>
                    <div className="price-slider-wrapper" style={{ marginTop: 8 }}>
                      <span style={{ color: '#888', fontSize: 15, minWidth: 32, alignSelf: 'flex-end' }}>{minRoomPrice} €</span>
                      <div className="price-slider-bubble" style={{ left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#d4af37', fontWeight: 700, fontSize: 20, borderRadius: 18, border: '2px solid #d4af37', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', minWidth: 70 }}>{filters.maxPrice} €</div>
                      <input type="range" name="maxPrice" min={minRoomPrice} max={maxRoomPrice} value={filters.maxPrice} onChange={handlePriceRangeChange} className="price-slider" style={{ accentColor: '#d4af37', width: '100%' }} />
                      <span style={{ color: '#888', fontSize: 15, minWidth: 32, alignSelf: 'flex-end' }}>{maxRoomPrice} €</span>
                    </div>
                  </div>
                  {/* Kapacitet */}
                  <div className="filter-modal-group">
                    <label className="filter-modal-label" style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Kapacitet:</label>
                    <input type="number" name="capacity" min="1" value={filters.capacity} onChange={handleFilterChange} className="filter-modal-input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, marginBottom: 2, background: '#f3f4f6', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }} />
                  </div>
                  {/* Period boravka */}
                  <div className="filter-modal-group">
                    <label className="filter-modal-label" style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Datum početka:</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="filter-modal-input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', marginBottom: 2 }} />
                  </div>
                  <div className="filter-modal-group">
                    <label className="filter-modal-label" style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Datum završetka:</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="filter-modal-input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', marginBottom: 2 }} />
                  </div>
                  {/* Pogodnosti */}
                  <div className="filter-modal-group">
                    <label className="filter-modal-label" style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Usluge i pogodnosti:</label>
                    <div className="filter-modal-amenities" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {amenityOptions.map((a) => (
                        <label key={a.label} className={`filter-modal-amenity${filters.amenities.includes(a.label) ? ' active' : ''}`} title={a.tooltip} style={{ background: filters.amenities.includes(a.label) ? '#d4af37' : '#f3f4f6', color: filters.amenities.includes(a.label) ? '#fff' : '#444', borderRadius: 8, padding: '7px 14px', border: '1px solid #e5e7eb', fontSize: 16, fontWeight: 500, cursor: 'pointer', transition: 'background 0.18s, color 0.18s' }}>
                          <input type="checkbox" name="amenities" value={a.label} checked={filters.amenities.includes(a.label)} onChange={handleFilterChange} style={{ marginRight: 7 }} />
                          <span className="filter-modal-amenity-icon" style={{ fontSize: 18 }}>{a.icon}</span>
                          <span>{a.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Ocena - zvezdice */}
                  <div className="filter-modal-group">
                    <label className="filter-modal-label" style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Ocena sobe:</label>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} onClick={() => setFilters(prev => ({ ...prev, rating: star === Number(prev.rating) ? '' : star }))} style={{ fontSize: 26, color: star <= Number(filters.rating) ? '#d4af37' : '#bbb', cursor: 'pointer', transition: 'color 0.18s', userSelect: 'none', filter: star <= Number(filters.rating) ? 'drop-shadow(0 1px 2px #d4af3740)' : 'none' }} title={star + ' zvezdica' + (star > 1 ? 'e' : '')}>★</span>
                      ))}
                      <span onClick={() => setFilters(prev => ({ ...prev, rating: '' }))} style={{ fontSize: 15, color: '#888', marginLeft: 10, cursor: 'pointer', textDecoration: filters.rating === '' ? 'underline' : 'none', alignSelf: 'center' }}>bilo koja</span>
                    </div>
                  </div>
                  {/* Aktivni filteri kao chips */}
                  <div className="filter-modal-chips-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                    {filters.capacity && (<span className="filter-modal-chip" title="Kapacitet" style={{ background: '#e0e7ef', color: '#222', borderRadius: 14, padding: '5px 14px', fontWeight: 500 }}>👥 {filters.capacity}</span>)}
                    {filters.amenities.map(a => { const found = amenityOptions.find(opt => opt.label === a); return (<span className="filter-modal-chip" key={a} title={found?.tooltip || a} style={{ background: '#d4af37', color: '#fff', borderRadius: 14, padding: '5px 14px', fontWeight: 500 }}>{found?.icon || '✔️'} {a}</span>); })}
                    {filters.rating && (<span className="filter-modal-chip" title="Ocena" style={{ background: '#e0e7ef', color: '#222', borderRadius: 14, padding: '5px 14px', fontWeight: 500 }}>⭐ {filters.rating}+</span>)}
                    {filters.maxPrice !== maxRoomPrice && (<span className="filter-modal-chip" title="Maksimalna cena" style={{ background: '#e0e7ef', color: '#222', borderRadius: 14, padding: '5px 14px', fontWeight: 500 }}>💶 {filters.maxPrice} €</span>)}
                  </div>
                  {/* Broj rezultata */}
                  <div className="filter-modal-results-count" style={{ textAlign: 'center', fontSize: 16, color: '#2563eb', fontWeight: 600, margin: '12px 0 8px 0' }}>Pronađeno soba: <b>{filteredRooms.length}</b></div>
                  <div className="filter-modal-actions" style={{ display: 'flex', gap: 14, marginTop: 10, justifyContent: 'center' }}>
                    <button type="button" className="add-room-button filter-modal-apply" onClick={handleFilterReset} style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '10px 22px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>Resetuj</button>
                  </div>
                </form>
              </aside>
              {/* Mreža soba */}
              <div style={{ flex: 1, minWidth: 0 }}>
                            {user?.role === 'admin' && (
                <div className="admin-room-button-wrapper">
                  <button className="add-room-button" onClick={() => setShowAddRoomForm(true)}>
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
              </div>
            </div>
            <ContactSection className="fade-in" />
          </main>

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
                    <button onClick={handleAdminRoomClose} style={{ position: "absolute", top: 12, right: 12, fontSize: 32, fontWeight: 300, background: "#f0f0f0", border: "2px solid #e0e0e0", cursor: "pointer", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.target.style.background = "#ff6b6b"; e.target.style.borderColor = "#ff6b6b"; e.target.style.color = "#fff"; }} onMouseLeave={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.borderColor = "#e0e0e0"; e.target.style.color = "#333"; }}>×</button>
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
      {/* Line 697 omitted */}
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
    </Routes>
    </>
  );
}

export default App;