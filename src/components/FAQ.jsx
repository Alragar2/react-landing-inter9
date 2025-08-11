import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "¿Qué incluye la inscripción?",
      answer: "La inscripción incluye todas las sesiones de entrenamiento, material deportivo necesario, seguro de actividad, y supervisión profesional."
    },
    {
      question: "¿Qué deben traer los participantes?",
      answer: "Los participantes deben traer la ropa deportiva oficial, zapatillas de fútbol. Nosotros proporcionamos balones y demás material de entrenamiento."
    },
    {
      question: "¿Hay descuentos por hermanos o por inscribirse a varias semanas?",
      answer: "Hay descuentos por parejas o tríos."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
