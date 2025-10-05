import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './ContactSection.css';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [mapActive, setMapActive] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validacija
    const errors = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = true;
    if (!formData.message.trim()) errors.message = true;
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setShake(true);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Greška pri slanju:', error);
      toast.error(`Greška: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  return (
    <section id="contact" className="contact-section">
      <h2>Kontaktirajte nas</h2>
      <p>Imate pitanja ili želite rezervisati sobu? Javite nam se!</p>
      
      <div className="contact-container">
      <form onSubmit={handleSubmit} className={`contact-form ${shake ? 'form-shake' : ''}`}>
  <div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
    <label>Ime i prezime*</label>
    <input 
      type="text" 
      placeholder='Ime i Prezime'
      name="name" 
      value={formData.name} 
      onChange={handleChange} 
      required 
    />
            {formErrors.name && <span className="error-message">Ovo polje je obavezno</span>}
          </div>
          
          <div className={`form-group ${formErrors.email ? 'error' : ''} ${shake && formErrors.email ? 'shake' : ''}`}>
            <label>Email*</label>
            <input 
              type="email" 
              placeholder='email' 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {formErrors.email && <span className="error-message">Unesite validan email</span>}
          </div>
          
          <div className={`form-group ${formErrors.message ? 'error' : ''} ${shake && formErrors.message ? 'shake' : ''}`}>
            <label>Poruka*</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
            />
            {formErrors.message && <span className="error-message">Ovo polje je obavezno</span>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Slanje...' : 'Pošalji'}
          </button>

          {submitSuccess && (
            <div className="success-message">
              Poruka je uspešno poslata! Javićemo vam se uskoro.
            </div>
          )}
        </form>
        <div className="contact-details">
          <div className="contact-info">
            <h3>Drugi načini kontaktiranja</h3>
            <ul>
              <li>📞 <a href="tel:+381123456789">+381 12 345 6789</a></li>
              <li>✉️ <a href="mailto:ognjenjov02@gmail.com">ognjenjov02@gmail.com</a></li>
              <li><span style={{ color: '#e11d48', fontSize: '1.3em', marginRight: 6 }}>📍</span> Jovanovc, 94A, Tuđin</li>
              <li>🕒 Radno vreme: 24/7</li>
            </ul>
          </div>

          <div className="faq-section">
            <h3>Često postavljana pitanja</h3>
            <details>
              <summary>Kako otkazati rezervaciju?</summary>
              <p>Rezervaciju možete otkazati putem emaila ili u sekciji "Moje rezervacije".</p>
            </details>
            <details>
              <summary>Da li je moguća online uplata?</summary>
              <p>Da, podržavamo kreditne kartice.</p>
            </details>
          </div>

          <div className="social-media">
            <h3>Pratite nas</h3>
            <div className="social-icons">
              <a href="https://facebook.com/hotelapp"><FaFacebook/></a>
              <a href="https://instagram.com/hotelapp"><FaInstagram/></a>
              <a href="https://wa.me/381123456789"><FaWhatsapp/></a>
            </div>
          </div>
        </div>
      </div>

      <div 
  className={`map-container ${mapActive ? 'active' : ''}`} 
  onClick={() => setMapActive(true)}
>
        <iframe 
          src="https://www.google.com/maps?q=Jovanovc+94A+Tuđin&output=embed" 
          width="100%" 
          height="300" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
          <ToastContainer closeButton={false}
          autoClose={1500}
          />
    </section>
  );
};

export default ContactSection;


