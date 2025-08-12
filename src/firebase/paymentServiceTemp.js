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
const INSCRIPTIONS_COLLECTION = 'inscripciones';

// Servicio temporal para manejar los pagos hasta actualizar reglas de Firestore
export const paymentServiceTemp = {
  
  // Crear un nuevo pago (guardado en la inscripción)
  async createPayment(inscriptionId, paymentData) {
    console.log('🔥 [Payment Service Temp] Iniciando createPayment...');
    console.log('📊 [Payment Service Temp] ID Inscripción:', inscriptionId);
    console.log('📊 [Payment Service Temp] Datos del pago:', paymentData);
    
    try {
      // Obtener la inscripción actual
      const inscriptionRef = doc(db, INSCRIPTIONS_COLLECTION, inscriptionId);
      const inscriptionSnap = await getDoc(inscriptionRef);
      
      if (!inscriptionSnap.exists()) {
        throw new Error('La inscripción no existe');
      }

      const currentInscription = inscriptionSnap.data();
      console.log('📋 [Payment Service Temp] Inscripción encontrada:', currentInscription.nombreNino);

      // Preparar el nuevo pago
      const newPayment = {
        id: Date.now().toString(),
        fechaCreacion: Timestamp.now(),
        monto: parseFloat(paymentData.monto),
        metodo: paymentData.metodo, // 'banco' o 'mano'
        concepto: paymentData.concepto || 'Pago campus Inter9',
        notas: paymentData.notas || '',
        registradoPor: paymentData.registradoPor || 'Administrador',
        estado: 'confirmado'
      };

      // Obtener pagos existentes o crear array vacío
      const pagosExistentes = currentInscription.pagos || [];
      const nuevosPagos = [...pagosExistentes, newPayment];

      // Calcular totales
      const totalPagado = nuevosPagos.reduce((sum, pago) => sum + pago.monto, 0);
      const montoCampus = 120; // Precio del campus
      const estadoPago = totalPagado >= montoCampus ? 'pagado' : totalPagado > 0 ? 'parcial' : 'pendiente';
      
      const ultimoPago = {
        fecha: newPayment.fechaCreacion,
        monto: newPayment.monto,
        metodo: newPayment.metodo
      };

      // Actualizar la inscripción con el nuevo pago
      await updateDoc(inscriptionRef, {
        pagos: nuevosPagos,
        totalPagado: totalPagado,
        estadoPago: estadoPago,
        ultimoPago: ultimoPago,
        cantidadPagos: nuevosPagos.length,
        fechaActualizacion: Timestamp.now()
      });

      console.log('✅ [Payment Service Temp] Pago guardado exitosamente');

      return {
        success: true,
        id: newPayment.id,
        message: 'Pago registrado correctamente',
        data: newPayment
      };

    } catch (error) {
      console.error('💥 [Payment Service Temp] Error al crear pago:', error);
      
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
      console.log('🔍 [Payment Service Temp] Buscando pagos para inscripción:', inscriptionId);
      
      const inscriptionRef = doc(db, INSCRIPTIONS_COLLECTION, inscriptionId);
      const inscriptionSnap = await getDoc(inscriptionRef);
      
      if (!inscriptionSnap.exists()) {
        console.log('❌ [Payment Service Temp] Inscripción no encontrada');
        return {
          success: true,
          data: []
        };
      }

      const inscriptionData = inscriptionSnap.data();
      const payments = inscriptionData.pagos || [];

      console.log(`✅ [Payment Service Temp] ${payments.length} pagos encontrados`);

      return {
        success: true,
        data: payments
      };

    } catch (error) {
      console.error('❌ [Payment Service Temp] Error al obtener pagos:', error);
      
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Actualizar totales de pago en la inscripción (ya están actualizados)
  async updateInscriptionTotals(inscriptionId) {
    // En este caso los totales ya se actualizan al crear el pago
    // Esta función existe por compatibilidad
    return {
      success: true,
      message: 'Totales ya actualizados'
    };
  },

  // Eliminar un pago
  async deletePayment(paymentId, inscriptionId) {
    try {
      console.log('🗑️ [Payment Service Temp] Eliminando pago:', paymentId);

      const inscriptionRef = doc(db, INSCRIPTIONS_COLLECTION, inscriptionId);
      const inscriptionSnap = await getDoc(inscriptionRef);
      
      if (!inscriptionSnap.exists()) {
        throw new Error('Inscripción no encontrada');
      }

      const currentInscription = inscriptionSnap.data();
      const pagosExistentes = currentInscription.pagos || [];
      
      // Filtrar el pago a eliminar
      const nuevosPagos = pagosExistentes.filter(pago => pago.id !== paymentId);
      
      // Recalcular totales
      const totalPagado = nuevosPagos.reduce((sum, pago) => sum + pago.monto, 0);
      const montoCampus = 120;
      const estadoPago = totalPagado >= montoCampus ? 'pagado' : totalPagado > 0 ? 'parcial' : 'pendiente';
      
      const ultimoPago = nuevosPagos.length > 0 ? {
        fecha: nuevosPagos[nuevosPagos.length - 1].fechaCreacion,
        monto: nuevosPagos[nuevosPagos.length - 1].monto,
        metodo: nuevosPagos[nuevosPagos.length - 1].metodo
      } : null;

      // Actualizar la inscripción
      const updateData = {
        pagos: nuevosPagos,
        totalPagado: totalPagado,
        estadoPago: estadoPago,
        cantidadPagos: nuevosPagos.length,
        fechaActualizacion: Timestamp.now()
      };

      if (ultimoPago) {
        updateData.ultimoPago = ultimoPago;
      }

      await updateDoc(inscriptionRef, updateData);

      console.log('✅ [Payment Service Temp] Pago eliminado correctamente');

      return {
        success: true,
        message: 'Pago eliminado correctamente'
      };

    } catch (error) {
      console.error('❌ [Payment Service Temp] Error al eliminar pago:', error);
      
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
          ultimoPago: payments.length > 0 ? payments[payments.length - 1] : null
        }
      };

    } catch (error) {
      console.error('❌ [Payment Service Temp] Error al calcular resumen:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default paymentServiceTemp;
