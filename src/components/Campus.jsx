import React from 'react';

const Campus = () => {
  return (
    <section id="campus" className="campus section">
      <div className="container">
        <h2 className="text-center mb-12">Nuestro Campus</h2>
        <div className="campus-grid">
          <div className="campus-card">
            <img src="/images/instalaciones.svg" alt="Instalaciones" />
            <h3>Instalaciones Modernas</h3>
            <p>Campos de césped natural y artificial con la última tecnología deportiva.</p>
          </div>
          <div className="campus-card">
            <img src="/images/entrenadores.svg" alt="Entrenadores" />
            <h3>Entrenadores Profesionales</h3>
            <p>Equipo técnico con experiencia en fútbol profesional y formación juvenil.</p>
          </div>
          <div className="campus-card">
            <img src="/images/entrenamiento-1.svg" alt="Entrenamiento" />
            <h3>Metodología Avanzada</h3>
            <p>Sistema de entrenamiento basado en las últimas tendencias del fútbol moderno.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Campus;
