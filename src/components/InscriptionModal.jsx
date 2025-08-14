import React from 'react';

const InscriptionModal = ({ 
    selectedInscription, 
    selectedInscriptionPayments, 
    loadingPayments, 
    onClose, 
    onAddPayment,
    formatDate, 
    formatTimestamp 
}) => {
    // Array de horarios disponibles para mapear IDs a nombres
    const horariosDisponibles = [
        { 
            id: 'lunes-meliana-1', 
            name: 'Lunes 18:00 - 18:30',
            location: 'Meliana'
        },
        { 
            id: 'lunes-meliana-2', 
            name: 'Lunes 18:30 - 19:00',
            location: 'Meliana'
        },
        { 
            id: 'martes-albuixech-1', 
            name: 'Martes 19:00 - 20:00',
            location: 'Albuixech'
        },
        { 
            id: 'martes-albuixech-2', 
            name: 'Martes 19:30 - 20:30',
            location: 'Albuixech'
        },
        { 
            id: 'miercoles-albuixech-1', 
            name: 'Miércoles 19:00 - 20:00',
            location: 'Albuixech'
        },
        { 
            id: 'miercoles-albuixech-2', 
            name: 'Miércoles 19:30 - 20:00',
            location: 'Albuixech'
        },
        { 
            id: 'miercoles-meliana-1', 
            name: 'Jueves 19:00 - 20:00',
            location: 'Meliana'
        },
        { 
            id: 'miercoles-meliana-2', 
            name: 'Jueves 20:30 - 21:30',
            location: 'Meliana'
        },
        { 
            id: 'viernes-meliana-1', 
            name: 'Viernes 18:30 - 19:30',
            location: 'Meliana'
        },
        { 
            id: 'viernes-meliana-2', 
            name: 'Viernes 19:30 - 20:30',
            location: 'Meliana'
        },
        {
            id: 'domingo',
            name: 'Partidos, consultar horario',
            location: 'Meliana'
        }
    ];

    // Función para obtener detalles del horario
    const getScheduleDetails = (horarioId) => {
        const horario = horariosDisponibles.find(h => h.id === horarioId);
        return horario || { name: 'Horario no encontrado', location: 'N/A' };
    };

    // Función para obtener detalles de múltiples horarios
    const getMultipleScheduleDetails = (horariosArray) => {
        if (!horariosArray || horariosArray.length === 0) {
            return [];
        }
        // Si es un string (datos antiguos), convertir a array
        if (typeof horariosArray === 'string') {
            return [getScheduleDetails(horariosArray)];
        }
        // Si es array, mapear todos los horarios
        return horariosArray.map(horarioId => getScheduleDetails(horarioId));
    };

    if (!selectedInscription) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detalles de la Inscripción</h2>
                    <button className="modal-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="modal-body">
                    {/* Datos del Niño/a */}
                    <div className="detail-section">
                        <h3>Datos del Niño/a</h3>
                        <div className="detail-grid">
                            <div><strong>Nombre:</strong> {selectedInscription.nombreNino}</div>
                            <div><strong>Apellidos:</strong> {selectedInscription.apellidos}</div>
                            <div><strong>Fecha de Nacimiento:</strong> {formatDate(selectedInscription.fechaNacimiento)}</div>
                            <div><strong>Edad:</strong> {selectedInscription.edad} años</div>
                            <div><strong>Categoría:</strong> {selectedInscription.categoria}</div>
                            <div><strong>Demarcación:</strong> {selectedInscription.demarcacion}</div>
                            <div><strong>Talla:</strong> {selectedInscription.talla}</div>
                            <div><strong>Lateralidad:</strong> {selectedInscription.lateralidad}</div>
                        </div>
                    </div>

                    {/* Plan Contratado */}
                    {selectedInscription.planSeleccionado && (
                        <div className="detail-section">
                            <h3>Plan Contratado</h3>
                            <div className="plan-info-display">
                                <div className="plan-main-info">
                                    <span className="plan-name-display">{selectedInscription.planSeleccionado}</span>
                                    <span className="plan-price-display">€{selectedInscription.precioTotal || 'No especificado'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección de Horarios */}
                    {selectedInscription.horarios && (
                        <div className="detail-section">
                            <h3>Horarios</h3>
                            {(() => {
                                const horarios = getMultipleScheduleDetails(selectedInscription.horarios);
                                const ubicaciones = [...new Set(horarios.map(h => h.location))];
                                
                                return (
                                    <div className="horarios-modal-info">
                                        <div className="horarios-list-modal">
                                            {horarios.map((horario, index) => (
                                                <div key={index} className="horario-item-modal">
                                                    <span className="horario-time-modal">{horario.name}</span>
                                                    <span className="horario-location-modal">{horario.location}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="ubicaciones-summary">
                                            <strong>Ubicaciones:</strong>
                                            {ubicaciones.map((location, index) => (
                                                <span key={location} className="location-badge-modal">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    {location}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Datos del Tutor */}
                    <div className="detail-section">
                        <h3>Datos del Tutor</h3>
                        <div className="detail-grid">
                            <div><strong>Nombre:</strong> {selectedInscription.nombreTutor}</div>
                            <div><strong>Teléfono:</strong> {selectedInscription.telefono}</div>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="detail-section">
                        <h3>Dirección</h3>
                        <div className="detail-grid">
                            <div><strong>Dirección:</strong> {selectedInscription.direccion}</div>
                            <div><strong>Ciudad:</strong> {selectedInscription.ciudad}</div>
                            <div><strong>Código Postal:</strong> {selectedInscription.codigoPostal}</div>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    {(selectedInscription.alergias || selectedInscription.informacionInteres) && (
                        <div className="detail-section">
                            <h3>Información Adicional</h3>
                            {selectedInscription.alergias && (
                                <div><strong>Alergias:</strong> {selectedInscription.alergias}</div>
                            )}
                            {selectedInscription.informacionInteres && (
                                <div><strong>Información de interés:</strong> {selectedInscription.informacionInteres}</div>
                            )}
                        </div>
                    )}

                    {/* Información de Registro */}
                    <div className="detail-section">
                        <h3>Información de Registro</h3>
                        <div><strong>Fecha de inscripción:</strong> {formatTimestamp(selectedInscription.createdAt)}</div>
                    </div>

                    {/* Estado de Pagos */}
                    <div className="detail-section">
                        <div className="section-header">
                            <h3>Estado de Pagos</h3>
                            <button className="btn-add-payment" onClick={onAddPayment}>
                                <i className="fas fa-plus"></i>
                                Agregar Pago
                            </button>
                        </div>
                        
                        <div className="payment-summary-modal">
                            <div className="payment-totals">
                                <div className="total-item">
                                    <span>Precio Total:</span>
                                    <span>€{selectedInscription.precioTotal || 120}</span>
                                </div>
                                <div className="total-item">
                                    <span>Total Pagado:</span>
                                    <span className="paid">€{selectedInscription.totalPagado || 0}</span>
                                </div>
                                <div className="total-item">
                                    <span>Restante:</span>
                                    <span className={`${(selectedInscription.totalPagado || 0) >= (selectedInscription.precioTotal || 120) ? 'complete' : 'pending'}`}>
                                        €{Math.max(0, (selectedInscription.precioTotal || 120) - (selectedInscription.totalPagado || 0))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Pagos */}
                        {selectedInscriptionPayments && selectedInscriptionPayments.length > 0 ? (
                            <div className="payment-history">
                                <h4>Historial de Pagos</h4>
                                {loadingPayments ? (
                                    <div className="loading-payments">Cargando pagos...</div>
                                ) : (
                                    <div className="payments-list">
                                        {selectedInscriptionPayments
                                            .sort((a, b) => new Date(b.fecha.seconds * 1000) - new Date(a.fecha.seconds * 1000))
                                            .map((pago) => (
                                            <div key={pago.id} className="payment-item">
                                                <div className="payment-main">
                                                    <div className="payment-amount">€{pago.monto}</div>
                                                    <div className="payment-method">
                                                        {pago.metodo === 'banco' ? '🏦 Banco' : '💵 Mano'}
                                                    </div>
                                                    <div className="payment-date">
                                                        {formatTimestamp(pago.fecha)}
                                                    </div>
                                                </div>
                                                
                                                {/* Información de sesión si existe */}
                                                {pago.esSesion && (pago.numeroSesion || pago.fechaSesion) && (
                                                    <div className="session-info">
                                                        {pago.numeroSesion && (
                                                            <span className="session-number">
                                                                📅 Sesión #{pago.numeroSesion}
                                                            </span>
                                                        )}
                                                        {pago.fechaSesion && (
                                                            <span className="session-date">
                                                                🗓️ {new Date(pago.fechaSesion).toLocaleDateString('es-ES')}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {pago.concepto && (
                                                    <div className="payment-concept">{pago.concepto}</div>
                                                )}
                                                {pago.notas && (
                                                    <div className="payment-notes">{pago.notas}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-payments">
                                <i className="fas fa-credit-card fa-2x"></i>
                                <p>No hay pagos registrados</p>
                                {loadingPayments && <p>Cargando...</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscriptionModal;
