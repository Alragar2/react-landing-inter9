// Detector automático de plataforma de hosting
export const detectHostingPlatform = () => {
    const url = window.location.href;
    const hostname = window.location.hostname;
    
    console.log('🔍 Detectando plataforma de hosting...');
    console.log('URL:', url);
    console.log('Hostname:', hostname);
    
    let platform = 'unknown';
    let instructions = '';
    
    if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
        platform = 'netlify';
        instructions = `
🔷 NETLIFY DETECTADO
1. Ve a app.netlify.com
2. Selecciona tu sitio
3. Site settings → Environment variables
4. Add variable para cada VITE_FIREBASE_*
5. Redespliega el sitio
        `;
    } else if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
        platform = 'vercel';
        instructions = `
🔶 VERCEL DETECTADO
1. Ve a vercel.com/dashboard
2. Selecciona tu proyecto
3. Settings → Environment Variables
4. Add para cada VITE_FIREBASE_*
5. Redespliega
        `;
    } else if (hostname.includes('github.io')) {
        platform = 'github-pages';
        instructions = `
🔸 GITHUB PAGES DETECTADO
GitHub Pages no soporta variables de entorno.
Opciones:
1. Hacer build local y subir dist/
2. Usar GitHub Actions con secrets
        `;
    } else if (hostname.includes('firebase.app') || hostname.includes('firebaseapp.com')) {
        platform = 'firebase-hosting';
        instructions = `
🔥 FIREBASE HOSTING DETECTADO
1. Configurar variables en firebase.json
2. O usar build local con variables
        `;
    } else if (hostname.includes('surge.sh')) {
        platform = 'surge';
        instructions = `
⚡ SURGE DETECTADO
Surge no soporta variables de entorno.
Debes hacer build local con .env configurado.
        `;
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        platform = 'localhost';
        instructions = `
💻 DESARROLLO LOCAL DETECTADO
Las variables se leen desde .env
        `;
    } else {
        platform = 'custom';
        instructions = `
🔹 HOSTING PERSONALIZADO DETECTADO
1. Crear archivo .env en el servidor
2. npm install && npm run build
3. O configurar variables de entorno en el panel
        `;
    }
    
    console.log('🎯 Plataforma detectada:', platform);
    console.log('📋 Instrucciones:', instructions);
    
    return {
        platform,
        hostname,
        url,
        instructions,
        isLocal: platform === 'localhost',
        isProduction: platform !== 'localhost'
    };
};

export const showHostingInstructions = () => {
    const detection = detectHostingPlatform();
    
    if (detection.isLocal) {
        console.log('✅ Estás en desarrollo local');
        return;
    }
    
    // Mostrar alerta con instrucciones específicas
    const message = `
🔍 PLATAFORMA DETECTADA: ${detection.platform.toUpperCase()}

${detection.instructions}

¿Necesitas las variables de Firebase?
- Revisa el archivo PRODUCTION_ENV_GUIDE.md
- O usa el botón "🔧 Debug Firebase" en tu sitio
    `;
    
    console.log(message);
    
    // En producción, mostrar alert si hay problemas
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        alert(`⚠️ Variables Firebase no configuradas en ${detection.platform.toUpperCase()}\n\nRevisa la consola para instrucciones específicas.`);
    }
    
    return detection;
};
