import React, { useState } from 'react';
import InscriptionForm from './InscriptionForm';

const Registration = () => {
  const [showForm, setShowForm] = useState(false);

  const handleRegistrationClick = () => {
    setShowForm(!showForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <section id="inscripcion" className="registration">
      <div className="container">
        <h2 className="section-title">¡Inscríbete Ya!</h2>
        <div className="registration-content">
          <p>Complete el formulario de inscripción y asegure la plaza de su hijo/a en nuestro Campus de Verano 2025.</p>
          <button 
            onClick={handleRegistrationClick} 
            className="btn-registration"
          >
            <i className="fas fa-edit"></i>
            {showForm ? 'Cerrar Formulario' : 'Formulario de Inscripción'}
          </button>
          
          <InscriptionForm 
            isVisible={showForm} 
            onClose={handleCloseForm}
          />
          
          <p className="registration-note">
            Tras completar el formulario, realice el pago según las instrucciones para confirmar la plaza.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registration;
