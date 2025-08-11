// Utilidad para debuggear Firebase en producción
export const debugFirebaseConfig = () => {
    console.log('🔧 === DEBUG DE CONFIGURACIÓN FIREBASE ===');
    console.log('🌍 Entorno:', import.meta.env.MODE);
    console.log('🏗️ Es producción:', import.meta.env.PROD);
    console.log('🛠️ Es desarrollo:', import.meta.env.DEV);
    
    const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    console.log('📋 Variables de entorno Firebase:');
    Object.keys(config).forEach(key => {
        const value = config[key];
        console.log(`  ${key}: ${value ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
        if (value) {
            console.log(`    Valor: ${value.substring(0, 10)}...`);
        }
    });

    // Verificar que todas las variables estén presentes
    const missingVars = Object.keys(config).filter(key => !config[key]);
    if (missingVars.length > 0) {
        console.error('❌ Variables de entorno faltantes:', missingVars);
        return false;
    }

    console.log('✅ Todas las variables de entorno están configuradas');
    return true;
};

export const testFirebaseConnection = async () => {
    try {
        console.log('🔌 Probando conexión a Firebase...');
        
        // Importar dinámicamente para evitar errores si Firebase no está configurado
        const { db } = await import('../firebase/config.js');
        const { collection, getDocs, limit, query } = await import('firebase/firestore');
        
        // Intentar hacer una consulta simple
        const testQuery = query(collection(db, 'test'), limit(1));
        const snapshot = await getDocs(testQuery);
        
        console.log('✅ Conexión a Firebase exitosa');
        console.log('📊 Documentos de prueba encontrados:', snapshot.size);
        return true;
        
    } catch (error) {
        console.error('❌ Error de conexión a Firebase:', error);
        return false;
    }
};

// Función para ejecutar todos los tests de debug
export const runFirebaseDebug = async () => {
    console.log('🚀 === INICIANDO DEBUG COMPLETO DE FIREBASE ===');
    
    const configOk = debugFirebaseConfig();
    
    if (configOk) {
        await testFirebaseConnection();
    } else {
        console.error('💥 No se puede probar la conexión sin configuración válida');
    }
    
    console.log('🏁 === DEBUG COMPLETADO ===');
};
