import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Inter9 Soccer Academy</h3>
            <p>Formando futbolistas del futuro con pasión y excelencia.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/inter9socceracademy/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#hero">Inicio</a></li>
              <li><a href="#inscripcion">Inscripción</a></li>
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#pricing">Precios</a></li>
              
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p><i className="fas fa-map-marker-alt"></i> Meliana, Valencia</p>
            <p><i className="fas fa-map-marker-alt"></i> Albuixech, Valencia</p>
            <p><i className="fas fa-envelope"></i> info@inter9meliana.com</p>
            <p><i className="fas fa-phone"></i> +34 628 536 290</p>
          </div>
          <div className="footer-section">
            <h3>Horarios</h3>
            <p>Lunes - Viernes: 16:00 - 20:00</p>
            <p>Sábados: 9:00 - 14:00</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Inter9 Soccer Academy Meliana. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
