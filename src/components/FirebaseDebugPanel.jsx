import React, { useState, useEffect } from 'react';
import { runFirebaseDebug, debugFirebaseConfig, testFirebaseConnection } from '../utils/firebaseDebug';
import { runCompleteFirestoreDiagnosis, diagnoseFirestoreError, checkFirestoreRules } from '../utils/firestoreDiagnosis';

const FirebaseDebugPanel = () => {
    const [debugInfo, setDebugInfo] = useState(null);
    const [firestoreInfo, setFirestoreInfo] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const runDebug = async () => {
        console.log('🔍 Ejecutando debug completo...');
        
        const configOk = debugFirebaseConfig();
        let connectionOk = false;
        
        if (configOk) {
            connectionOk = await testFirebaseConnection();
        }

        setDebugInfo({
            configOk,
            connectionOk,
            environment: import.meta.env.MODE,
            isProduction: import.meta.env.PROD,
            isDevelopment: import.meta.env.DEV,
            vars: {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Configurado' : 'NO CONFIGURADO',
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Configurado' : 'NO CONFIGURADO',
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Configurado' : 'NO CONFIGURADO',
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Configurado' : 'NO CONFIGURADO',
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Configurado' : 'NO CONFIGURADO',
                appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Configurado' : 'NO CONFIGURADO'
            }
        });
    };

    const runFirestoreDiagnosis = async () => {
        setIsLoading(true);
        console.log('🔧 Ejecutando diagnóstico de Firestore...');
        
        try {
            const diagnosis = await runCompleteFirestoreDiagnosis();
            setFirestoreInfo(diagnosis);
        } catch (error) {
            console.error('Error en diagnóstico:', error);
            setFirestoreInfo({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Solo mostrar en desarrollo o si hay problemas
        if (import.meta.env.DEV) {
            runDebug();
            runFirestoreDiagnosis();
        }
    }, []);

    if (!isVisible && import.meta.env.PROD) {
        return (
            <button 
                onClick={() => {
                    setIsVisible(true);
                    runDebug();
                }}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                🔧 Debug Firebase
            </button>
        );
    }

    if (!debugInfo) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'white',
            border: '2px solid #ccc',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            zIndex: 1000,
            fontSize: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>🔧 Debug Firebase</h3>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                >
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Entorno:</strong> {debugInfo.environment} 
                {debugInfo.isProduction ? ' (Producción)' : ' (Desarrollo)'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Configuración:</strong> {debugInfo.configOk ? '✅ OK' : '❌ Error'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Conexión:</strong> {debugInfo.connectionOk ? '✅ OK' : '❌ Error'}
            </div>

            {firestoreInfo && (
                <div style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                    <strong>🔥 Diagnóstico Firestore:</strong>
                    <div style={{ marginTop: '5px', fontSize: '11px' }}>
                        <div>Conexión básica: {firestoreInfo.connection?.success ? '✅' : '❌'}</div>
                        <div>Permisos lectura: {firestoreInfo.permissions?.read ? '✅' : '❌'}</div>
                        <div>Permisos escritura: {firestoreInfo.permissions?.write ? '✅' : '❌'}</div>
                        {firestoreInfo.permissions?.error && (
                            <div style={{ color: 'red', marginTop: '5px' }}>
                                Error: {firestoreInfo.permissions.error}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoading && (
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    🔄 Ejecutando diagnóstico...
                </div>
            )}

            <div style={{ marginBottom: '10px' }}>
                <strong>Variables de entorno:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {Object.entries(debugInfo.vars).map(([key, value]) => (
                        <li key={key}>
                            <code>{key}</code>: {value}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                    onClick={runDebug}
                    style={{
                        background: '#007ACC',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                >
                    🔄 Debug General
                </button>
                
                <button 
                    onClick={runFirestoreDiagnosis}
                    disabled={isLoading}
                    style={{
                        background: '#FF6B35',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        opacity: isLoading ? 0.6 : 1
                    }}
                >
                    🔥 Test Firestore
                </button>
            </div>
        </div>
    );
};

export default FirebaseDebugPanel;
