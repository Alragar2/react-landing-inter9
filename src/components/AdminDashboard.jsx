import React, { useState, useEffect } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';
import { authService } from '../firebase/authService';
import PaymentManager from './PaymentManager';
import InscriptionCard from './InscriptionCard';
import FiltersPanel from './FiltersPanel';
import '../css/admin-dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
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

    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedInscription, setSelectedInscription] = useState(null);
    const [selectedInscriptionPayments, setSelectedInscriptionPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPaymentManager, setShowPaymentManager] = useState(false);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        horario: '',
        edad: '',
        demarcacion: ''
    });

    useEffect(() => {
        loadInscriptions();
    }, []);

    // Función helper para obtener nombre del horario
    const getScheduleName = (horarioId) => {
        const horario = horariosDisponibles.find(h => h.id === horarioId);
        return horario ? `${horario.name} - ${horario.location}` : horarioId;
    };

    const loadInscriptions = async () => {
        try {
            setLoading(true);
            setError('');
            
            const result = await inscriptionService.getAllInscriptions();
            
            if (result.success) {
                setInscriptions(result.data);
                setError('');
            } else {
                console.error('Error al cargar inscripciones:', result);
                setError(result.message || result.error || 'Error al cargar inscripciones');
                setInscriptions([]);
            }
        } catch (error) {
            console.error('Error inesperado al cargar inscripciones:', error);
            setError('Error inesperado al cargar las inscripciones');
            setInscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
            try {
                await authService.signOutAdmin();
                onLogout();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                onLogout(); // Cerrar de todas formas
            }
        }
    };

    const filteredInscriptions = inscriptions.filter(inscription => {
        // Filtro de búsqueda por texto
        const matchesSearch = inscription.nombreNino.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inscription.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inscription.nombreTutor.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtro por horario
        const matchesSchedule = !filters.horario || (() => {
            if (!inscription.horarios) return false;
            
            if (Array.isArray(inscription.horarios)) {
                // Si es array (nuevos datos), verificar si contiene el horario
                return inscription.horarios.includes(filters.horario);
            } else if (typeof inscription.horarios === 'string') {
                // Si es string (datos antiguos), comparar directamente
                return inscription.horarios === filters.horario;
            }
            return false;
        })();
        
        // Filtro por edad
        const matchesAge = !filters.edad || inscription.edad.toString() === filters.edad;
        
        // Filtro por demarcación
        const matchesDemarcacion = !filters.demarcacion || inscription.demarcacion === filters.demarcacion;
        
        return matchesSearch && matchesSchedule && matchesAge && matchesDemarcacion;
    });

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES');
        } catch {
            return dateString;
        }
    };

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

    const handlePaymentAdded = () => {
        // Recargar las inscripciones para mostrar los datos actualizados
        loadInscriptions();
        // Si hay una inscripción seleccionada, recargar sus pagos
        if (selectedInscription) {
            loadPaymentsForInscription(selectedInscription.id);
        }
    };

    const loadPaymentsForInscription = async (inscriptionId) => {
        setLoadingPayments(true);
        try {
            const result = await inscriptionService.getPaymentHistory(inscriptionId);
            if (result.success) {
                setSelectedInscriptionPayments(result.data);
            } else {
                console.error('Error al cargar pagos:', result.error);
                setSelectedInscriptionPayments([]);
            }
        } catch (error) {
            console.error('Error inesperado al cargar pagos:', error);
            setSelectedInscriptionPayments([]);
        } finally {
            setLoadingPayments(false);
        }
    };

    const handleInscriptionSelect = async (inscription) => {
        setSelectedInscription(inscription);
        await loadPaymentsForInscription(inscription.id);
    };

    // Manejar cambios en filtros
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({
            horario: '',
            edad: '',
            demarcacion: ''
        });
    };

    // Toggle del panel de filtros
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Cargando inscripciones...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>
                        <i className="fas fa-users"></i>
                        Gestión de Inscripciones
                    </h1>
                    <div className="admin-user-info">
                        <span className="welcome-text">
                            <i className="fas fa-user-shield"></i>
                            {user?.email || 'Administrador'}
                        </span>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={loadInscriptions} className="btn-refresh">
                            <i className="fas fa-sync-alt"></i>
                            Actualizar
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            <i className="fas fa-sign-out-alt"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                <div className={`admin-layout ${showFilters ? 'filters-open' : 'filters-closed'}`}>
                    <FiltersPanel
                        showFilters={showFilters}
                        filters={filters}
                        inscriptions={inscriptions}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        onToggleFilters={toggleFilters}
                    />

                    {/* Contenido Principal */}
                    <div className="main-content">
                        <div className="admin-controls">
                            <div className="controls-row">
                                <button 
                                    className="btn-toggle-filters"
                                    onClick={toggleFilters}
                                >
                                    <i className="fas fa-filter"></i>
                                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                                </button>
                                
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre del niño, apellidos o tutor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="stats">
                                <span className="stat-item">
                                    <i className="fas fa-child"></i>
                                    Total: {filteredInscriptions.length} de {inscriptions.length} inscripciones
                                </span>
                                {filters.horario && (
                                    <span className="stat-item">
                                        <i className="fas fa-clock"></i>
                                        Horario: {getScheduleName(filters.horario)}
                                    </span>
                                )}
                                {filters.edad && (
                                    <span className="stat-item">
                                        <i className="fas fa-birthday-cake"></i>
                                        Edad: {filters.edad} años
                                    </span>
                                )}
                                {filters.demarcacion && (
                                    <span className="stat-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        Demarcación: {filters.demarcacion}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="inscriptions-grid">
                            {filteredInscriptions.length === 0 ? (
                                <div className="no-inscriptions">
                                    <i className="fas fa-inbox fa-3x"></i>
                                    <h3>No hay inscripciones</h3>
                                    <p>
                                        {searchTerm || filters.horario || filters.edad || filters.demarcacion
                                            ? 'No se encontraron inscripciones que coincidan con los filtros aplicados' 
                                            : 'Aún no se han recibido inscripciones para el campus'
                                        }
                                    </p>
                                </div>
                            ) : (
                                filteredInscriptions.map((inscription) => (
                                    <InscriptionCard
                                        key={inscription.id}
                                        inscription={inscription}
                                        onInscriptionSelect={handleInscriptionSelect}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver detalles completos */}
            {selectedInscription && (
                <div className="modal-overlay" onClick={() => {
                    setSelectedInscription(null);
                    setSelectedInscriptionPayments([]);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detalles de la Inscripción</h2>
                            <button 
                                className="modal-close"
                                onClick={() => {
                                    setSelectedInscription(null);
                                    setSelectedInscriptionPayments([]);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
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

                            <div className="detail-section">
                                <h3>Datos del Tutor</h3>
                                <div className="detail-grid">
                                    <div><strong>Nombre:</strong> {selectedInscription.nombreTutor}</div>
                                    <div><strong>Teléfono:</strong> {selectedInscription.telefono}</div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Dirección</h3>
                                <div className="detail-grid">
                                    <div><strong>Dirección:</strong> {selectedInscription.direccion}</div>
                                    <div><strong>Ciudad:</strong> {selectedInscription.ciudad}</div>
                                    <div><strong>Código Postal:</strong> {selectedInscription.codigoPostal}</div>
                                </div>
                            </div>

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

                            <div className="detail-section">
                                <h3>Información de Registro</h3>
                                <div><strong>Fecha de inscripción:</strong> {formatTimestamp(selectedInscription.createdAt)}</div>
                            </div>

                            <div className="detail-section">
                                <div className="section-header">
                                    <h3>Estado de Pagos</h3>
                                    <button 
                                        className="btn-add-payment"
                                        onClick={() => setShowPaymentManager(true)}
                                    >
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
            )}

            {/* Payment Manager Modal */}
            {showPaymentManager && selectedInscription && (
                <PaymentManager
                    inscription={selectedInscription}
                    onClose={() => setShowPaymentManager(false)}
                    onPaymentAdded={handlePaymentAdded}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
