import React from 'react';

const Registration = () => {
  const handleRegistrationClick = () => {
    // Aquí puedes abrir el formulario de inscripción en una nueva ventana
    // o redirigir a una página específica
    window.open('formulario-inscripcion.html', '_blank');
  };

  return (
    <section id="inscripcion" className="registration">
      <div className="container">
        <h2 className="section-title">¡Inscríbete Ya!</h2>
        <div className="registration-content">
          <p>Complete el formulario de inscripción y asegure la plaza de su hijo/a en nuestro Campus de Verano 2025.</p>
          <a href="formulario-inscripcion.html" className="btn-registration" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-edit"></i>
            Formulario de Inscripción
          </a>
          <p className="registration-note">
            Tras completar el formulario, realice el pago según las instrucciones para confirmar la plaza.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registration;
