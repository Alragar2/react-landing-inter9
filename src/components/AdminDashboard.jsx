import React, { useState, useEffect } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';
import { authService } from '../firebase/authService';
import PaymentManager from './PaymentManager';
import InscriptionCard from './InscriptionCard';
import FiltersPanel from './FiltersPanel';
import InscriptionModal from './InscriptionModal';
import { horariosDisponibles } from '../utils/horariosConfig';
import '../css/admin-dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
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
            <InscriptionModal
                selectedInscription={selectedInscription}
                selectedInscriptionPayments={selectedInscriptionPayments}
                loadingPayments={loadingPayments}
                onClose={() => {
                    setSelectedInscription(null);
                    setSelectedInscriptionPayments([]);
                }}
                onAddPayment={() => setShowPaymentManager(true)}
                formatDate={formatDate}
                formatTimestamp={formatTimestamp}
            />

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
