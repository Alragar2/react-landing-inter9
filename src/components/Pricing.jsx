import React from 'react';

const Pricing = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "Individual",
      price: 25,
      currency: "€",
      period: "/sesión",
      popular: false,
      features: [
        "1 sesión de entrenamiento",
        "Asesoramiento personalizado",
      ],
      buttonText: "Seleccionar",
      buttonLink: "#inscripcion"
    },
    {
      id: 2,
      name: "Pareja",
      price: 20,
      currency: "€",
      period: "/sesión",
      popular: false,
      features: [
        "1 sesión de entrenamiento",
        "Asesoramiento personalizado",
        "20€ por persona"
      ],
      buttonText: "Seleccionar",
      buttonLink: "#inscripcion"
    },
    {
      id: 3,
      name: "Trío",
      price: 15,
      currency: "€",
      period: "/sesión",
      popular: false,
      features: [
        "1 sesión de entrenamiento",
        "Asesoramiento personalizado",
        "15€ por persona"
      ],
      buttonText: "Seleccionar",
      buttonLink: "#inscripcion"
    },
    {
      id: 4,
      name: "Grupal Mensual",
      price: 40,
      currency: "€",
      period: "/mes",
      popular: false,
      features: [
        "Sesiones de entrenamiento grupales",
        "Asesoramiento personalizado"
      ],
      buttonText: "Seleccionar",
      buttonLink: "#inscripcion"
    }
  ];

  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <h2 className="text-center mb-12">Nuestros Precios</h2>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <i className="fas fa-star"></i>
                  Más Popular
                </div>
              )}
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.currency}{plan.price}
                <span>{plan.period}</span>
              </div>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href={plan.buttonLink} className="btn btn-primary">
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
        
        {/* Sección de Descuentos */}
        <div className="pricing-discount">
          <div className="discount-card">
            <div className="discount-header">
              <i className="fas fa-percentage"></i>
              <h3>Descuento Especial</h3>
            </div>
            <div className="discount-content">
              <p>
                <strong>¡5€ de descuento!</strong> para jugadores de:
              </p>
              <div className="clubs-list">
                <div className="club-item">
                  <img src="/images/melianacf.jpg" alt="Meliana CF" className="fas fa-shield-alt" width={25} />
                  <span>Meliana CF</span>
                </div>
                <div className="club-item">
                  <img src="/images/albuixech.jpg" alt="Albuixech CF" className="fas fa-shield-alt" width={25} />
                  <span>Albuixech CF</span>
                </div>
              </div>
              <p className="discount-note">
                * Aplica a todos los planes. Presenta tu carnet de jugador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
