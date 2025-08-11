import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'inscripciones';

// Servicio para manejar las inscripciones en Firebase
export const inscriptionService = {
  
  // Crear una nueva inscripción
  async createInscription(inscriptionData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...inscriptionData,
        fechaCreacion: Timestamp.now(),
        estado: 'pendiente' // Estados: pendiente, confirmada, rechazada
      });
      
      console.log('Inscripción guardada con ID: ', docRef.id);
      return {
        success: true,
        id: docRef.id,
        message: 'Inscripción enviada correctamente'
      };
    } catch (error) {
      console.error('Error al guardar la inscripción: ', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al enviar la inscripción. Inténtalo de nuevo.'
      };
    }
  },

  // Obtener todas las inscripciones
  async getAllInscriptions() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const inscriptions = [];
      
      querySnapshot.forEach((doc) => {
        inscriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        data: inscriptions
      };
    } catch (error) {
      console.error('Error al obtener inscripciones: ', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Actualizar estado de una inscripción
  async updateInscriptionStatus(inscriptionId, newStatus) {
    try {
      const inscriptionRef = doc(db, COLLECTION_NAME, inscriptionId);
      await updateDoc(inscriptionRef, {
        estado: newStatus,
        fechaActualizacion: Timestamp.now()
      });
      
      return {
        success: true,
        message: 'Estado actualizado correctamente'
      };
    } catch (error) {
      console.error('Error al actualizar inscripción: ', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Eliminar una inscripción
  async deleteInscription(inscriptionId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, inscriptionId));
      
      return {
        success: true,
        message: 'Inscripción eliminada correctamente'
      };
    } catch (error) {
      console.error('Error al eliminar inscripción: ', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validar datos de inscripción antes de enviar
  validateInscriptionData(data) {
    const requiredFields = [
      'nombreNino',
      'apellidos', 
      'fechaNacimiento',
      'edad',
      'categoria',
      'demarcacion',
      'talla',
      'lateralidad',
      'nombreTutor',
      'telefono',
      'direccion',
      'ciudad',
      'codigoPostal'
    ];

    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`
      };
    }

    // Validar edad
    const edad = parseInt(data.edad);
    if (isNaN(edad) || edad < 3 || edad > 17) {
      return {
        isValid: false,
        message: 'La edad debe estar entre 3 y 17 años'
      };
    }

    // Validar teléfono (formato básico)
    const phoneRegex = /^[+]?[0-9\s-()]{9,15}$/;
    if (!phoneRegex.test(data.telefono)) {
      return {
        isValid: false,
        message: 'El formato del teléfono no es válido'
      };
    }

    // Validar checkboxes requeridos
    if (!data.autorizacion || !data.politicaPrivacidad) {
      return {
        isValid: false,
        message: 'Debes aceptar las autorizaciones requeridas'
      };
    }

    return {
      isValid: true,
      message: 'Datos válidos'
    };
  }
};
