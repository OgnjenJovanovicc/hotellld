import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [mapActive, setMapActive] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Greska pri slanju:", error);
      toast.error(`Greska: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shake]);

  return (
    <section id="contact" className="contact-section">
      <div className="contact-header">
        <span className="contact-kicker">Kontakt</span>
        <h2>Kontaktirajte nas</h2>
        <p>Imate pitanja ili zelite rezervisati sobu? Javite nam se i odgovor stize brzo.</p>
      </div>

      <div className="contact-container">
        <form onSubmit={handleSubmit} className={`contact-form ${shake ? "form-shake" : ""}`}>
          <div className={`form-group ${formErrors.name ? "has-error" : ""}`}>
            <label>Ime i prezime*</label>
            <input
              type="text"
              placeholder="Ime i prezime"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && <span className="error-message">Ovo polje je obavezno</span>}
          </div>

          <div className={`form-group ${formErrors.email ? "error" : ""} ${shake && formErrors.email ? "shake" : ""}`}>
            <label>Email*</label>
            <input
              type="email"
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && <span className="error-message">Unesite validan email</span>}
          </div>

          <div className={`form-group ${formErrors.message ? "error" : ""} ${shake && formErrors.message ? "shake" : ""}`}>
            <label>Poruka*</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            {formErrors.message && <span className="error-message">Ovo polje je obavezno</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Slanje..." : "Posalji poruku"}
          </button>

          {submitSuccess && (
            <div className="success-message">
              Poruka je uspesno poslata! Javicemo vam se uskoro.
            </div>
          )}
        </form>

        <div className="contact-details">
          <div className="contact-panel contact-info">
            <h3>Drugi nacini kontaktiranja</h3>
            <ul>
              <li><span>📞</span><a href="tel:+381123456789">+381 12 345 6789</a></li>
              <li><span>✉️</span><a href="mailto:ognjenjov02@gmail.com">ognjenjov02@gmail.com</a></li>
              <li><span>📍</span>Jovanovc, 94A, Tudin</li>
              <li><span>🕒</span>Radno vreme: 24/7</li>
            </ul>
          </div>

          <div className="contact-panel faq-section">
            <h3>Cesto postavljana pitanja</h3>
            <details>
              <summary>Kako otkazati rezervaciju?</summary>
              <p>Rezervaciju mozete otkazati putem emaila ili u sekciji "Moje rezervacije".</p>
            </details>
            <details>
              <summary>Da li je moguca online uplata?</summary>
              <p>Da, podrzavamo kreditne kartice.</p>
            </details>
          </div>

          <div className="contact-panel social-media">
            <h3>Pratite nas</h3>
            <div className="social-icons">
              <a href="https://facebook.com/hotelapp" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com/hotelapp" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://wa.me/381123456789" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
      </div>

      <div className={`map-container ${mapActive ? "active" : ""}`} onClick={() => setMapActive(true)}>
        {!mapActive && (
          <div className="map-overlay">
            <button type="button">Kliknite za aktivaciju mape</button>
          </div>
        )}
        <iframe
          title="Lokacija hotela na mapi"
          src="https://www.google.com/maps?q=Jovanovc+94A+Tudin&output=embed"
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>

      <ToastContainer closeButton={false} autoClose={1500} />
    </section>
  );
};

export default ContactSection;
