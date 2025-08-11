# 🔥 Configuración de Firebase para Inter9 Soccer Academy

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: `inter9-soccer-academy`)
4. Configura Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Firestore Database
1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (por ahora)
4. Elige una ubicación (ej: `europe-west3` para Europa)
5. Haz clic en "Listo"

### 3. Obtener configuración de la aplicación web
1. En el panel izquierdo, ve a **Configuración del proyecto** (⚙️)
2. En la pestaña "General", baja hasta "Tus aplicaciones"
3. Haz clic en el icono web `</>`
4. Nombra tu aplicación (ej: `inter9-web-app`)
5. **NO** marques "También configura Firebase Hosting"
6. Haz clic en "Registrar aplicación"
7. **Copia la configuración** que aparece (objeto `firebaseConfig`)

### 4. Configurar variables de entorno
1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores con tu configuración real:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...tu-api-key-real
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id-real
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123...
```

### 5. Configurar reglas de seguridad de Firestore
1. Ve a **Firestore Database** > **Reglas**
2. Reemplaza las reglas por estas (para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a la colección de inscripciones
    match /inscripciones/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas reglas son para desarrollo. En producción, debes implementar reglas más restrictivas.

### 6. Estructura de datos en Firestore

Las inscripciones se guardarán en la colección `inscripciones` con la siguiente estructura:

```javascript
{
  // Datos del niño
  nombreNino: "Juan",
  apellidos: "Pérez García",
  fechaNacimiento: "2010-05-15",
  edad: 13,
  categoria: "competicion",
  demarcacion: "centrocampista",
  talla: "m",
  lateralidad: "diestro",
  
  // Datos del tutor
  nombreTutor: "María García",
  telefono: "600123456",
  
  // Dirección
  direccion: "Calle Principal 123",
  ciudad: "Valencia",
  codigoPostal: "46000",
  
  // Información adicional
  alergias: "Ninguna",
  informacionInteres: "Le gusta jugar como centrocampista",
  
  // Autorizaciones
  autorizacion: true,
  politicaPrivacidad: true,
  
  // Metadatos (se agregan automáticamente)
  fechaCreacion: Timestamp,
  estado: "pendiente"
}
```

## 🚀 Iniciar el proyecto

Después de configurar Firebase:

```bash
npm run dev
```

## 📊 Ver datos en Firebase Console

1. Ve a **Firestore Database** > **Datos**
2. Verás la colección `inscripciones` con todos los registros
3. Puedes editar, eliminar o exportar los datos desde aquí

## 🔒 Seguridad en Producción

Para producción, considera:

1. **Reglas de seguridad más estrictas**
2. **Autenticación de usuarios**
3. **Validación en el servidor** usando Cloud Functions
4. **Backup automático** de la base de datos
5. **Monitoreo** y alertas
