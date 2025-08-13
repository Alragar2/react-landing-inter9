import React from 'react';

const FiltersPanel = ({ 
    showFilters, 
    filters, 
    inscriptions, 
    onFilterChange, 
    onClearFilters, 
    onToggleFilters 
}) => {
    // Obtener categorías únicas para el filtro
    const getUniqueCategories = () => {
        const categories = inscriptions.map(inscription => inscription.categoria);
        return [...new Set(categories)].filter(Boolean).sort();
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
                        <label htmlFor="categoria-filter">Categoría</label>
                        <select
                            id="categoria-filter"
                            className="filter-select"
                            value={filters.categoria}
                            onChange={(e) => onFilterChange('categoria', e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {getUniqueCategories().map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
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
                </div>
            </div>
        </>
    );
};

export default FiltersPanel;
