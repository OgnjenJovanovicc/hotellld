import React from 'react';
import { FaEnvelope, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Header = ({ user, openModal, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">Hotel Luksuz</div>
      <ul className="nav-links">
        <li><a href="#about">O nama</a></li>
        <li><a href="#rooms">Sobe</a></li>
        <li><a href="#contact">Kontakt <FaEnvelope className="icon" /></a></li>
        {user?.role === 'admin' && (
  <li>
 <span style={{ color: "gold", fontWeight: "bold" }}>Dobrodošao, admin!</span>
  </li>
)}
        {user ? (
          <li>
            <button className="login-button" onClick={handleLogout}>
              <FaSignOutAlt className="icon" /> Logout
            </button>
          </li>
        ) : (
          <li>
            <button className="login-button" onClick={openModal}>
              <FaSignInAlt className="icon"  /> Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;