import React from 'react';

const Schedule = () => {
  const scheduleData = [
    {
      day: "LUNES",
      location: "FUERZA MELIANA",
      sessions: [
        { time: "18:00 A 18:30" },
        { time: "18:30 A 19:00" }
      ]
    },
    {
      day: "MARTES",
      location: "ALBUIXECH",
      sessions: [
        { time: "19:00 A 20:00" },
        { time: "19:30 A 20:30" }
      ]
    },
    {
      day: "MIÉRCOLES",
      location: "ALBUIXECH",
      sessions: [
        { time: "19:00 A 20:00" },
        { time: "19:30 A 20:00" }
      ]
    },
    {
      day: "MIÉRCOLES",
      location: "MELIANA",
      sessions: [
        { time: "19:00 A 20:00" },
        { time: "20:30 A 21:30" }
      ]
    },
    {
      day: "VIERNES",
      location: "MELIANA",
      sessions: [
        { time: "17:00 A 18:00" },
        { time: "17:30 A 18:30" }
      ]
    },
    {
      day: "VIERNES",
      location: "MELIANA",
      sessions: [
        { time: "18:30 A 19:30" },
        { time: "19:30 A 20:30" }
      ]
    },
    {
      day: "DOMINGO",
      location: "PARTIDOS AMISTOSOS",
      sessions: []
    }
  ];

  return (
    <section id="horarios" className="schedule">
      <div className="container">
        <h2 className="section-title">Horarios de Entrenamiento</h2>
        <div className="schedule-grid">
          {scheduleData.map((item, index) => (
            <div key={index} className="schedule-card">
              <div className="schedule-day">
                <h3>{item.day}</h3>
              </div>
              <div className="schedule-location">
                <h4>{item.location}</h4>
              </div>
              <div className="schedule-times">
                {item.sessions.length > 0 ? (
                  item.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="schedule-time">
                      <i className="fas fa-clock"></i>
                      <span>{session.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="schedule-time special">
                    <i className="fas fa-futbol"></i>
                    <span>Consultar horarios</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
