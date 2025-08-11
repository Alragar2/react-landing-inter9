// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Las variables de entorno se cargan automáticamente desde el archivo .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validación completa de configuración
console.log('🔧 [Firebase Config] Validando configuración...');
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  console.error('❌ [Firebase Config] Campos faltantes:', missingFields);
  console.error('🔧 [Firebase Config] Configuración actual:', firebaseConfig);
  
  // En producción, mostrar un error más amigable
  if (import.meta.env.PROD) {
    console.error('🚨 ERROR DE CONFIGURACIÓN EN PRODUCCIÓN:');
    console.error('Las variables de entorno de Firebase no están configuradas en tu hosting.');
    console.error('Configura estas variables en tu plataforma de hosting:');
    console.error('VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.');
  }
  
  throw new Error(`🚨 CONFIGURAR VARIABLES DE ENTORNO EN HOSTING: ${missingFields.join(', ')}`);
}

console.log('✅ [Firebase Config] Configuración válida');
console.log('📊 [Firebase Config] Proyecto:', firebaseConfig.projectId);

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ [Firebase App] Inicializado correctamente');
} catch (error) {
  console.error('❌ [Firebase App] Error al inicializar:', error);
  throw error;
}

// Initialize Cloud Firestore and get a reference to the service
let db;
try {
  db = getFirestore(app);
  console.log('✅ [Firestore] Inicializado correctamente');
  
  // En desarrollo, agregar debugging adicional
  if (import.meta.env.DEV) {
    console.log('🔧 [Firestore] Modo desarrollo - Debug habilitado');
  }
} catch (error) {
  console.error('❌ [Firestore] Error al inicializar:', error);
  throw error;
}

export { db };

// Initialize Analytics (opcional)
// export const analytics = getAnalytics(app);

export default app;
