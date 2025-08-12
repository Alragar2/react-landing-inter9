import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './config';

// Servicio para manejar la autenticación de administradores
export const authService = {
  
  // Iniciar sesión con email y contraseña
  async signInAdmin(email, password) {
    try {
      console.log('🔐 [Auth Service] Intentando login para:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ [Auth Service] Login exitoso:', {
        uid: user.uid,
        email: user.email
      });
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        },
        message: 'Login exitoso'
      };
    } catch (error) {
      console.error('❌ [Auth Service] Error en login:', error);
      
      let userMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          userMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          userMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          userMessage = 'Email inválido';
          break;
        case 'auth/user-disabled':
          userMessage = 'Usuario deshabilitado';
          break;
        case 'auth/too-many-requests':
          userMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/network-request-failed':
          userMessage = 'Error de conexión. Verifica tu internet';
          break;
        case 'auth/invalid-credential':
          userMessage = 'Credenciales inválidas';
          break;
        default:
          userMessage = 'Error de autenticación. Contacta al administrador';
      }
      
      return {
        success: false,
        error: error.code,
        message: userMessage
      };
    }
  },

  // Cerrar sesión
  async signOutAdmin() {
    try {
      await signOut(auth);
      console.log('✅ [Auth Service] Logout exitoso');
      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      console.error('❌ [Auth Service] Error en logout:', error);
      return {
        success: false,
        error: error.code,
        message: 'Error al cerrar sesión'
      };
    }
  },

  // Obtener el usuario actual
  getCurrentUser() {
    return auth.currentUser;
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Enviar email de reset de contraseña
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ [Auth Service] Email de reset enviado a:', email);
      return {
        success: true,
        message: 'Email de recuperación enviado'
      };
    } catch (error) {
      console.error('❌ [Auth Service] Error al enviar reset:', error);
      
      let userMessage = 'Error al enviar email de recuperación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          userMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/invalid-email':
          userMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          userMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          userMessage = 'Error al enviar email de recuperación';
      }
      
      return {
        success: false,
        error: error.code,
        message: userMessage
      };
    }
  },

  // Verificar si el usuario actual es un administrador válido
  async isValidAdmin() {
    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    // Si el usuario está autenticado en Firebase, es un administrador válido
    // Ya que solo los administradores tienen cuentas creadas manualmente
    return true;
  }
};

export default authService;
