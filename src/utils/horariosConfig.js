// Configuración de horarios disponibles
// Este archivo centraliza la definición de horarios para evitar duplicación
export const horariosDisponibles = [
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
        name: 'Miércoles 19:30 - 20:30',
        location: 'Albuixech'
    },
    {
        id: 'miercoles-meliana-1',
        name: 'Miércoles 19:00 - 20:00',
        location: 'Meliana'
    },
    {
        id: 'miercoles-meliana-2',
        name: 'Miércoles 20:30 - 21:30',
        location: 'Meliana'
    },
    {
        id: 'viernes-meliana-1',
        name: 'Viernes 17:00 - 18:00',
        location: 'Meliana'
    },
    {
        id: 'viernes-meliana-2',
        name: 'Viernes 17:30 - 18:30',
        location: 'Meliana'
    },
    {
        id: 'viernes-meliana-3',
        name: 'Viernes 18:00 - 19:00',
        location: 'Meliana'
    },
    {
        id: 'viernes-meliana-4',
        name: 'Viernes 18:30 - 19:30',
        location: 'Meliana'
    },
    {
        id: 'domingo',
        name: 'Partidos, consultar horario',
        location: 'Meliana'
    }
];

// Función helper para obtener detalles de un horario por ID
export const getScheduleDetails = (horarioId) => {
    const horario = horariosDisponibles.find(h => h.id === horarioId);
    return horario || { name: 'Horario no encontrado', location: 'N/A' };
};

// Función helper para obtener detalles de múltiples horarios
export const getMultipleScheduleDetails = (horariosArray) => {
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

// Función para obtener ubicaciones únicas
export const getUniqueLocations = () => {
    return [...new Set(horariosDisponibles.map(h => h.location))];
};

// Función para obtener horarios por ubicación
export const getSchedulesByLocation = (location) => {
    return horariosDisponibles.filter(h => h.location === location);
};
