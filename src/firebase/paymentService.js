import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './config';

// Nombre de las colecciones en Firestore
const PAYMENTS_COLLECTION = 'pagos';
const INSCRIPTIONS_COLLECTION = 'inscripciones';

// Servicio para manejar los pagos en Firebase
export const paymentService = {
  
  // Crear un nuevo pago
  async createPayment(inscriptionId, paymentData) {
    console.log('🔥 [Payment Service] Iniciando createPayment...');
    console.log('📊 [Payment Service] ID Inscripción:', inscriptionId);
    console.log('📊 [Payment Service] Datos del pago:', paymentData);
    
    try {
      // Verificar que la inscripción existe
      const inscriptionRef = doc(db, INSCRIPTIONS_COLLECTION, inscriptionId);
      const inscriptionSnap = await getDoc(inscriptionRef);
      
      if (!inscriptionSnap.exists()) {
        throw new Error('La inscripción no existe');
      }

      const inscriptionData = inscriptionSnap.data();
      console.log('📋 [Payment Service] Inscripción encontrada:', inscriptionData.nombreNino);

      // Preparar datos del pago
      const paymentToSave = {
        inscriptionId: inscriptionId,
        inscriptionName: `${inscriptionData.nombreNino} ${inscriptionData.apellidos}`,
        monto: parseFloat(paymentData.monto),
        metodo: paymentData.metodo, // 'banco' o 'mano'
        concepto: paymentData.concepto || 'Pago campus Inter9',
        notas: paymentData.notas || '',
        registradoPor: paymentData.registradoPor || 'Administrador',
        fechaCreacion: Timestamp.now(),
        estado: 'confirmado'
      };

      console.log('💾 [Payment Service] Guardando pago:', paymentToSave);

      // Guardar el pago en la colección de pagos
      const paymentsRef = collection(db, PAYMENTS_COLLECTION);
      const docRef = await addDoc(paymentsRef, paymentToSave);

      console.log('✅ [Payment Service] Pago guardado con ID:', docRef.id);

      // Actualizar totales en la inscripción
      await this.updateInscriptionTotals(inscriptionId);

      return {
        success: true,
        id: docRef.id,
        message: 'Pago registrado correctamente',
        data: { id: docRef.id, ...paymentToSave }
      };

    } catch (error) {
      console.error('💥 [Payment Service] Error al crear pago:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Error al registrar el pago. Inténtalo de nuevo.'
      };
    }
  },

  // Obtener todos los pagos de una inscripción
  async getPaymentsByInscription(inscriptionId) {
    try {
      console.log('🔍 [Payment Service] Buscando pagos para inscripción:', inscriptionId);
      
      const paymentsQuery = query(
        collection(db, PAYMENTS_COLLECTION),
        where('inscriptionId', '==', inscriptionId),
        orderBy('fechaCreacion', 'desc')
      );

      const querySnapshot = await getDocs(paymentsQuery);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ [Payment Service] ${payments.length} pagos encontrados`);

      return {
        success: true,
        data: payments
      };

    } catch (error) {
      console.error('❌ [Payment Service] Error al obtener pagos:', error);
      
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Obtener todos los pagos (para administración)
  async getAllPayments() {
    try {
      const paymentsQuery = query(
        collection(db, PAYMENTS_COLLECTION),
        orderBy('fechaCreacion', 'desc')
      );

      const querySnapshot = await getDocs(paymentsQuery);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: payments
      };

    } catch (error) {
      console.error('❌ [Payment Service] Error al obtener todos los pagos:', error);
      
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Actualizar totales de pago en la inscripción
  async updateInscriptionTotals(inscriptionId) {
    try {
      console.log('🔄 [Payment Service] Actualizando totales para inscripción:', inscriptionId);

      // Obtener todos los pagos de esta inscripción
      const paymentsResult = await this.getPaymentsByInscription(inscriptionId);
      
      if (!paymentsResult.success) {
        throw new Error('No se pudieron obtener los pagos');
      }

      const payments = paymentsResult.data;
      
      // Calcular totales
      const totalPagado = payments.reduce((sum, payment) => sum + payment.monto, 0);
      const montoCampus = 120; // Precio del campus
      const estadoPago = totalPagado >= montoCampus ? 'pagado' : totalPagado > 0 ? 'parcial' : 'pendiente';
      
      // Obtener el último pago (más reciente)
      const ultimoPago = payments.length > 0 ? payments[0] : null;

      // Actualizar la inscripción
      const inscriptionRef = doc(db, INSCRIPTIONS_COLLECTION, inscriptionId);
      const updateData = {
        totalPagado: totalPagado,
        estadoPago: estadoPago,
        cantidadPagos: payments.length,
        fechaActualizacion: Timestamp.now()
      };

      if (ultimoPago) {
        updateData.ultimoPago = {
          fecha: ultimoPago.fechaCreacion,
          monto: ultimoPago.monto,
          metodo: ultimoPago.metodo
        };
      }

      await updateDoc(inscriptionRef, updateData);

      console.log('✅ [Payment Service] Totales actualizados:', {
        totalPagado,
        estadoPago,
        cantidadPagos: payments.length
      });

      return {
        success: true,
        totals: {
          totalPagado,
          estadoPago,
          cantidadPagos: payments.length
        }
      };

    } catch (error) {
      console.error('❌ [Payment Service] Error al actualizar totales:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Eliminar un pago
  async deletePayment(paymentId, inscriptionId) {
    try {
      console.log('🗑️ [Payment Service] Eliminando pago:', paymentId);

      // Eliminar el pago
      await deleteDoc(doc(db, PAYMENTS_COLLECTION, paymentId));

      // Actualizar totales de la inscripción
      await this.updateInscriptionTotals(inscriptionId);

      console.log('✅ [Payment Service] Pago eliminado correctamente');

      return {
        success: true,
        message: 'Pago eliminado correctamente'
      };

    } catch (error) {
      console.error('❌ [Payment Service] Error al eliminar pago:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Error al eliminar el pago'
      };
    }
  },

  // Calcular resumen de pagos para una inscripción
  async getPaymentSummary(inscriptionId) {
    try {
      const paymentsResult = await this.getPaymentsByInscription(inscriptionId);
      
      if (!paymentsResult.success) {
        return {
          success: false,
          error: paymentsResult.error
        };
      }

      const payments = paymentsResult.data;
      const totalPagado = payments.reduce((sum, payment) => sum + payment.monto, 0);
      const montoCampus = 120;
      const pendiente = Math.max(0, montoCampus - totalPagado);
      const estadoPago = totalPagado >= montoCampus ? 'pagado' : totalPagado > 0 ? 'parcial' : 'pendiente';

      const pagosPorMetodo = payments.reduce((acc, payment) => {
        acc[payment.metodo] = (acc[payment.metodo] || 0) + payment.monto;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          totalPagado,
          pendiente,
          estadoPago,
          cantidadPagos: payments.length,
          pagosPorMetodo,
          montoCampus,
          ultimoPago: payments.length > 0 ? payments[0] : null
        }
      };

    } catch (error) {
      console.error('❌ [Payment Service] Error al calcular resumen:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default paymentService;
