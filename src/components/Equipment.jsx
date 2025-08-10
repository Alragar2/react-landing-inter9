import React, { useState } from 'react';

const Equipment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const equipmentItems = [
    {
      id: 1,
      name: "Camiseta",
      description: "Camiseta oficial Inter9 Soccer Academy",
      image: "/images/equipment-inter9.png",
      gallery: [
        "/images/equipment2-inter9.jpg",
        "/images/shirt-inter9.jpg"
      ],
      features: ["Tejido transpirable", "Escudo bordado", "Tecnología Dri-FIT"]
    }
  ];

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.gallery.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <section id="equipacion" className="equipment">
      <div className="container">
        <h2 className="section-title">Nuestra Equipación</h2>
        <p className="equipment-intro">
          Equipación oficial Inter9 Soccer Academy.
        </p>
        
        <div className="equipment-grid">
          {equipmentItems.map((item) => (
            <div key={item.id} className="equipment-card">
              <div className="equipment-image">
                <img src={item.image} alt={item.name} />
                <div className="equipment-overlay">
                  <button 
                    className="btn-view-details"
                    onClick={() => openModal(item)}
                  >
                    <i className="fas fa-eye"></i>
                    Ver Detalles
                  </button>
                </div>
              </div>
              
              <div className="equipment-content">
                <h3 className="equipment-name">{item.name}</h3>
                <p className="equipment-description">{item.description}</p>
                
                <div className="equipment-features">
                  <h4>Características:</h4>
                  <ul>
                    {item.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          ))}
        </div>
        
        <div className="equipment-note">
          <div className="note-content">
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>Información Importante</h4>
              <p>La equipación oficial es obligatoria para todos los entrenamientos y partidos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="equipment-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
            </div>

            <div className="modal-carousel">
              <div className="carousel-container-modal">
                <button className="carousel-btn prev" onClick={prevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="carousel-images">
                  <img 
                    src={selectedItem.gallery[currentImageIndex]} 
                    alt={`${selectedItem.name} - Imagen ${currentImageIndex + 1}`}
                  />
                </div>
                
                <button className="carousel-btn next" onClick={nextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div className="carousel-indicators">
                {selectedItem.gallery.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Equipment;
