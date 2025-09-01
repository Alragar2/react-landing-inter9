import React from 'react';
import { horariosDisponibles } from '../utils/horariosConfig';

const FiltersPanel = ({ 
    showFilters, 
    filters, 
    inscriptions, 
    onFilterChange, 
    onClearFilters, 
    onToggleFilters 
}) => {
    // Obtener horarios únicos de las inscripciones
    const getUniqueSchedules = () => {
        const allScheduleIds = [];
        
        inscriptions.forEach(inscription => {
            if (inscription.horarios) {
                if (Array.isArray(inscription.horarios)) {
                    // Si es array (nuevos datos), agregar todos los IDs
                    allScheduleIds.push(...inscription.horarios);
                } else if (typeof inscription.horarios === 'string') {
                    // Si es string (datos antiguos), agregar el ID único
                    allScheduleIds.push(inscription.horarios);
                }
            }
        });

        // Obtener IDs únicos y mapear a objetos completos
        const uniqueIds = [...new Set(allScheduleIds)];
        return uniqueIds
            .map(id => horariosDisponibles.find(h => h.id === id))
            .filter(Boolean) // Filtrar horarios no encontrados
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    // Obtener edades únicas para el filtro (de 6 a 17 años)
    const getUniqueAges = () => {
        // Crear array con todas las edades de 6 a 17 años
        const allAges = [];
        for (let age = 6; age <= 17; age++) {
            allAges.push(age);
        }
        return allAges;
    };

    // Obtener demarcación
    const getDemarcation = () => {
        const demarcation = inscriptions.map(inscription => inscription.demarcacion);
        return [...new Set(demarcation)].filter(Boolean).sort();
    };

    // Opciones de ordenamiento
    const getSortOptions = () => {
        return [
            { value: 'newest', label: 'Más recientes primero' },
            { value: 'oldest', label: 'Más antiguos primero' }
        ];
    };

    return (
        <>
            {/* Overlay para móvil */}
            {showFilters && (
                <div 
                    className="filters-overlay"
                    onClick={onToggleFilters}
                ></div>
            )}

            {/* Panel de Filtros */}
            <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
                <div className="filters-header">
                    <h3>
                        <i className="fas fa-filter"></i>
                        Filtros
                    </h3>
                    <div className="filters-header-actions">
                        <button 
                            className="btn-clear-filters"
                            onClick={onClearFilters}
                            title="Limpiar filtros"
                        >
                            <i className="fas fa-eraser"></i>
                            Limpiar
                        </button>
                        <button 
                            className="btn-close-filters"
                            onClick={onToggleFilters}
                            title="Cerrar filtros"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div className="filters-content">
                    <div className="filter-group">
                        <label htmlFor="horario-filter">Horario</label>
                        <select
                            id="horario-filter"
                            className="filter-select"
                            value={filters.horario}
                            onChange={(e) => onFilterChange('horario', e.target.value)}
                        >
                            <option value="">Todos los horarios</option>
                            {getUniqueSchedules().map(horario => (
                                <option key={horario.id} value={horario.id}>
                                    {horario.name} - {horario.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="edad-filter">Edad</label>
                        <select
                            id="edad-filter"
                            className="filter-select"
                            value={filters.edad}
                            onChange={(e) => onFilterChange('edad', e.target.value)}
                        >
                            <option value="">Todas las edades</option>
                            {getUniqueAges().map(edad => (
                                <option key={edad} value={edad}>
                                    {edad} años
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="demarcacion-filter">Demarcación</label>
                        <select
                            id="demarcacion-filter"
                            className="filter-select"
                            value={filters.demarcacion}
                            onChange={(e) => onFilterChange('demarcacion', e.target.value)}
                        >
                            <option value="">Todas las demarcaciones</option>
                            {getDemarcation().map(demarcacion => (
                                <option key={demarcacion} value={demarcacion}>
                                    {demarcacion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-filter">Ordenar por</label>
                        <select
                            id="sort-filter"
                            className="filter-select"
                            value={filters.sortBy || 'newest'}
                            onChange={(e) => onFilterChange('sortBy', e.target.value)}
                        >
                            {getSortOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FiltersPanel;
