import React from 'react';

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="text-center mb-12">Sobre Nosotros</h2>
        <div className="about-content">
          <p>
            Inter9 Soccer Academy Meliana es una academia de fútbol comprometida con la 
            formación integral de jóvenes futbolistas. Nuestro objetivo es desarrollar 
            no solo las habilidades técnicas y tácticas, sino también los valores 
            fundamentales del deporte.
          </p>
          <p>
            Con más de 10 años de experiencia, hemos formado a cientos de jugadores 
            que han continuado su carrera en equipos profesionales y semi-profesionales. 
            Nuestro enfoque se basa en la excelencia, el respeto y la pasión por el fútbol.
          </p>
          <div className="about-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>Jugadores Formados</p>
            </div>
            <div className="stat">
              <h3>15</h3>
              <p>Entrenadores Profesionales</p>
            </div>
            <div className="stat">
              <h3>10+</h3>
              <p>Años de Experiencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
