import React from 'react';
import { FaEnvelope, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";


 const smoothScroll = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };
 const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    e.target.classList.add('clicked');
    setTimeout(() => {
      e.target.classList.remove('clicked');
    }, 500)
    smoothScroll(targetId);
  };


const Header = ({ user, openModal, handleLogout }) => {

 return (
    <nav className="navbar">
      <div className="logo">Hotel Luksuz</div>
      <ul className="nav-links">
        <li>
          <a 
            href="#about" 
            onClick={(e) => handleLinkClick(e, '#about')}
            className="nav-link"
          >
            O nama
          </a>
        </li>
        <li>
          <a 
            href="#rooms" 
            onClick={(e) => handleLinkClick(e, '#rooms')}
            className="nav-link"
          >
            Sobe
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="nav-link"
          >
            Kontakt <FaEnvelope className="icon" />
          </a>
        </li>
        {user ? (
          <li>
            <button 
              className="login-button logout-btn" 
              onClick={handleLogout}
            >
              <FaSignOutAlt className="icon" /> Logout
            </button>
          </li>
        ) : (
          <li>
            <button 
              className="login-button login-btn" 
              onClick={openModal}
            >
              <FaSignInAlt className="icon" /> Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;