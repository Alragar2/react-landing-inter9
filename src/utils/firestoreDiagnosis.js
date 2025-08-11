// Utilidad específica para diagnosticar errores 400 de Firestore
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, limit, doc, setDoc } from 'firebase/firestore';

export const diagnoseFirestoreError = async () => {
    console.log('🔍 === DIAGNÓSTICO COMPLETO DE FIRESTORE ===');
    
    try {
        // 1. Verificar que db esté disponible
        console.log('1️⃣ Verificando inicialización de Firestore...');
        if (!db) {
            console.error('❌ Firestore no está inicializado');
            return { success: false, error: 'Firestore no inicializado' };
        }
        console.log('✅ Firestore inicializado correctamente');

        // 2. Probar lectura de una colección (menos restrictivo)
        console.log('2️⃣ Probando lectura de colección...');
        try {
            const testQuery = query(collection(db, 'test'), limit(1));
            const snapshot = await getDocs(testQuery);
            console.log('✅ Lectura exitosa. Documentos encontrados:', snapshot.size);
        } catch (readError) {
            console.error('❌ Error en lectura:', readError);
        }

        // 3. Probar escritura simple con datos mínimos
        console.log('3️⃣ Probando escritura simple...');
        try {
            const testData = {
                test: true,
                timestamp: new Date().toISOString(),
                source: 'web-app'
            };
            
            const docRef = await addDoc(collection(db, 'test'), testData);
            console.log('✅ Escritura exitosa. ID del documento:', docRef.id);
            return { success: true, message: 'Conexión a Firestore funcionando correctamente' };
            
        } catch (writeError) {
            console.error('❌ Error en escritura:', writeError);
            
            // 4. Si addDoc falla, probar con setDoc
            console.log('4️⃣ Probando escritura con setDoc...');
            try {
                const testDocRef = doc(db, 'test', 'test-' + Date.now());
                await setDoc(testDocRef, {
                    test: true,
                    timestamp: new Date().toISOString(),
                    method: 'setDoc'
                });
                console.log('✅ SetDoc exitoso');
                return { success: true, message: 'Conexión funcionando con setDoc' };
            } catch (setDocError) {
                console.error('❌ Error en setDoc también:', setDocError);
                return { 
                    success: false, 
                    error: setDocError.message,
                    code: setDocError.code 
                };
            }
        }

    } catch (generalError) {
        console.error('💥 Error general en diagnóstico:', generalError);
        return { 
            success: false, 
            error: generalError.message,
            code: generalError.code 
        };
    }
};

export const checkFirestoreRules = async () => {
    console.log('🔒 === VERIFICANDO REGLAS DE FIRESTORE ===');
    
    try {
        // Intentar operaciones que requieren diferentes permisos
        const testCollection = collection(db, 'inscripciones');
        
        // 1. Probar lectura
        console.log('📖 Probando permisos de lectura...');
        try {
            const readQuery = query(testCollection, limit(1));
            await getDocs(readQuery);
            console.log('✅ Permisos de lectura: OK');
        } catch (error) {
            console.log('❌ Permisos de lectura: DENEGADOS');
            console.error('Error de lectura:', error.code, error.message);
        }

        // 2. Probar escritura
        console.log('✍️ Probando permisos de escritura...');
        try {
            const testDoc = {
                test: true,
                timestamp: new Date().toISOString(),
                purpose: 'permission-test'
            };
            
            await addDoc(testCollection, testDoc);
            console.log('✅ Permisos de escritura: OK');
            return { write: true, read: true };
            
        } catch (error) {
            console.log('❌ Permisos de escritura: DENEGADOS');
            console.error('Error de escritura:', error.code, error.message);
            
            if (error.code === 'permission-denied') {
                console.log('🔧 SOLUCIÓN: Actualizar reglas de Firestore');
                console.log(`
🔥 Reglas sugeridas para Firestore:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inscripciones/{document} {
      allow create: if true;
    }
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
                `);
            }
            
            return { write: false, read: false, error: error.code };
        }

    } catch (error) {
        console.error('💥 Error verificando reglas:', error);
        return { error: error.message };
    }
};

export const runCompleteFirestoreDiagnosis = async () => {
    console.log('🚀 === DIAGNÓSTICO COMPLETO INICIADO ===');
    
    const diagnosis = await diagnoseFirestoreError();
    const rules = await checkFirestoreRules();
    
    console.log('📊 === RESUMEN DEL DIAGNÓSTICO ===');
    console.log('Conexión básica:', diagnosis.success ? '✅' : '❌');
    console.log('Permisos de escritura:', rules.write ? '✅' : '❌');
    console.log('Permisos de lectura:', rules.read ? '✅' : '❌');
    
    if (!diagnosis.success || !rules.write) {
        console.log('🔧 === ACCIONES REQUERIDAS ===');
        if (!diagnosis.success) {
            console.log('1. Verificar configuración de Firebase');
            console.log('2. Verificar variables de entorno');
        }
        if (!rules.write) {
            console.log('3. Actualizar reglas de Firestore (ver arriba)');
        }
    }
    
    return {
        connection: diagnosis,
        permissions: rules
    };
};
