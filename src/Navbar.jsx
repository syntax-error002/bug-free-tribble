import React, { useState } from 'react';
import './Navbar.css';
import './NavbarMobile.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          {/* Brand */}
          <a href="#" className="navbar-logo-text">VK</a>
        </div>

        {/* Desktop links */}
        <ul className="navbar-links desktop-only">
          <li className="navbar-item active">
            <a href="#work">Work</a>
          </li>
          <li className="navbar-item">
            <a href="#about">About</a>
          </li>
          <li className="navbar-item">
            <a href="#contact">Contact</a>
          </li>
        </ul>

        <div className="navbar-actions desktop-only">
          <button className="btn-signup">Let's Connect →</button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-dropdown">
          <a href="#work"   className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
          <a href="#about"  className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#contact"className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <div className="mobile-actions">
            <button className="btn-signup mobile-login" style={{background:'#1c1c1c',color:'#fff6e8'}}>Let's Connect →</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
