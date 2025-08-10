import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/images/logo-inter9.png" alt="Inter9 Logo" className="logo" />
            <span className="logo-text">Inter9 Soccer Academy</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#hero" className="nav-link">Inicio</a></li>
            <li><a href="#campus" className="nav-link">Campus</a></li>
            <li><a href="#pricing" className="nav-link">Precios</a></li>
            <li><a href="#inscripcion" className="nav-link">Inscripción</a></li>
            <li><a href="#equipacion" className="nav-link">Equipación</a></li>
            <li><a href="#contact" className="nav-link">Contacto</a></li>
            <li><a href="#faq" className="nav-link">FAQ</a></li>
          </ul>
          <div className="hamburger">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
