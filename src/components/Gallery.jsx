import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "/images/gallery-childs.jpg",
      title: "Momentos Especiales",
      alt: "Momentos Especiales"
    },
    {
      image: "/images/gallery-childs2.jpg", 
      title: "Torneos",
      alt: "Torneos"
    },
    {
      image: "/images/Campus-Meliana-Inter-Soccer-Academy.png",
      title: "Visitas de profesionales",
      alt: "Visitas de profesionales"
    }
  ];

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section id="gallery" className="gallery">
      <h2 className="gallery-title">Galería</h2>
      
      <div className="gallery-carousel">
        <div 
          className="carousel-container"
          style={{ transform: `translateX(-${currentSlide * 20}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide.image} alt={slide.alt} />
              <div className="carousel-overlay">
                <h3>{slide.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navegación */}
        <button className="carousel-nav prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Indicadores */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
