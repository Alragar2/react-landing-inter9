import React from 'react';

const VideoSection = () => {
  return (
    <section id="video" className="video-section">
      <div className="container">
        <div className="video-content">
          <div className="video-header">
            <h2 className="video-title">
              <i className="fas fa-play-circle"></i>
              Descubre Inter9 Soccer Academy
            </h2>
            <p className="video-description">
              Conoce nuestras instalaciones, metodología de entrenamiento y el ambiente único 
              que hace de Inter9 Soccer Academy el lugar perfecto para desarrollar el talento futbolístico.
            </p>
          </div>
          
          <div className="video-container-main">
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/wLS2OT3KN-E?rel=0&modestbranding=1"
                title="Entrenamiento Inter9 Soccer Academy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="video-info">
              <div className="video-stats">
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span className="stat-number">+200</span>
                  <span className="stat-label">Jugadores</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-calendar"></i>
                  <span className="stat-number">+3</span>
                  <span className="stat-label">Años</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
