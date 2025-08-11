import React, { useState, useEffect } from 'react';
import { detectHostingPlatform } from '../utils/hostingDetector';

const ProductionDebugger = () => {
    const [debugInfo, setDebugInfo] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const gatherProductionInfo = () => {
        const hostingInfo = detectHostingPlatform();
        
        const info = {
            // Información del hosting
            hosting: hostingInfo,
            
            // Información del entorno
            environment: {
                mode: import.meta.env.MODE,
                isDev: import.meta.env.DEV,
                isProd: import.meta.env.PROD,
                base: import.meta.env.BASE_URL
            },
            
            // Variables de Firebase
            firebase: {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID,
                measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
            },
            
            // Estado de las variables
            status: {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'MISSING',
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'SET' : 'MISSING',
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'SET' : 'MISSING',
                appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'SET' : 'MISSING'
            },
            
            // Información adicional
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        setDebugInfo(info);
        console.log('🔍 [PRODUCTION DEBUG] Información completa:', info);
        
        return info;
    };

    const copyToClipboard = async () => {
        const info = gatherProductionInfo();
        const text = JSON.stringify(info, null, 2);
        
        try {
            await navigator.clipboard.writeText(text);
            alert('✅ Información de debug copiada al portapapeles');
        } catch (err) {
            // Fallback para navegadores que no soporten clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Información de debug copiada al portapapeles');
        }
    };

    useEffect(() => {
        if (import.meta.env.PROD) {
            // En producción, mostrar automáticamente si hay problemas
            const info = gatherProductionInfo();
            const hasAllVars = Object.values(info.status).every(status => status === 'SET');
            
            if (!hasAllVars) {
                setIsVisible(true);
            }
        }
    }, []);

    // Botón flotante para mostrar debug
    if (!isVisible) {
        return (
            <button
                onClick={() => {
                    setIsVisible(true);
                    gatherProductionInfo();
                }}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: import.meta.env.PROD ? '#ff4444' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    zIndex: 9999,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
                title="Diagnóstico de Firebase para producción"
            >
                🔧 Debug Firebase
            </button>
        );
    }

    if (!debugInfo) {
        gatherProductionInfo();
        return null;
    }

    const hasIssues = Object.values(debugInfo.status).includes('MISSING');

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            right: '20px',
            background: 'white',
            border: `3px solid ${hasIssues ? '#ff4444' : '#4CAF50'}`,
            padding: '20px',
            borderRadius: '12px',
            zIndex: 9999,
            fontSize: '13px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '2px solid #eee'
            }}>
                <h2 style={{ margin: 0, color: hasIssues ? '#ff4444' : '#4CAF50' }}>
                    🔧 Diagnóstico Firebase - {debugInfo.environment.isProd ? 'PRODUCCIÓN' : 'DESARROLLO'}
                </h2>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        fontSize: '20px', 
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ✕
                </button>
            </div>

            {hasIssues && (
                <div style={{
                    background: '#ffe6e6',
                    border: '2px solid #ff4444',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#cc0000' }}>
                        ❌ PROBLEMA DETECTADO
                    </h3>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                        Variables de entorno de Firebase no configuradas en producción.
                    </p>
                    <p style={{ margin: 0, fontSize: '12px' }}>
                        Esto explica por qué funciona en localhost pero no en producción.
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🌐 Hosting</h4>
                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        <div><strong>Plataforma:</strong> {debugInfo.hosting.platform}</div>
                        <div><strong>Hostname:</strong> {debugInfo.hosting.hostname}</div>
                        <div style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                            {debugInfo.hosting.isLocal ? '💻 Local' : '🌐 Producción'}
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🌍 Entorno</h4>
                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        <div><strong>Modo:</strong> {debugInfo.environment.mode}</div>
                        <div><strong>Producción:</strong> {debugInfo.environment.isProd ? '✅ Sí' : '❌ No'}</div>
                        <div><strong>Desarrollo:</strong> {debugInfo.environment.isDev ? '✅ Sí' : '❌ No'}</div>
                    </div>
                </div>

                <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🔥 Estado Firebase</h4>
                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        {Object.entries(debugInfo.status).map(([key, status]) => (
                            <div key={key} style={{ marginBottom: '3px' }}>
                                <span style={{ color: status === 'SET' ? 'green' : 'red' }}>
                                    {status === 'SET' ? '✅' : '❌'}
                                </span>
                                <strong> {key}:</strong> {status}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📋 Variables de Firebase</h4>
                <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px', fontSize: '11px' }}>
                    {Object.entries(debugInfo.firebase).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '5px', wordBreak: 'break-all' }}>
                            <strong>{key}:</strong> {value || '❌ NO CONFIGURADO'}
                        </div>
                    ))}
                </div>
            </div>

            {hasIssues && (
                <div style={{
                    background: '#e6f3ff',
                    border: '2px solid #0066cc',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
                        🛠️ SOLUCIÓN PARA {debugInfo.hosting.platform.toUpperCase()}
                    </h4>
                    <div style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>
                        <strong>Instrucciones específicas:</strong>
                        {debugInfo.hosting.instructions}
                    </div>
                    
                    <div style={{ marginTop: '10px', padding: '8px', background: '#f0f8ff', borderRadius: '4px' }}>
                        <strong>📋 Variables que necesitas configurar:</strong>
                        <div style={{ fontSize: '10px', fontFamily: 'monospace', marginTop: '5px' }}>
                            {Object.entries(debugInfo.firebase).map(([key, value]) => (
                                <div key={key}>
                                    {key}={value || 'NO_CONFIGURADO'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={copyToClipboard}
                    style={{
                        background: '#007ACC',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    📋 Copiar Info Debug
                </button>
                
                <button 
                    onClick={gatherProductionInfo}
                    style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    🔄 Actualizar Info
                </button>
            </div>

            <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#f0f0f0', 
                borderRadius: '5px',
                fontSize: '11px',
                color: '#666'
            }}>
                <strong>URL:</strong> {debugInfo.url}<br/>
                <strong>Timestamp:</strong> {debugInfo.timestamp}
            </div>
        </div>
    );
};

export default ProductionDebugger;
