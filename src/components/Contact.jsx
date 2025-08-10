import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <h2 className="text-center mb-12">Contacto</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Meliana, Valencia, España</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+34 123 456 789</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>info@inter9meliana.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Lun - Vie: 16:00 - 20:00</span>
            </div>
          </div>
          <div className="contact-form">
            <h3>Envíanos un Mensaje</h3>
            <form>
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Nombre" required />
              </div>
              <div className="form-group">
                <input type="email" className="form-input" placeholder="Email" required />
              </div>
              <div className="form-group">
                <textarea className="form-textarea" placeholder="Mensaje" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
