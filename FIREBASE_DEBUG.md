# 🔥 Guía de Solución - Firebase en Producción

## Problema Identificado
El formulario de inscripción funciona en desarrollo pero NO en producción. 

## 🚨 Diagnóstico del Problema

### Causas Más Comunes:

1. **Variables de Entorno No Configuradas en Producción** (90% de los casos)
2. **Reglas de Firestore Incorrectas** 
3. **CORS o Configuración de Dominio**
4. **Build Process Issues**

## 🛠️ Soluciones Paso a Paso

### Solución 1: Variables de Entorno ✅

**Para Netlify:**
```bash
# En Netlify Dashboard > Site Settings > Environment Variables
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Para Vercel:**
```bash
# En Vercel Dashboard > Project Settings > Environment Variables
# Mismo formato que arriba
```

**Para hosting tradicional:**
```bash
# Crear archivo .env en el servidor con las variables
# Y hacer build EN EL SERVIDOR, no subir el build local
```

### Solución 2: Reglas de Firestore 🔐

En Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir escritura en inscripciones
    match /inscripciones/{document} {
      allow read, write: if true; // TEMPORAL para testing
    }
  }
}
```

**⚠️ IMPORTANTE:** Esta regla es temporal. En producción real deberías usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inscripciones/{document} {
      allow create: if true; // Solo crear nuevas inscripciones
      allow read, update, delete: if false; // No permitir otras operaciones
    }
  }
}
```

### Solución 3: Verificar Dominio en Firebase 🌐

1. Ve a Firebase Console > Authentication > Settings
2. En "Authorized domains" agrega tu dominio de producción:
   - `tu-sitio.netlify.app`
   - `tu-sitio.vercel.app` 
   - `tu-dominio.com`

### Solución 4: Debug en Producción 🔍

El sitio ahora incluye un panel de debug. En producción:

1. Abre tu sitio
2. Verás un botón "🔧 Debug Firebase" en la esquina inferior derecha
3. Haz clic para ver el estado de la configuración
4. Envía una captura de pantalla del panel de debug

## 🚀 Pasos de Implementación

### Opción A: Re-deployar con Variables Correctas

1. **Configurar variables de entorno en tu plataforma de hosting**
2. **Hacer nuevo deployment** (no subir build local)
3. **Verificar con el panel de debug**

### Opción B: Build Local y Upload

```bash
# 1. Asegúrate de que .env esté correcto localmente
# 2. Hacer build
npm run build

# 3. Subir carpeta dist/ a tu hosting
# (Solo si tu hosting no hace build automático)
```

## 🆘 Si Nada Funciona

Ejecuta este comando y envía el resultado:

```bash
# En consola del navegador de PRODUCCIÓN
console.log('Environment:', import.meta.env.MODE);
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET'
});
```

## 📋 Checklist de Verificación

- [ ] Variables de entorno configuradas en plataforma de hosting
- [ ] Reglas de Firestore permiten escritura
- [ ] Dominio autorizado en Firebase Authentication
- [ ] Panel de debug muestra configuración correcta
- [ ] Consola del navegador no muestra errores
- [ ] Formulario envía datos sin errores

## 📞 Contacto para Debug

Si el problema persiste, envía:
1. Captura del panel de debug en producción
2. URL de tu sitio en producción  
3. Errores de la consola del navegador
4. Plataforma de hosting que usas (Netlify/Vercel/otro)
