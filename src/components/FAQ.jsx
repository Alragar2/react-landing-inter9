import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "¿Qué incluye la inscripción al campus?",
      answer: "La inscripción incluye todas las sesiones de entrenamiento, material deportivo necesario, seguro de actividad, y supervisión profesional durante todo el horario del campus."
    },
    {
      question: "¿Qué deben traer los participantes?",
      answer: "Los participantes deben traer ropa deportiva cómoda, zapatillas de fútbol o deporte, una botella de agua, y almuerzo si van a quedarse todo el día. Nosotros proporcionamos balones y demás material de entrenamiento."
    },
    {
      question: "¿Hay descuentos por hermanos o por inscribirse a varias semanas?",
      answer: "Sí, ofrecemos un 10% de descuento para hermanos y un 15% de descuento si se inscribe a las dos semanas completas. Contacte con nosotros para más detalles."
    },
    {
      question: "¿Qué medidas de seguridad se toman?",
      answer: "Todos nuestros entrenadores están titulados y formados en primeros auxilios. Mantenemos ratios bajos entrenador-alumno, tenemos protocolos de seguridad establecidos y botiquín de primeros auxilios disponible."
    },
    {
      question: "¿Qué pasa si llueve?",
      answer: "El Polideportivo Municipal de Meliana cuenta con instalaciones cubiertas. En caso de lluvia, las actividades se desarrollarán en espacios cubiertos sin interrumpir el programa."
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer: "Las cancelaciones realizadas con más de 7 días de antelación tienen reembolso del 90%. Entre 3-7 días, 50% de reembolso. Con menos de 3 días no hay reembolso, excepto por causas médicas justificadas."
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
