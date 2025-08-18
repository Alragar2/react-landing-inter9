import React from 'react';
import { horariosDisponibles, getMultipleScheduleDetails } from '../utils/horariosConfig';

const InscriptionCard = ({ inscription, onInscriptionSelect }) => {
    const formatTimestamp = (timestamp) => {
        try {
            let date;
            if (timestamp && timestamp.seconds) {
                // Firestore timestamp
                date = new Date(timestamp.seconds * 1000);
            } else {
                date = new Date(timestamp);
            }
            return date.toLocaleString('es-ES');
        } catch {
            return 'Fecha no disponible';
        }
    };

    const getPaymentStatus = (inscription) => {
        const montoPlan = inscription.precioTotal || 120; // Usar precio del plan o 120 por defecto
        const totalPagado = inscription.totalPagado || 0;
        
        if (totalPagado >= montoPlan) {
            return { status: 'pagado', text: 'Pagado', class: 'payment-paid' };
        } else if (totalPagado > 0) {
            return { status: 'parcial', text: `Parcial (€${totalPagado})`, class: 'payment-partial' };
        } else {
            return { status: 'pendiente', text: 'Pendiente', class: 'payment-pending' };
        }
    };

    const getLastPaymentInfo = (inscription) => {
        if (!inscription.ultimoPago) {
            return null;
        }
        
        const pago = inscription.ultimoPago;
        const fecha = formatTimestamp(pago.fecha);
        const metodo = pago.metodo === 'banco' ? '🏦 Banco' : '💵 Mano';
        
        return {
            monto: pago.monto,
            metodo: metodo,
            fecha: fecha
        };
    };

    const paymentStatus = getPaymentStatus(inscription);
    const lastPayment = getLastPaymentInfo(inscription);

    return (
        <div 
            className="inscription-card"
            onClick={() => onInscriptionSelect(inscription)}
        >
            <div className="inscription-header">
                <h3>{inscription.nombreNino} {inscription.apellidos}</h3>
                <span className="inscription-age">{inscription.edad} años</span>
            </div>
            
            <div className="inscription-details">
                <p><strong>Categoría:</strong> {inscription.categoria}</p>
                <p><strong>Demarcación:</strong> {inscription.demarcacion}</p>
                {inscription.planSeleccionado && (
                    <p><strong>Plan:</strong> {inscription.planSeleccionado} - €{inscription.precioTotal || 'N/A'}</p>
                )}
                {inscription.horarios && (
                    <div className="schedule-info">
                        {(() => {
                            const horarios = getMultipleScheduleDetails(inscription.horarios);
                            const ubicaciones = [...new Set(horarios.map(h => h.location))];
                            
                            return (
                                <>
                                    <p><strong>Horarios:</strong></p>
                                    <div className="horarios-list">
                                        {horarios.map((horario, index) => (
                                            <div key={index} className="horario-item">
                                                <span className="horario-time">{horario.name}</span>
                                                <span className="horario-location-small">{horario.location}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p><strong>Ubicaciones:</strong> 
                                        {ubicaciones.map((location, index) => (
                                            <span key={location} className="location-badge">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {location}
                                            </span>
                                        ))}
                                    </p>
                                </>
                            );
                        })()}
                    </div>
                )}
                <p><strong>Tutor:</strong> {inscription.nombreTutor}</p>
                <p><strong>Teléfono:</strong> {inscription.telefono}</p>
            </div>
            
            {/* Información de Pagos */}
            <div className="payment-info">
                <div className="payment-status">
                    <span className={`payment-badge ${paymentStatus.class}`}>
                        {paymentStatus.text}
                    </span>
                </div>
                {lastPayment && (
                    <div className="last-payment">
                        <small>
                            <strong>Último pago:</strong> €{lastPayment.monto} - {lastPayment.metodo}
                            <br />
                            <span className="payment-date">{lastPayment.fecha}</span>
                        </small>
                    </div>
                )}
            </div>
            
            <div className="inscription-footer">
                <small>Inscrito: {formatTimestamp(inscription.createdAt)}</small>
            </div>
        </div>
    );
};

export default InscriptionCard;
