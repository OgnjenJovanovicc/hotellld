import React from 'react';

const AuthModal = ({ isLoginForm, closeModal, handleLogin, handleRegister, setIsLoginForm }) => (
  <div className="modal">
    <div className="modal-content">
      <button className="close-button" onClick={closeModal}>×</button>
      {isLoginForm ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
          <label>Email:</label>
              <input type="email" name="email" placeholder="Unesite email" required />
              <label>Šifra:</label>
              <input type="password" name="sifra" placeholder="Unesite šifru" required />
              <button type="submit">Prijava</button>
            
          </form>
          <p>
            Nemate nalog? 
            <span className="toggle-form" onClick={() => setIsLoginForm(false)}>Registrujte se ovde.</span>
          </p>
        </div>
      ) : (
        <div>
          <h2>Registracija</h2>
          <form onSubmit={handleRegister}>
          <label>Ime:</label>
              <input type="text" name="ime" placeholder="Unesite ime" required />
              <label>Prezime:</label>
              <input type="text" name="prezime" placeholder="Unesite prezime" required />
              <label>Telefon:</label>
              <input type="text" name="telefon" placeholder="Unesite broj telefona" required />
              <label>Email:</label>
              <input type="email" name="email" placeholder="Unesite email" required />
              <label>Šifra:</label>
              <input type="password" name="sifra" placeholder="Unesite šifru" required />
              <button type="submit">Registracija</button>
          </form>
          <p>
            Već imate nalog? 
            <span className="toggle-form" onClick={() => setIsLoginForm(true)}>Prijavite se ovde.</span>
          </p>
        </div>
      )}
    </div>
  </div>
);

export default AuthModal;
