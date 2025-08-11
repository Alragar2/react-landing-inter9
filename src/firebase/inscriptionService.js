import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'inscripciones';

// Servicio para manejar las inscripciones en Firebase
export const inscriptionService = {
  
  // Crear una nueva inscripción
  async createInscription(inscriptionData) {
    console.log('🔥 [Firebase Service] Iniciando createInscription...');
    console.log('📊 [Firebase Service] Datos recibidos:', inscriptionData);
    
    try {
      // Verificar conexión a Firebase
      console.log('🌐 [Firebase Service] Verificando conexión a Firebase...');
      console.log('🗄️ [Firebase Service] Base de datos:', db);
      console.log('📁 [Firebase Service] Colección:', COLLECTION_NAME);

      // Validar que db esté inicializado
      if (!db) {
        throw new Error('Base de datos Firestore no inicializada');
      }

      const dataToSave = {
        ...inscriptionData,
        fechaCreacion: Timestamp.now(),
        estado: 'pendiente' // Estados: pendiente, confirmada, rechazada
      };

      console.log('📝 [Firebase Service] Datos finales a guardar:', dataToSave);
      console.log('✍️ [Firebase Service] Enviando a Firestore...');

      // Intentar crear la colección y documento
      const collectionRef = collection(db, COLLECTION_NAME);
      console.log('📁 [Firebase Service] Referencia de colección creada:', collectionRef);
      
      const docRef = await addDoc(collectionRef, dataToSave);
      
      console.log('✅ [Firebase Service] Inscripción guardada con ID:', docRef.id);
      return {
        success: true,
        id: docRef.id,
        message: 'Inscripción enviada correctamente'
      };
    } catch (error) {
      console.error('💥 [Firebase Service] Error detallado:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        completeError: error
      });

      // Diagnóstico específico por tipo de error
      let userMessage = 'Error al enviar la inscripción. Inténtalo de nuevo.';
      
      if (error.code === 'permission-denied') {
        console.error('🚫 [Firebase Service] Error de permisos - Verificar reglas de Firestore');
        userMessage = 'Error de permisos. Contacta al administrador.';
      } else if (error.code === 'unavailable') {
        console.error('🌐 [Firebase Service] Firebase no disponible - Verificar conexión');
        userMessage = 'Servicio temporalmente no disponible. Inténtalo más tarde.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('📡 [Firebase Service] Error de red - Verificar conectividad');
        userMessage = 'Error de conexión. Verifica tu internet.';
      } else if (error.code === 'invalid-argument') {
        console.error('📝 [Firebase Service] Datos inválidos enviados a Firestore');
        userMessage = 'Datos del formulario inválidos. Revisa la información.';
      } else if (error.message.includes('400')) {
        console.error('🔧 [Firebase Service] Error 400 - Bad Request, posible problema de configuración');
        userMessage = 'Error de configuración. Contacta al soporte técnico.';
      }

      return {
        success: false,
        error: error.message,
        errorCode: error.code,
        message: userMessage
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
